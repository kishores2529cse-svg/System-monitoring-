package services

import (
	"fmt"
	"time"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// MalpracticeService handles business logic for recording and querying anti-cheating events.
type MalpracticeService struct {
	repo         *repositories.MalpracticeRepo
	userRepo     *repositories.UserRepo
	emailService *EmailService
	supabase     *SupabaseService
}

// NewMalpracticeService creates a new MalpracticeService.
func NewMalpracticeService(repo *repositories.MalpracticeRepo, userRepo *repositories.UserRepo, emailService *EmailService, supabase *SupabaseService) *MalpracticeService {
	return &MalpracticeService{
		repo:         repo,
		userRepo:     userRepo,
		emailService: emailService,
		supabase:     supabase,
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
	candidateRegNo := req.CandidateRegNo

	// Auto-lookup candidate name & email & regNo from user repository if missing
	if candidateName == "" || candidateEmail == "" || candidateRegNo == "" {
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
			if candidateRegNo == "" {
				candidateRegNo = user.RegNo
			}
		}
	}

	if candidateName == "" {
		candidateName = "Candidate"
	}

	snapshotPath := req.SnapshotPath
	if req.SnapshotBase64 != "" && s.supabase != nil {
		path := fmt.Sprintf("evidence/%d/%d.jpg", req.UserID, time.Now().UnixNano())
		if uploadedPath, err := s.supabase.UploadBase64Image("malpractice-evidence", path, req.SnapshotBase64); err == nil {
			snapshotPath = uploadedPath
		} else {
			fmt.Printf("[Malpractice] Failed to upload snapshot to Supabase: %v\n", err)
		}
	}

	logEntry := &models.MalpracticeLog{
		UserID:         req.UserID,
		CandidateName:  candidateName,
		CandidateEmail: candidateEmail,
		CandidateRegNo: candidateRegNo,
		EventType:      req.EventType,
		Details:        req.Details,
		Severity:       severity,
		DetectedItem:   req.DetectedItem,
		Confidence:     req.Confidence,
		SnapshotPath:   snapshotPath,
		Timestamp:      time.Now(),
		CreatedAt:      time.Now(),
	}

	if err := s.repo.Create(logEntry); err != nil {
		return nil, err
	}

	// Malpractice record is now safely persisted.
	// Fire email notification asynchronously — never blocks or affects the response.
	if s.emailService != nil {
		go s.emailService.SendMalpracticeAlert(logEntry)
	}

	return logEntry, nil
}

// GetUserViolations returns all violations for a given user.
func (s *MalpracticeService) GetUserViolations(userID uint) ([]models.MalpracticeLog, error) {
	logs, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.attachSignedURLs(logs), nil
}

// GetAllViolations returns all live violations across all candidates.
func (s *MalpracticeService) GetAllViolations(limit int) ([]models.MalpracticeLog, error) {
	logs, err := s.repo.GetAll(limit)
	if err != nil {
		return nil, err
	}
	return s.attachSignedURLs(logs), nil
}

func (s *MalpracticeService) attachSignedURLs(logs []models.MalpracticeLog) []models.MalpracticeLog {
	for i := range logs {
		if logs[i].SnapshotPath != "" && s.supabase != nil {
			if signedURL, err := s.supabase.GetSignedURL("malpractice-evidence", logs[i].SnapshotPath, 3600); err == nil {
				// Replace the internal path with a temporary signed URL for the frontend
				logs[i].SnapshotPath = signedURL
			}
		}
	}
	return logs
}
