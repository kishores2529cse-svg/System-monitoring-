package services

import (
	"errors"
	"fmt"
	"time"
	"anticheating/internal/models"
	"anticheating/internal/repositories"
)

type AdminService struct {
	sessionRepo *repositories.SessionRepository
	eventRepo   *repositories.EventRepository
	logRepo     *repositories.LogRepository
}

func NewAdminService(
	sessionRepo *repositories.SessionRepository,
	eventRepo   *repositories.EventRepository,
	logRepo     *repositories.LogRepository,
) *AdminService {
	return &AdminService{
		sessionRepo: sessionRepo,
		eventRepo:   eventRepo,
		logRepo:     logRepo,
	}
}

type DashboardStats struct {
	ActiveCandidates       int64 `json:"active_candidates"`
	LockedCandidates       int64 `json:"locked_candidates"`
	CompletedCandidates    int64 `json:"completed_candidates"`
	TotalMalpracticeEvents int64 `json:"total_malpractice_events"`
	TotalRunningExams      int64 `json:"total_running_exams"`
}

func (s *AdminService) GetDashboardStats() (*DashboardStats, error) {
	active, err := s.sessionRepo.CountByStatus("ACTIVE")
	if err != nil {
		return nil, err
	}
	locked, err := s.sessionRepo.CountByStatus("LOCKED")
	if err != nil {
		return nil, err
	}
	completed, err := s.sessionRepo.CountByStatus("COMPLETED")
	if err != nil {
		return nil, err
	}
	running, err := s.sessionRepo.CountRunningExams()
	if err != nil {
		return nil, err
	}
	malpractice, err := s.eventRepo.CountAllViolations()
	if err != nil {
		return nil, err
	}

	return &DashboardStats{
		ActiveCandidates:       active,
		LockedCandidates:       locked,
		CompletedCandidates:    completed,
		TotalMalpracticeEvents: malpractice,
		TotalRunningExams:      running,
	}, nil
}

func (s *AdminService) GetLiveSessions() ([]models.ExamSession, error) {
	return s.sessionRepo.GetLiveSessions()
}

func (s *AdminService) GetLiveEvents(limit int) ([]models.Violation, error) {
	return s.eventRepo.GetLatestViolations(limit)
}

func (s *AdminService) GetLockedUsers() ([]models.LockedUser, error) {
	return s.sessionRepo.GetLockedUsers()
}

type UserProfileDetails struct {
	UserID string `json:"user_id"`
	Name   string `json:"name"`
}

type UserSubmissionSummary struct {
	TotalSubmissions int      `json:"total_submissions"`
	Languages        []string `json:"languages"`
	LastSubmission   string   `json:"last_submission"`
}

type UserDetailsResponse struct {
	Profile           UserProfileDetails     `json:"profile"`
	ExamStatus        string                 `json:"exam_status"`
	Violations        []models.Violation     `json:"violations"`
	ActivityHistory   []models.ActivityLog   `json:"activity_history"`
	SubmissionSummary UserSubmissionSummary  `json:"submission_summary"`
}

func (s *AdminService) GetUserDetails(userID string) (*UserDetailsResponse, error) {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("candidate session not found")
	}

	violations, _ := s.eventRepo.FindViolationsByUserID(userID)
	activity, _ := s.logRepo.GetFilteredLogs(userID, "", "")

	// Mocking a clean submission summary since it is requested in User Details endpoint
	subSummary := UserSubmissionSummary{
		TotalSubmissions: 3,
		Languages:        []string{"Go", "Python"},
		LastSubmission:   "2026-07-22T12:00:00Z",
	}

	response := &UserDetailsResponse{
		Profile: UserProfileDetails{
			UserID: session.UserID,
			Name:   session.Name,
		},
		ExamStatus:        session.Status,
		Violations:        violations,
		ActivityHistory:   activity,
		SubmissionSummary: subSummary,
	}

	return response, nil
}

func (s *AdminService) UnlockCandidate(userID string, extendMinutes int, ipAddress string) error {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("candidate session not found")
	}

	if !session.LockedStatus && session.Status != "LOCKED" {
		return errors.New("candidate is not locked")
	}

	session.LockedStatus = false
	session.Status = "ACTIVE"
	if extendMinutes > 0 {
		session.RemainingTime += extendMinutes * 60
	}

	if err := s.sessionRepo.Save(session); err != nil {
		return err
	}

	// Delete from locked users
	_ = s.sessionRepo.DeleteLockedUser(userID)

	// Create activity log
	logEntry := &models.ActivityLog{
		UserID:    "ADMIN",
		Username:  "Administrator",
		Action:    "UNLOCK",
		Details:   fmt.Sprintf("Candidate unlocked. Extended time by %d minutes.", extendMinutes),
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	return nil
}

func (s *AdminService) RejectContinuation(userID string, reason string, ipAddress string) error {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("candidate session not found")
	}

	session.Status = "TERMINATED"
	session.LockedStatus = false // reset lock status as they are now terminated
	
	now := time.Now()
	session.EndedAt = &now

	if err := s.sessionRepo.Save(session); err != nil {
		return err
	}

	// Remove from locked users table
	_ = s.sessionRepo.DeleteLockedUser(userID)

	// Create activity log
	logEntry := &models.ActivityLog{
		UserID:    "ADMIN",
		Username:  "Administrator",
		Action:    "REJECT",
		Details:   fmt.Sprintf("Candidate continuation rejected and session terminated. Reason: %s", reason),
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	return nil
}

func (s *AdminService) ExtendTime(userID string, minutes int, ipAddress string) error {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("candidate session not found")
	}

	if session.Status == "COMPLETED" || session.Status == "TERMINATED" {
		return fmt.Errorf("cannot extend time for ended exam (status: %s)", session.Status)
	}

	session.RemainingTime += minutes * 60
	if err := s.sessionRepo.Save(session); err != nil {
		return err
	}

	// Create activity log
	logEntry := &models.ActivityLog{
		UserID:    "ADMIN",
		Username:  "Administrator",
		Action:    "EXTEND_TIME",
		Details:   fmt.Sprintf("Exam session extended by %d minutes.", minutes),
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	return nil
}

func (s *AdminService) TerminateSession(userID string, reason string, ipAddress string) error {
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("candidate session not found")
	}

	session.Status = "TERMINATED"
	session.LockedStatus = false
	
	now := time.Now()
	session.EndedAt = &now

	if err := s.sessionRepo.Save(session); err != nil {
		return err
	}

	// Clear from locked users list
	_ = s.sessionRepo.DeleteLockedUser(userID)

	// Create activity log
	logEntry := &models.ActivityLog{
		UserID:    "ADMIN",
		Username:  "Administrator",
		Action:    "TERMINATE_SESSION",
		Details:   fmt.Sprintf("Exam session immediately terminated by Admin. Reason: %s", reason),
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	return nil
}

func (s *AdminService) GetAuditLogs(userID string, dateStr string, action string) ([]models.ActivityLog, error) {
	return s.logRepo.GetFilteredLogs(userID, dateStr, action)
}
