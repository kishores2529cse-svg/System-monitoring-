package repositories

import (
	"backend-auth/internal/models"
	"gorm.io/gorm"
)

// AdminRepo provides database operations for the Admin model.
type AdminRepo struct {
	db *gorm.DB
}

// NewAdminRepo creates a new AdminRepo.
func NewAdminRepo(db *gorm.DB) *AdminRepo {
	return &AdminRepo{db: db}
}

// Create inserts a new admin into the database.
func (r *AdminRepo) Create(admin *models.Admin) error {
	return r.db.Create(admin).Error
}

// FindByEmail retrieves an admin by their email address.
func (r *AdminRepo) FindByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	if err := r.db.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}
