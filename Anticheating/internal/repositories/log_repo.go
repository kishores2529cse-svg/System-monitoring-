package repositories

import (
	"time"
	"anticheating/internal/models"
	"gorm.io/gorm"
)

type LogRepository struct {
	db *gorm.DB
}

func NewLogRepository(db *gorm.DB) *LogRepository {
	return &LogRepository{db: db}
}

func (r *LogRepository) Create(log *models.ActivityLog) error {
	return r.db.Create(log).Error
}

func (r *LogRepository) GetFilteredLogs(userID string, dateStr string, action string) ([]models.ActivityLog, error) {
	query := r.db.Model(&models.ActivityLog{})

	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	if action != "" {
		query = query.Where("action = ?", action)
	}

	if dateStr != "" {
		// Try parsing dateStr in YYYY-MM-DD layout
		t, err := time.Parse("2006-01-02", dateStr)
		if err == nil {
			startOfDay := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
			endOfDay := time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 999999999, time.UTC)
			query = query.Where("timestamp BETWEEN ? AND ?", startOfDay, endOfDay)
		}
	}

	var logs []models.ActivityLog
	err := query.Order("timestamp desc").Find(&logs).Error
	return logs, err
}
