package controllers

import (
	"net/http"
	"anticheating/internal/services"
	"anticheating/pkg/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

type CandidateLoginReq struct {
	UserID string `json:"user_id" binding:"required"`
	Name   string `json:"name" binding:"required"`
}

func (ctrl *AuthController) CandidateLogin(c *gin.Context) {
	var req CandidateLoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request payload: user_id and name are required")
		return
	}

	ipAddress := c.ClientIP()
	token, err := ctrl.authService.CandidateLogin(req.UserID, req.Name, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.SuccessResponse(c, "Candidate login successful", gin.H{
		"token": token,
	})
}

type AdminLoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (ctrl *AuthController) AdminLogin(c *gin.Context) {
	var req AdminLoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request payload: username and password are required")
		return
	}

	ipAddress := c.ClientIP()
	token, err := ctrl.authService.AdminLogin(req.Username, req.Password, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.SuccessResponse(c, "Admin login successful", gin.H{
		"token": token,
	})
}
