package services

import (
	"errors"
	"fmt"
	"time"
	"anticheating/internal/config"
	"anticheating/internal/models"
	"anticheating/internal/repositories"
)

type MonitorService struct {
	cfg         *config.Config
	sessionRepo *repositories.SessionRepository
	eventRepo   *repositories.EventRepository
	logRepo     *repositories.LogRepository
}

func NewMonitorService(
	cfg *config.Config,
	sessionRepo *repositories.SessionRepository,
	eventRepo *repositories.EventRepository,
	logRepo *repositories.LogRepository,
) *MonitorService {
	return &MonitorService{
		cfg:         cfg,
		sessionRepo: sessionRepo,
		eventRepo:   eventRepo,
		logRepo:     logRepo,
	}
}

type HeartbeatReq struct {
	UserID           string    `json:"user_id" binding:"required"`
	Timestamp        time.Time `json:"timestamp" binding:"required"`
	FullscreenStatus bool      `json:"fullscreen_status"`
	TabFocusStatus   bool      `json:"tab_focus_status"`
	ConnectionStatus string    `json:"connection_status" binding:"required"`
}

func (s *MonitorService) ProcessHeartbeat(req *HeartbeatReq, ipAddress string) (*models.ExamSession, error) {
	session, err := s.sessionRepo.FindByUserID(req.UserID)
	if err != nil {
		return nil, errors.New("exam session not found for this candidate")
	}

	if session.LockedStatus || session.Status == "LOCKED" {
		return nil, errors.New("candidate exam is LOCKED due to malpractice. Submissions prevented")
	}

	if session.Status == "COMPLETED" || session.Status == "TERMINATED" {
		return nil, fmt.Errorf("candidate exam session has already ended with status: %s", session.Status)
	}

	now := time.Now()

	// Calculate remaining time based on time elapsed since last active heartbeat
	// Standard heartbeat rate is 5s, let's calculate elapsed and subtract it
	if session.Status == "ACTIVE" && !session.LastHeartbeat.IsZero() {
		elapsed := int(now.Sub(session.LastHeartbeat).Seconds())
		// Only subtract if it's a reasonable jump (e.g., > 0 and < 300 to avoid long disconnects jumps subtracting wrongly)
		if elapsed > 0 && elapsed < 300 {
			session.RemainingTime -= elapsed
			if session.RemainingTime < 0 {
				session.RemainingTime = 0
				session.Status = "COMPLETED"
				session.EndedAt = &now
			}
		}
	}

	// Update heartbeat info
	session.LastHeartbeat = now
	// If it was marked OFFLINE, change back to ACTIVE
	if session.Status == "OFFLINE" {
		session.Status = "ACTIVE"
	}

	err = s.sessionRepo.Save(session)
	if err != nil {
		return nil, err
	}

	// Log event in monitor_events table
	event := &models.MonitorEvent{
		ExamSessionID:    session.ID,
		UserID:           session.UserID,
		Timestamp:        req.Timestamp,
		FullscreenStatus: req.FullscreenStatus,
		TabFocusStatus:   req.TabFocusStatus,
		ConnectionStatus: req.ConnectionStatus,
	}
	_ = s.eventRepo.CreateEvent(event)

	return session, nil
}

type EventReq struct {
	UserID    string    `json:"user_id" binding:"required"`
	EventType string    `json:"event_type" binding:"required"` // TAB_SWITCH, EXIT_FULLSCREEN, etc.
	Details   string    `json:"details"`
	Timestamp time.Time `json:"timestamp" binding:"required"`
}

func (s *MonitorService) RecordMalpracticeEvent(req *EventReq, ipAddress string) (*models.ExamSession, error) {
	session, err := s.sessionRepo.FindByUserID(req.UserID)
	if err != nil {
		return nil, errors.New("exam session not found for this candidate")
	}

	if session.LockedStatus || session.Status == "LOCKED" {
		return nil, errors.New("candidate exam is already LOCKED")
	}

	if session.Status == "COMPLETED" || session.Status == "TERMINATED" {
		return nil, fmt.Errorf("candidate exam session has already ended with status: %s", session.Status)
	}

	// Store Violation in db
	violation := &models.Violation{
		ExamSessionID: session.ID,
		UserID:        session.UserID,
		EventType:     req.EventType,
		Details:       req.Details,
		Timestamp:     req.Timestamp,
	}
	err = s.eventRepo.CreateViolation(violation)
	if err != nil {
		return nil, err
	}

	// Increment warning count
	session.WarningCount++

	// Create audit log for the malpractice event
	auditLog := &models.ActivityLog{
		UserID:    session.UserID,
		Username:  session.Name,
		Action:    req.EventType,
		Details:   fmt.Sprintf("Malpractice violation detected: %s. Warning count: %d. Details: %s", req.EventType, session.WarningCount, req.Details),
		Timestamp: req.Timestamp,
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(auditLog)

	// Check Auto Lock condition
	if session.WarningCount >= session.MaxWarnings {
		session.LockedStatus = true
		session.Status = "LOCKED"

		// Save LockedUser model details
		lockedUser := &models.LockedUser{
			UserID:       session.UserID,
			Name:         session.Name,
			LockReason:   fmt.Sprintf("Warning limit exceeded. Warning count: %d. Last violation: %s", session.WarningCount, req.EventType),
			WarningCount: session.WarningCount,
			LockedTime:   time.Now(),
		}
		_ = s.sessionRepo.CreateLockedUser(lockedUser)

		// Audit Log for Lock
		lockLog := &models.ActivityLog{
			UserID:    "SYSTEM",
			Username:  "Auto-Lock System",
			Action:    "LOCK",
			Details:   fmt.Sprintf("Candidate %s (ID: %s) automatically locked. Reason: %s", session.Name, session.UserID, lockedUser.LockReason),
			Timestamp: time.Now(),
			IPAddress: "127.0.0.1",
		}
		_ = s.logRepo.Create(lockLog)
	}

	err = s.sessionRepo.Save(session)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s *MonitorService) GetCandidateHistory(userID string) ([]models.Violation, error) {
	if userID == "" {
		return nil, errors.New("user ID is required")
	}
	return s.eventRepo.FindViolationsByUserID(userID)
}

func (s *MonitorService) CheckOfflineSessions() {
	sessions, err := s.sessionRepo.GetOfflineSessions(s.cfg.OfflineThresholdSec)
	if err != nil {
		return
	}

	for _, session := range sessions {
		// Update status to OFFLINE
		session.Status = "OFFLINE"
		_ = s.sessionRepo.Save(&session)

		// Create activity audit log for going offline
		offlineLog := &models.ActivityLog{
			UserID:    session.UserID,
			Username:  session.Name,
			Action:    "HEARTBEAT_OFFLINE",
			Details:   fmt.Sprintf("Candidate marked OFFLINE due to missed heartbeat (limit: %ds)", s.cfg.OfflineThresholdSec),
			Timestamp: time.Now(),
			IPAddress: "127.0.0.1",
		}
		_ = s.logRepo.Create(offlineLog)
	}
}

func (s *MonitorService) LockSessionManually(userID, reason, ipAddress string) (*models.ExamSession, error) {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("exam session not found")
	}

	if session.LockedStatus || session.Status == "LOCKED" {
		return session, nil // already locked
	}

	session.LockedStatus = true
	session.Status = "LOCKED"
	if err := s.sessionRepo.Save(session); err != nil {
		return nil, err
	}

	lockedUser := &models.LockedUser{
		UserID:       session.UserID,
		Name:         session.Name,
		LockReason:   reason,
		WarningCount: session.WarningCount,
		LockedTime:   time.Now(),
	}
	_ = s.sessionRepo.CreateLockedUser(lockedUser)

	// Create activity log
	logEntry := &models.ActivityLog{
		UserID:    "ADMIN",
		Username:  "Administrator",
		Action:    "LOCK",
		Details:   fmt.Sprintf("Candidate manually locked. Reason: %s", reason),
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	return session, nil
}
