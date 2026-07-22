package controllers

import (
	"net/http"
	"anticheating/internal/services"
	"anticheating/pkg/utils"
	"github.com/gin-gonic/gin"
)

type MonitorController struct {
	monitorService *services.MonitorService
}

func NewMonitorController(monitorService *services.MonitorService) *MonitorController {
	return &MonitorController{monitorService: monitorService}
}

func (ctrl *MonitorController) Heartbeat(c *gin.Context) {
	var req services.HeartbeatReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid heartbeat payload")
		return
	}

	// Verify that the authenticated candidate's user ID matches the payload user ID
	authUserID, exists := c.Get("userID")
	if exists && authUserID.(string) != req.UserID {
		utils.ErrorResponse(c, http.StatusForbidden, "Cannot post heartbeat for another candidate")
		return
	}

	ipAddress := c.ClientIP()
	session, err := ctrl.monitorService.ProcessHeartbeat(&req, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusLocked, err.Error())
		return
	}

	utils.SuccessResponse(c, "Heartbeat registered", gin.H{
		"remaining_time": session.RemainingTime,
		"status":         session.Status,
		"warning_count":  session.WarningCount,
		"locked_status":  session.LockedStatus,
	})
}

func (ctrl *MonitorController) MalpracticeEvent(c *gin.Context) {
	var req services.EventReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid event payload")
		return
	}

	// Verify that the authenticated candidate's user ID matches the payload user ID
	authUserID, exists := c.Get("userID")
	if exists && authUserID.(string) != req.UserID {
		utils.ErrorResponse(c, http.StatusForbidden, "Cannot post events for another candidate")
		return
	}

	ipAddress := c.ClientIP()
	session, err := ctrl.monitorService.RecordMalpracticeEvent(&req, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusLocked, err.Error())
		return
	}

	utils.SuccessResponse(c, "Malpractice event stored and candidate warning count incremented", gin.H{
		"warning_count": session.WarningCount,
		"locked_status": session.LockedStatus,
		"status":         session.Status,
	})
}

func (ctrl *MonitorController) ViolationHistory(c *gin.Context) {
	// Support filtering by query param "userId", with fallback to logged in candidate ID
	userID := c.Query("userId")
	if userID == "" {
		authUserID, exists := c.Get("userID")
		if exists {
			userID = authUserID.(string)
		}
	}

	if userID == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "userId query parameter is required")
		return
	}

	violations, err := ctrl.monitorService.GetCandidateHistory(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve violations history")
		return
	}

	utils.SuccessResponse(c, "Violations history fetched", violations)
}

type LockExamReq struct {
	UserID string `json:"user_id" binding:"required"`
	Reason string `json:"reason" binding:"required"`
}

func (ctrl *MonitorController) LockExam(c *gin.Context) {
	var req LockExamReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid lock payload")
		return
	}

	// Verify that the authenticated candidate's user ID matches the payload user ID
	authUserID, exists := c.Get("userID")
	if exists && authUserID.(string) != req.UserID {
		utils.ErrorResponse(c, http.StatusForbidden, "Cannot lock another candidate's exam")
		return
	}

	ipAddress := c.ClientIP()
	session, err := ctrl.monitorService.LockSessionManually(req.UserID, req.Reason, ipAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, "Exam locked successfully", gin.H{
		"user_id":       session.UserID,
		"locked_status": session.LockedStatus,
		"status":         session.Status,
	})
}

