// Package repositories handles all database operations for the application.
package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// UserRepo provides CRUD operations for the User model.
type UserRepo struct {
	db *gorm.DB
}

// NewUserRepo creates a new UserRepo instance.
func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

// Create inserts a new user record.
func (r *UserRepo) Create(user *models.User) error {
	return r.db.Create(user).Error
}

// FindByEmail retrieves a user by email address.
func (r *UserRepo) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

// FindByID retrieves a user by primary key.
func (r *UserRepo) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return &user, err
}

// Update modifies specific fields of a user record.
func (r *UserRepo) Update(user *models.User) error {
	return r.db.Save(user).Error
}
