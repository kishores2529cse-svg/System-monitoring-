package controllers

import (
	"net/http"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// TimerController handles HTTP requests for exam timer management and status.
type TimerController struct {
	timerService *services.TimerService
}

// NewTimerController creates a new TimerController instance.
func NewTimerController(timerService *services.TimerService) *TimerController {
	return &TimerController{timerService: timerService}
}

// GetTimerStatus handles GET /api/timer/status (Accessible by both Students and Admins)
func (ctrl *TimerController) GetTimerStatus(c *gin.Context) {
	status, err := ctrl.timerService.GetStatus()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "timer status fetched successfully", status)
}

// VerifyExamPassword handles POST /api/exam/verify-password (Candidate exam gate verification)
func (ctrl *TimerController) VerifyExamPassword(c *gin.Context) {
	var req models.VerifyExamPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "password payload required")
		return
	}

	valid, err := ctrl.timerService.VerifyExamPassword(req.Password)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	if !valid {
		utils.Unauthorized(c, "Invalid examination password. Contact your proctor.")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "examination access granted", gin.H{"valid": true})
}

// ConfigTimer handles POST /api/admin/timer/config (Admin only)
func (ctrl *TimerController) ConfigTimer(c *gin.Context) {
	var req models.TimerConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "invalid duration payload (minutes and seconds required)")
		return
	}

	status, err := ctrl.timerService.ConfigureTimer(req.Minutes, req.Seconds, req.ExamPassword)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "timer configured successfully", status)
}

// StartTimer handles POST /api/admin/timer/start (Admin only)
func (ctrl *TimerController) StartTimer(c *gin.Context) {
	status, err := ctrl.timerService.StartTimer()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "assessment timer started for all candidates", status)
}

// PauseTimer handles POST /api/admin/timer/pause (Admin only)
func (ctrl *TimerController) PauseTimer(c *gin.Context) {
	status, err := ctrl.timerService.PauseTimer()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "assessment timer paused", status)
}

// ResumeTimer handles POST /api/admin/timer/resume (Admin only)
func (ctrl *TimerController) ResumeTimer(c *gin.Context) {
	status, err := ctrl.timerService.ResumeTimer()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "assessment timer resumed", status)
}

// ExtendTimer handles POST /api/admin/timer/extend (Admin only)
func (ctrl *TimerController) ExtendTimer(c *gin.Context) {
	var req models.TimerExtendRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "invalid extend time payload (minutes and seconds required)")
		return
	}

	status, err := ctrl.timerService.ExtendTimer(req.Minutes, req.Seconds)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "assessment timer extended", status)
}

// EndTimer handles POST /api/admin/timer/end (Admin only)
func (ctrl *TimerController) EndTimer(c *gin.Context) {
	status, err := ctrl.timerService.EndTimer()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "assessment timer ended for all candidates", status)
}
