// Package middleware provides HTTP middleware for authentication and logging.
package middleware

import (
	"strings"

	"backend-auth/internal/config"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware provides JWT authentication for user routes.
type AuthMiddleware struct {
	authService *services.AuthService
	cfg         *config.Config
}

// NewAuthMiddleware creates a new AuthMiddleware.
func NewAuthMiddleware(authService *services.AuthService, cfg *config.Config) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
		cfg:         cfg,
	}
}

// RequireAuth is a middleware that validates user JWT tokens.
func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.Unauthorized(c, "authorization header is required")
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			utils.Unauthorized(c, "invalid authorization format, use: Bearer <token>")
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Validate token
		claims, err := m.authService.ValidateToken(tokenString, m.cfg.JWTSecret)
		if err != nil {
			utils.Unauthorized(c, "invalid or expired token")
			c.Abort()
			return
		}

		// Ensure this is a user token, not an admin token
		if claims.Role != "user" {
			utils.Forbidden(c, "access denied: user token required")
			c.Abort()
			return
		}

		// Set user info in context for downstream handlers
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}

// RequireAdmin is a middleware that validates admin JWT tokens.
func (m *AuthMiddleware) RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.Unauthorized(c, "authorization header is required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			utils.Unauthorized(c, "invalid authorization format")
			c.Abort()
			return
		}

		tokenString := parts[1]

		claims, err := m.authService.ValidateToken(tokenString, m.cfg.AdminJWTSecret)
		if err != nil {
			utils.Unauthorized(c, "invalid or expired admin token")
			c.Abort()
			return
		}

		if claims.Role != "admin" {
			utils.Forbidden(c, "access denied: admin token required")
			c.Abort()
			return
		}

		c.Set("admin_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", "admin")

		c.Next()
	}
}
