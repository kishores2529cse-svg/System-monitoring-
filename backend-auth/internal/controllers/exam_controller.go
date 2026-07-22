package controllers

import (
	"net/http"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// ExamController handles exam session endpoints.
type ExamController struct {
	examService *services.ExamService
}

// NewExamController creates a new ExamController.
func NewExamController(examService *services.ExamService) *ExamController {
	return &ExamController{examService: examService}
}

// StartExam handles POST /api/exam/start
// Request body: { "duration": 60 }
// Response 200: { "success": true, "data": { session } }
func (ctrl *ExamController) StartExam(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	var req models.StartExamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// Default to 60 minutes if no duration provided
		req.Duration = 60
	}

	session, err := ctrl.examService.StartExam(userID.(uint), req.Duration)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "exam started successfully", session)
}

// GetStatus handles GET /api/exam/status
// Response 200: { "success": true, "data": { status, remaining_seconds, ... } }
func (ctrl *ExamController) GetStatus(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	status, err := ctrl.examService.GetStatus(userID.(uint))
	if err != nil {
		utils.NotFound(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "exam status fetched", status)
}

// EndExam handles POST /api/exam/end
// Response 200: { "success": true, "data": { session } }
func (ctrl *ExamController) EndExam(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	session, err := ctrl.examService.EndExam(userID.(uint))
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "exam ended successfully", session)
}
