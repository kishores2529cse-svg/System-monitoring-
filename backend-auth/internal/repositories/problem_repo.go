package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// ProblemRepo provides CRUD operations for Problem and TestCase models.
type ProblemRepo struct {
	db *gorm.DB
}

// NewProblemRepo creates a new ProblemRepo instance.
func NewProblemRepo(db *gorm.DB) *ProblemRepo {
	return &ProblemRepo{db: db}
}

// GetAll retrieves all problems (without test cases).
func (r *ProblemRepo) GetAll() ([]models.Problem, error) {
	var problems []models.Problem
	err := r.db.Find(&problems).Error
	return problems, err
}

// FindByID retrieves a problem by primary key, including sample test cases.
func (r *ProblemRepo) FindByID(id uint) (*models.Problem, error) {
	var problem models.Problem
	err := r.db.Preload("TestCases", func(db *gorm.DB) *gorm.DB {
		return db.Where("type = ?", models.TestCaseTypeSample)
	}).First(&problem, id).Error
	return &problem, err
}

// FindByIDWithAllCases retrieves a problem with all test cases (for submission evaluation).
func (r *ProblemRepo) FindByIDWithAllCases(id uint) (*models.Problem, error) {
	var problem models.Problem
	err := r.db.Preload("TestCases").First(&problem, id).Error
	return &problem, err
}

// GetTestCasesByProblemID retrieves all test cases for a problem.
func (r *ProblemRepo) GetTestCasesByProblemID(problemID uint, tcType models.SampleOrHidden) ([]models.TestCase, error) {
	var testCases []models.TestCase
	err := r.db.Where("problem_id = ? AND type = ?", problemID, tcType).Find(&testCases).Error
	return testCases, err
}

// CountTotalTestCases counts all test cases for a problem.
func (r *ProblemRepo) CountTotalTestCases(problemID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.TestCase{}).Where("problem_id = ?", problemID).Count(&count).Error
	return count, err
}
