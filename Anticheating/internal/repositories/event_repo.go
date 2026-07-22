package repositories

import (
	"anticheating/internal/models"
	"gorm.io/gorm"
)

type EventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) CreateEvent(event *models.MonitorEvent) error {
	return r.db.Create(event).Error
}

func (r *EventRepository) CreateViolation(violation *models.Violation) error {
	return r.db.Create(violation).Error
}

func (r *EventRepository) FindViolationsByUserID(userID string) ([]models.Violation, error) {
	var violations []models.Violation
	err := r.db.Where("user_id = ?", userID).Order("timestamp desc").Find(&violations).Error
	return violations, err
}

func (r *EventRepository) CountAllEvents() (int64, error) {
	var count int64
	err := r.db.Model(&models.MonitorEvent{}).Count(&count).Error
	return count, err
}

func (r *EventRepository) CountAllViolations() (int64, error) {
	var count int64
	err := r.db.Model(&models.Violation{}).Count(&count).Error
	return count, err
}

func (r *EventRepository) GetLatestViolations(limit int) ([]models.Violation, error) {
	var violations []models.Violation
	err := r.db.Order("timestamp desc").Limit(limit).Find(&violations).Error
	return violations, err
}
