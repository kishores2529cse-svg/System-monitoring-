package services

import (
	"errors"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"

	"gorm.io/gorm"
)

// UserService handles user profile operations.
type UserService struct {
	userRepo *repositories.UserRepo
}

// NewUserService creates a new UserService.
func NewUserService(userRepo *repositories.UserRepo) *UserService {
	return &UserService{userRepo: userRepo}
}

// GetProfile retrieves the user profile by ID.
func (s *UserService) GetProfile(userID uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, errors.New("failed to fetch profile")
	}
	return user, nil
}

// UpdateProfile updates the allowed fields of a user profile.
func (s *UserService) UpdateProfile(userID uint, req models.UpdateProfileRequest) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, errors.New("failed to fetch user")
	}

	// Only update non-empty fields; protect email and password from modification
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.College != "" {
		user.College = req.College
	}
	if req.Department != "" {
		user.Department = req.Department
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, errors.New("failed to update profile")
	}

	return user, nil
}
