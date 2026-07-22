package middleware

import (
	"net/http"
	"strings"
	"anticheating/internal/config"
	"anticheating/pkg/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Authorization header is missing")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Authorization header must be Bearer token")
			c.Abort()
			return
		}

		tokenStr := parts[1]
		claims, err := utils.ValidateToken(tokenStr, cfg.JWTSecret)
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		// Inject user info to Gin context
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)

		c.Next()
	})
}

func AdminOnly() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			utils.ErrorResponse(c, http.StatusForbidden, "Access denied: Administrator privileges required")
			c.Abort()
			return
		}
		c.Next()
	})
}

func CandidateOnly() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "candidate" {
			utils.ErrorResponse(c, http.StatusForbidden, "Access denied: Candidate account required")
			c.Abort()
			return
		}
		c.Next()
	})
}
