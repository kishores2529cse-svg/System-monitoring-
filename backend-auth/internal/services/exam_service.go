package services

import (
	"errors"
	"time"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"

	"gorm.io/gorm"
)

// ExamService handles exam session lifecycle operations.
type ExamService struct {
	examRepo *repositories.ExamRepo
}

// NewExamService creates a new ExamService.
func NewExamService(examRepo *repositories.ExamRepo) *ExamService {
	return &ExamService{examRepo: examRepo}
}

// StartExam creates a new active exam session for the user.
func (s *ExamService) StartExam(userID uint, durationMinutes int) (*models.ExamSession, error) {
	// Check for an existing active session
	active, err := s.examRepo.FindActiveByUserID(userID)
	if err == nil && active.ID != 0 {
		return nil, errors.New("exam already in progress")
	}

	if durationMinutes <= 0 {
		durationMinutes = 60 // default 60 minutes
	}

	now := time.Now()
	session := &models.ExamSession{
		UserID:    userID,
		Status:    models.ExamStatusActive,
		StartTime: &now,
		Duration:  durationMinutes,
	}

	if err := s.examRepo.Create(session); err != nil {
		return nil, errors.New("failed to start exam")
	}

	return session, nil
}

// GetStatus returns the current exam status for the user.
func (s *ExamService) GetStatus(userID uint) (*models.ExamStatusResponse, error) {
	session, err := s.examRepo.FindActiveByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Check latest completed session
			latest, err := s.examRepo.FindLatestByUserID(userID)
			if err != nil {
				return nil, errors.New("no exam session found")
			}
			return &models.ExamStatusResponse{
				Status:           latest.Status,
				RemainingSeconds: 0,
				StartTime:        latest.StartTime,
				EndTime:          latest.EndTime,
				IsSubmitted:      latest.Status == models.ExamStatusCompleted,
			}, nil
		}
		return nil, errors.New("failed to fetch exam status")
	}

	// Calculate remaining time
	elapsed := time.Since(*session.StartTime).Seconds()
	remaining := float64(session.Duration)*60 - elapsed
	if remaining < 0 {
		remaining = 0
	}

	return &models.ExamStatusResponse{
		Status:           session.Status,
		RemainingSeconds: int64(remaining),
		StartTime:        session.StartTime,
		EndTime:          session.EndTime,
		IsSubmitted:      false,
	}, nil
}

// EndExam marks the current active exam as completed.
func (s *ExamService) EndExam(userID uint) (*models.ExamSession, error) {
	session, err := s.examRepo.FindActiveByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no active exam session found")
		}
		return nil, errors.New("failed to find exam session")
	}

	now := time.Now()
	session.Status = models.ExamStatusCompleted
	session.EndTime = &now

	if err := s.examRepo.Update(session); err != nil {
		return nil, errors.New("failed to end exam")
	}

	return session, nil
}

// IsExamActive checks whether the user has an active exam.
func (s *ExamService) IsExamActive(userID uint) bool {
	session, err := s.examRepo.FindActiveByUserID(userID)
	if err != nil {
		return false
	}

	// Also check if the exam time has expired
	elapsed := time.Since(*session.StartTime).Seconds()
	if elapsed > float64(session.Duration)*60 {
		// Auto-complete expired exam
		session.Status = models.ExamStatusCompleted
		now := time.Now()
		session.EndTime = &now
		s.examRepo.Update(session)
		return false
	}

	return true
}
