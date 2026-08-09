package repositories

import (
	"errors"

	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// TimerRepo provides CRUD operations for ExamTimer.
type TimerRepo struct {
	db *gorm.DB
}

// NewTimerRepo creates a new TimerRepo instance.
func NewTimerRepo(db *gorm.DB) *TimerRepo {
	return &TimerRepo{db: db}
}

// GetTimer fetches the singleton central timer (ID=1). If not exists, creates default.
func (r *TimerRepo) GetTimer() (*models.ExamTimer, error) {
	var timer models.ExamTimer
	err := r.db.First(&timer, 1).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			defaultTimer := models.ExamTimer{
				ID:                 1,
				DurationMinutes:    60,
				Status:             models.TimerStatusNotStarted,
				AccumulatedSeconds: 0,
				TotalDurationSecs:  3600,
			}
			if err := r.db.Create(&defaultTimer).Error; err != nil {
				return nil, err
			}
			return &defaultTimer, nil
		}
		return nil, err
	}
	return &timer, nil
}

// SaveTimer saves or updates the singleton central timer.
func (r *TimerRepo) SaveTimer(timer *models.ExamTimer) error {
	timer.ID = 1
	return r.db.Save(timer).Error
}
