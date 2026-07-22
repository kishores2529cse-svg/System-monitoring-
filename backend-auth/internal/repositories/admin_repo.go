package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// AdminRepo provides CRUD operations for the Admin model.
type AdminRepo struct {
	db *gorm.DB
}

// NewAdminRepo creates a new AdminRepo instance.
func NewAdminRepo(db *gorm.DB) *AdminRepo {
	return &AdminRepo{db: db}
}

// FindByEmail retrieves an admin by email address.
func (r *AdminRepo) FindByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.Where("email = ?", email).First(&admin).Error
	return &admin, err
}

// FindByID retrieves an admin by primary key.
func (r *AdminRepo) FindByID(id uint) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.First(&admin, id).Error
	return &admin, err
}

// Create inserts a new admin record.
func (r *AdminRepo) Create(admin *models.Admin) error {
	return r.db.Create(admin).Error
}
