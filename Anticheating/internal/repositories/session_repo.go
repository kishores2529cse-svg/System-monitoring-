package repositories

import (
	"time"
	"anticheating/internal/models"
	"gorm.io/gorm"
)

type SessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) FindByUserID(userID string) (*models.ExamSession, error) {
	var session models.ExamSession
	err := r.db.Where("user_id = ?", userID).First(&session).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *SessionRepository) Create(session *models.ExamSession) error {
	return r.db.Create(session).Error
}

func (r *SessionRepository) Save(session *models.ExamSession) error {
	return r.db.Save(session).Error
}

func (r *SessionRepository) CountByStatus(status string) (int64, error) {
	var count int64
	err := r.db.Model(&models.ExamSession{}).Where("status = ?", status).Count(&count).Error
	return count, err
}

func (r *SessionRepository) CountRunningExams() (int64, error) {
	var count int64
	// Running exams are ACTIVE or OFFLINE, but not LOCKED, COMPLETED, or TERMINATED
	err := r.db.Model(&models.ExamSession{}).
		Where("status IN ('ACTIVE', 'OFFLINE')").
		Count(&count).Error
	return count, err
}

func (r *SessionRepository) GetLiveSessions() ([]models.ExamSession, error) {
	var sessions []models.ExamSession
	// Return active live sessions
	err := r.db.Find(&sessions).Error
	return sessions, err
}

func (r *SessionRepository) GetLockedUsers() ([]models.LockedUser, error) {
	var locked []models.LockedUser
	err := r.db.Find(&locked).Error
	return locked, err
}

func (r *SessionRepository) FindLockedUserByUserID(userID string) (*models.LockedUser, error) {
	var locked models.LockedUser
	err := r.db.Where("user_id = ?", userID).First(&locked).Error
	if err != nil {
		return nil, err
	}
	return &locked, nil
}

func (r *SessionRepository) CreateLockedUser(locked *models.LockedUser) error {
	// First check if locked user already exists to avoid unique constraint violations
	var existing models.LockedUser
	err := r.db.Where("user_id = ?", locked.UserID).First(&existing).Error
	if err == nil {
		// already exists, update it
		existing.LockReason = locked.LockReason
		existing.WarningCount = locked.WarningCount
		existing.LockedTime = locked.LockedTime
		return r.db.Save(&existing).Error
	}
	return r.db.Create(locked).Error
}

func (r *SessionRepository) DeleteLockedUser(userID string) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.LockedUser{}).Error
}

func (r *SessionRepository) GetOfflineSessions(thresholdSec int) ([]models.ExamSession, error) {
	var sessions []models.ExamSession
	cutoff := time.Now().Add(-time.Duration(thresholdSec) * time.Second)
	// Find active sessions that haven't sent a heartbeat within the threshold
	err := r.db.Where("status = 'ACTIVE' AND last_heartbeat < ?", cutoff).Find(&sessions).Error
	return sessions, err
}
