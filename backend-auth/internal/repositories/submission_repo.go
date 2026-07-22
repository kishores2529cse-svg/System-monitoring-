package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// SubmissionRepo provides CRUD operations for Submission.
type SubmissionRepo struct {
	db *gorm.DB
}

// NewSubmissionRepo creates a new SubmissionRepo instance.
func NewSubmissionRepo(db *gorm.DB) *SubmissionRepo {
	return &SubmissionRepo{db: db}
}

// Create inserts a new submission record.
func (r *SubmissionRepo) Create(submission *models.Submission) error {
	return r.db.Create(submission).Error
}

// FindByID retrieves a submission by primary key.
func (r *SubmissionRepo) FindByID(id uint) (*models.Submission, error) {
	var sub models.Submission
	err := r.db.First(&sub, id).Error
	return &sub, err
}

// FindByUserAndProblem retrieves all submissions for a user on a specific problem.
func (r *SubmissionRepo) FindByUserAndProblem(userID, problemID uint) ([]models.Submission, error) {
	var subs []models.Submission
	err := r.db.Where("user_id = ? AND problem_id = ?", userID, problemID).
		Order("created_at DESC").Find(&subs).Error
	return subs, err
}

// CountByUserID counts total submissions for a user.
func (r *SubmissionRepo) CountByUserID(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Submission{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}

// FindAcceptedByUserAndProblem finds accepted submissions for a user on a problem.
func (r *SubmissionRepo) FindAcceptedByUserAndProblem(userID, problemID uint) ([]models.Submission, error) {
	var subs []models.Submission
	err := r.db.Where("user_id = ? AND problem_id = ? AND verdict = ?",
		userID, problemID, models.VerdictAccepted).Find(&subs).Error
	return subs, err
}

// Update modifies a submission record.
func (r *SubmissionRepo) Update(submission *models.Submission) error {
	return r.db.Save(submission).Error
}
