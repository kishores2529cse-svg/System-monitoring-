// Package services implements the business logic for all API endpoints.
package services

import (
	"errors"
	"time"

	"backend-auth/internal/config"
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthService handles authentication operations for users and admins.
type AuthService struct {
	userRepo  *repositories.UserRepo
	adminRepo *repositories.AdminRepo
	cfg       *config.Config
}

// NewAuthService creates a new AuthService.
func NewAuthService(userRepo *repositories.UserRepo, adminRepo *repositories.AdminRepo, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		adminRepo: adminRepo,
		cfg:       cfg,
	}
}

// Claims extends jwt.RegisteredClaims with user-specific fields.
type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"` // "user" or "admin"
	jwt.RegisteredClaims
}

// Register creates a new user account with a hashed password.
func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
	// Check if email already exists
	existing, _ := s.userRepo.FindByEmail(req.Email)
	if existing != nil && existing.ID != 0 {
		return nil, errors.New("email already registered")
	}

	// Hash password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	role := req.Role
	if role == "" {
		role = "user"
	}
	username := req.Username
	if username == "" {
		username = req.Email
	}

	user := &models.User{
		Username: username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
		Role:     role,
		Phone:    req.Phone,
		College:  req.College,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("failed to create user")
	}

	return user, nil
}

// AuthenticateUser validates credentials and returns a JWT token.
func (s *AuthService) AuthenticateUser(req models.LoginRequest) (*models.User, string, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", errors.New("invalid email or password")
		}
		return nil, "", errors.New("failed to find user")
	}

	// Compare bcrypt hashes
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	role := user.Role
	if role == "" {
		role = "user"
	}

	// Generate JWT
	token, err := s.generateToken(user.ID, user.Email, role, s.cfg.JWTSecret, s.cfg.JWTExpiry)
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return user, token, nil
}

// AuthenticateAdmin validates admin credentials and returns an admin JWT.
func (s *AuthService) AuthenticateAdmin(req models.AdminLoginRequest) (*models.Admin, string, error) {
	admin, err := s.adminRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", errors.New("invalid email or password")
		}
		return nil, "", errors.New("failed to find admin")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password)); err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	token, err := s.generateToken(admin.ID, admin.Email, "admin", s.cfg.AdminJWTSecret, s.cfg.AdminJWTExpiry)
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return admin, token, nil
}

// ValidateToken parses and validates a JWT string and returns the claims.
func (s *AuthService) ValidateToken(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// generateToken creates a signed JWT with the provided parameters.
func (s *AuthService) generateToken(userID uint, email, role, secret string, expiry time.Duration) (string, error) {
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "assessment-system",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
