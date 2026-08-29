// Package controllers handles HTTP request/response operations.
package controllers

import (
	"net/http"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// AuthController handles authentication endpoints.
type AuthController struct {
	authService *services.AuthService
}

// NewAuthController creates a new AuthController.
func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// Register handles POST /api/auth/register
// Request body: { "email": "...", "password": "...", "name": "...", "phone": "...", "college": "...", "department": "..." }
// Response 201: { "success": true, "data": { user, token } }
func (ctrl *AuthController) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	user, token, err := ctrl.authService.Register(req)
	if err != nil {
		if err.Error() == "email already registered" {
			utils.Conflict(c, err.Error())
			return
		}
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "user registered successfully", gin.H{
		"user":  user.ToUserResponse(),
		"token": token,
	})
}

// Login handles POST /api/auth/login
// Request body: { "email": "...", "password": "..." }
// Response 200: { "success": true, "data": { user, token } }
func (ctrl *AuthController) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	user, token, err := ctrl.authService.AuthenticateUser(req)
	if err != nil {
		utils.Unauthorized(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "login successful", gin.H{
		"user":  user.ToUserResponse(),
		"token": token,
	})
}

// Logout handles POST /api/auth/logout
// Response 200: { "success": true, "message": "logged out successfully" }
// Note: JWT is stateless; client should discard the token.
func (ctrl *AuthController) Logout(c *gin.Context) {
	utils.SuccessResponse(c, http.StatusOK, "logged out successfully", nil)
}

// AdminLogin handles POST /api/admin/login
// Request body: { "email": "...", "password": "..." }
// Response 200: { "success": true, "data": { admin, token } }
func (ctrl *AuthController) AdminLogin(c *gin.Context) {
	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	admin, token, err := ctrl.authService.AuthenticateAdmin(req)
	if err != nil {
		utils.Unauthorized(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "admin login successful", gin.H{
		"admin": models.AdminResponse{
			ID:    admin.ID,
			Email: admin.Email,
			Name:  admin.Name,
		},
		"token": token,
	})
}
