package controllers

import (
	"net/http"
	"strconv"
	"anticheating/internal/services"
	"anticheating/pkg/utils"
	"github.com/gin-gonic/gin"
)

type AdminController struct {
	adminService *services.AdminService
}

func NewAdminController(adminService *services.AdminService) *AdminController {
	return &AdminController{adminService: adminService}
}

func (ctrl *AdminController) Dashboard(c *gin.Context) {
	stats, err := ctrl.adminService.GetDashboardStats()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to load dashboard metrics: "+err.Error())
		return
	}
	utils.SuccessResponse(c, "Dashboard metrics loaded", stats)
}

func (ctrl *AdminController) LiveSessions(c *gin.Context) {
	sessions, err := ctrl.adminService.GetLiveSessions()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve live sessions: "+err.Error())
		return
	}

	// Format to matching schema
	type LiveSessionItem struct {
		UserID         string `json:"user_id"`
		Name           string `json:"name"`
		CurrentProblem string `json:"current_problem"`
		RemainingTime  int    `json:"remaining_time"`
		Status         string `json:"status"`
		WarningCount   int    `json:"warning_count"`
		LockedStatus   bool   `json:"locked_status"`
	}

	result := make([]LiveSessionItem, 0, len(sessions))
	for _, s := range sessions {
		result = append(result, LiveSessionItem{
			UserID:         s.UserID,
			Name:           s.Name,
			CurrentProblem: s.CurrentProblem,
			RemainingTime:  s.RemainingTime,
			Status:         s.Status,
			WarningCount:   s.WarningCount,
			LockedStatus:   s.LockedStatus,
		})
	}

	utils.SuccessResponse(c, "Live sessions retrieved", result)
}

func (ctrl *AdminController) LiveEvents(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 50
	}

	events, err := ctrl.adminService.GetLiveEvents(limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve live events: "+err.Error())
		return
	}
	utils.SuccessResponse(c, "Live malpractice events retrieved", events)
}

func (ctrl *AdminController) LockedUsers(c *gin.Context) {
	locked, err := ctrl.adminService.GetLockedUsers()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve locked users: "+err.Error())
		return
	}
	utils.SuccessResponse(c, "Locked users retrieved", locked)
}

func (ctrl *AdminController) UserDetails(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "User ID is required in URL path")
		return
	}

	details, err := ctrl.adminService.GetUserDetails(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	utils.SuccessResponse(c, "User details retrieved", details)
}

type UnlockReq struct {
	UserID        string `json:"user_id" binding:"required"`
	ExtendMinutes int    `json:"extend_minutes"`
}

func (ctrl *AdminController) Unlock(c *gin.Context) {
	var req UnlockReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid unlock payload")
		return
	}

	ipAddress := c.ClientIP()
	err := ctrl.adminService.UnlockCandidate(req.UserID, req.ExtendMinutes, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, "Candidate unlocked successfully", nil)
}

type RejectReq struct {
	UserID string `json:"user_id" binding:"required"`
	Reason string `json:"reason" binding:"required"`
}

func (ctrl *AdminController) Reject(c *gin.Context) {
	var req RejectReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid reject payload")
		return
	}

	ipAddress := c.ClientIP()
	err := ctrl.adminService.RejectContinuation(req.UserID, req.Reason, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, "Candidate continuation rejected and session terminated", nil)
}

type ExtendReq struct {
	UserID  string `json:"user_id" binding:"required"`
	Minutes int    `json:"minutes" binding:"required"`
}

func (ctrl *AdminController) ExtendTime(c *gin.Context) {
	var req ExtendReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid extend-time payload")
		return
	}

	ipAddress := c.ClientIP()
	err := ctrl.adminService.ExtendTime(req.UserID, req.Minutes, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, "Exam duration extended successfully", nil)
}

type TerminateReq struct {
	UserID string `json:"user_id" binding:"required"`
	Reason string `json:"reason" binding:"required"`
}

func (ctrl *AdminController) TerminateSession(c *gin.Context) {
	var req TerminateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid terminate payload")
		return
	}

	ipAddress := c.ClientIP()
	err := ctrl.adminService.TerminateSession(req.UserID, req.Reason, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, "Candidate exam session terminated successfully", nil)
}
