package services

import (
	"errors"
	"time"
	"anticheating/internal/config"
	"anticheating/internal/models"
	"anticheating/internal/repositories"
	"anticheating/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	cfg         *config.Config
	adminRepo   *repositories.AdminRepository
	sessionRepo *repositories.SessionRepository
	logRepo     *repositories.LogRepository
}

func NewAuthService(
	cfg *config.Config,
	adminRepo *repositories.AdminRepository,
	sessionRepo *repositories.SessionRepository,
	logRepo *repositories.LogRepository,
) *AuthService {
	return &AuthService{
		cfg:         cfg,
		adminRepo:   adminRepo,
		sessionRepo: sessionRepo,
		logRepo:     logRepo,
	}
}

func (s *AuthService) CandidateLogin(userID string, name string, ipAddress string) (string, error) {
	if userID == "" || name == "" {
		return "", errors.New("user ID and name are required")
	}

	// Find or create session
	session, err := s.sessionRepo.FindByUserID(userID)
	if err != nil {
		// Create new session
		session = &models.ExamSession{
			UserID:         userID,
			Name:           name,
			CurrentProblem: "Question 1",
			RemainingTime:  3600, // 1 hour
			Status:         "ACTIVE",
			MaxWarnings:    s.cfg.WarningLimit,
			LockedStatus:   false,
			LastHeartbeat:  time.Now(),
			StartedAt:      time.Now(),
		}
		if err := s.sessionRepo.Create(session); err != nil {
			return "", err
		}
	} else {
		// If session is completed or terminated, prevent login or handle accordingly
		if session.Status == "COMPLETED" || session.Status == "TERMINATED" {
			return "", errors.New("exam session has already ended")
		}
	}

	// Create audit log
	logEntry := &models.ActivityLog{
		UserID:    userID,
		Username:  name,
		Action:    "LOGIN",
		Details:   "Candidate logged in and session started/resumed",
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	// Generate candidate JWT token (valid for 12 hours)
	token, err := utils.GenerateToken(userID, name, "candidate", s.cfg.JWTSecret, 12)
	return token, err
}

func (s *AuthService) AdminLogin(username, password, ipAddress string) (string, error) {
	admin, err := s.adminRepo.FindByUsername(username)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Create audit log
	logEntry := &models.ActivityLog{
		UserID:    username,
		Username:  username,
		Action:    "LOGIN",
		Details:   "Admin logged in successfully",
		Timestamp: time.Now(),
		IPAddress: ipAddress,
	}
	_ = s.logRepo.Create(logEntry)

	// Generate admin JWT token (valid for 12 hours)
	token, err := utils.GenerateToken(username, username, "admin", s.cfg.JWTSecret, 12)
	return token, err
}
