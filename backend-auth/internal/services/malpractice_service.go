package services

import (
	"time"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// MalpracticeService handles business logic for recording and querying anti-cheating events.
type MalpracticeService struct {
	repo     *repositories.MalpracticeRepo
	userRepo *repositories.UserRepo
}

// NewMalpracticeService creates a new MalpracticeService.
func NewMalpracticeService(repo *repositories.MalpracticeRepo, userRepo *repositories.UserRepo) *MalpracticeService {
	return &MalpracticeService{
		repo:     repo,
		userRepo: userRepo,
	}
}

// LogViolation records a new anti-cheating malpractice event.
func (s *MalpracticeService) LogViolation(req *models.LogMalpracticeRequest) (*models.MalpracticeLog, error) {
	severity := req.Severity
	if severity == "" {
		if req.EventType == "UNAUTHORIZED_OBJECT" || req.EventType == "MULTIPLE_FACES" {
			severity = "CRITICAL"
		} else {
			severity = "WARNING"
		}
	}

	candidateName := req.CandidateName
	candidateEmail := req.CandidateEmail

	// Auto-lookup candidate name & email from user repository if missing
	if candidateName == "" || candidateEmail == "" {
		if user, err := s.userRepo.FindByID(req.UserID); err == nil && user != nil {
			if candidateName == "" {
				candidateName = user.Name
				if candidateName == "" {
					candidateName = user.Username
				}
			}
			if candidateEmail == "" {
				candidateEmail = user.Email
			}
		}
	}

	if candidateName == "" {
		candidateName = "Candidate"
	}

	logEntry := &models.MalpracticeLog{
		UserID:         req.UserID,
		CandidateName:  candidateName,
		CandidateEmail: candidateEmail,
		EventType:      req.EventType,
		Details:        req.Details,
		Severity:       severity,
		DetectedItem:   req.DetectedItem,
		Confidence:     req.Confidence,
		Timestamp:      time.Now(),
		CreatedAt:      time.Now(),
	}

	if err := s.repo.Create(logEntry); err != nil {
		return nil, err
	}

	return logEntry, nil
}

// GetUserViolations returns all violations for a given user.
func (s *MalpracticeService) GetUserViolations(userID uint) ([]models.MalpracticeLog, error) {
	return s.repo.GetByUserID(userID)
}

// GetAllViolations returns all live violations across all candidates.
func (s *MalpracticeService) GetAllViolations(limit int) ([]models.MalpracticeLog, error) {
	return s.repo.GetAll(limit)
}
