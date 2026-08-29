package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// MalpracticeRepo handles database operations for malpractice logs.
type MalpracticeRepo struct {
	db *gorm.DB
}

// NewMalpracticeRepo creates a new MalpracticeRepo instance.
func NewMalpracticeRepo(db *gorm.DB) *MalpracticeRepo {
	return &MalpracticeRepo{db: db}
}

// Create inserts a new malpractice event log.
func (r *MalpracticeRepo) Create(log *models.MalpracticeLog) error {
	return r.db.Create(log).Error
}

// GetByUserID retrieves all malpractice logs for a specific user ID.
func (r *MalpracticeRepo) GetByUserID(userID uint) ([]models.MalpracticeLog, error) {
	var logs []models.MalpracticeLog
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&logs).Error
	return logs, err
}

// GetAll retrieves recent malpractice logs across all users.
func (r *MalpracticeRepo) GetAll(limit int) ([]models.MalpracticeLog, error) {
	var logs []models.MalpracticeLog
	query := r.db.Preload("User").Order("created_at desc")
	if limit > 0 {
		query = query.Limit(limit)
	}
	err := query.Find(&logs).Error
	return logs, err
}

// CountByUserID counts total violations for a specific candidate.
func (r *MalpracticeRepo) CountByUserID(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.MalpracticeLog{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}
