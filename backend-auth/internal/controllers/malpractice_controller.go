package controllers

import (
	"net/http"
	"strconv"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// MalpracticeController handles HTTP requests for candidate violations.
type MalpracticeController struct {
	service *services.MalpracticeService
}

// NewMalpracticeController creates a new MalpracticeController.
func NewMalpracticeController(service *services.MalpracticeService) *MalpracticeController {
	return &MalpracticeController{service: service}
}

// LogMalpractice handles POST /api/monitoring/malpractice.
func (ctrl *MalpracticeController) LogMalpractice(c *gin.Context) {
	var req models.LogMalpracticeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Invalid malpractice payload: "+err.Error())
		return
	}

	// If authenticated user token is present, ensure correct UserID
	if authUserID, exists := c.Get("userID"); exists {
		if uid, ok := authUserID.(uint); ok && uid > 0 {
			req.UserID = uid
		}
	}

	// Fallback to default user 1 if not provided
	if req.UserID == 0 {
		req.UserID = 1
	}

	logEntry, err := ctrl.service.LogViolation(&req)
	if err != nil {
		utils.InternalError(c, "Failed to record malpractice event: "+err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Malpractice event recorded successfully", logEntry)
}

// GetUserMalpractices handles GET /api/monitoring/malpractice/user/:userId.
func (ctrl *MalpracticeController) GetUserMalpractices(c *gin.Context) {
	userIDStr := c.Param("userId")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "Invalid user ID")
		return
	}

	logs, err := ctrl.service.GetUserViolations(uint(userID))
	if err != nil {
		utils.InternalError(c, "Failed to fetch malpractice logs")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Malpractice logs retrieved", logs)
}

// GetAllMalpractices handles GET /api/admin/malpractice.
func (ctrl *MalpracticeController) GetAllMalpractices(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "100")
	limit, _ := strconv.Atoi(limitStr)

	logs, err := ctrl.service.GetAllViolations(limit)
	if err != nil {
		utils.InternalError(c, "Failed to fetch all malpractice logs")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "All malpractice logs retrieved", logs)
}
