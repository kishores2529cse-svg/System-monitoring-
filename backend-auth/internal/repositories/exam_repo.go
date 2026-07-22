package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// ExamRepo provides CRUD operations for ExamSession.
type ExamRepo struct {
	db *gorm.DB
}

// NewExamRepo creates a new ExamRepo instance.
func NewExamRepo(db *gorm.DB) *ExamRepo {
	return &ExamRepo{db: db}
}

// Create inserts a new exam session.
func (r *ExamRepo) Create(session *models.ExamSession) error {
	return r.db.Create(session).Error
}

// FindActiveByUserID retrieves the currently active exam session for a user.
func (r *ExamRepo) FindActiveByUserID(userID uint) (*models.ExamSession, error) {
	var session models.ExamSession
	err := r.db.Where("user_id = ? AND status = ?", userID, models.ExamStatusActive).First(&session).Error
	return &session, err
}

// FindByID retrieves an exam session by primary key.
func (r *ExamRepo) FindByID(id uint) (*models.ExamSession, error) {
	var session models.ExamSession
	err := r.db.First(&session, id).Error
	return &session, err
}

// Update modifies an exam session record.
func (r *ExamRepo) Update(session *models.ExamSession) error {
	return r.db.Save(session).Error
}

// FindLatestByUserID retrieves the most recent exam session for a user.
func (r *ExamRepo) FindLatestByUserID(userID uint) (*models.ExamSession, error) {
	var session models.ExamSession
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").First(&session).Error
	return &session, err
}
