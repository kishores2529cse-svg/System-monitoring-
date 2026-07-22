package controllers

import (
	"net/http"
	"strconv"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// CompilerController handles code execution and submission endpoints.
type CompilerController struct {
	compilerService   *services.CompilerService
	leaderboardService *services.LeaderboardService
}

// NewCompilerController creates a new CompilerController.
func NewCompilerController(
	compilerService *services.CompilerService,
	leaderboardService *services.LeaderboardService,
) *CompilerController {
	return &CompilerController{
		compilerService:    compilerService,
		leaderboardService: leaderboardService,
	}
}

// RunCode handles POST /api/compiler/run
// Request body: { "code": "...", "language": "go" }
// Response 200: { "success": true, "data": { output, execution_time, ... } }
func (ctrl *CompilerController) RunCode(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	var req models.RunRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	// Default to Go if language not specified
	if req.Language == "" {
		req.Language = "go"
	}

	result, err := ctrl.compilerService.RunCode(userID.(uint), req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "code executed successfully", result)
}

// SubmitCode handles POST /api/compiler/submit
// Request body: { "code": "...", "language": "go" }
// Response 200: { "success": true, "data": { verdict, output, ... } }
func (ctrl *CompilerController) SubmitCode(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	// Get problem ID from query param
	problemIDStr := c.Query("problemId")
	if problemIDStr == "" {
		utils.BadRequest(c, "problemId query parameter is required")
		return
	}
	problemID, err := strconv.ParseUint(problemIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "invalid problemId")
		return
	}

	var req models.SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	if req.Language == "" {
		req.Language = "go"
	}

	result, err := ctrl.compilerService.SubmitCode(userID.(uint), uint(problemID), req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	// Update leaderboard after successful submission
	if result.Verdict != models.VerdictCompilationError {
		sub := &models.Submission{
			UserID:    userID.(uint),
			ProblemID: uint(problemID),
			Verdict:   result.Verdict,
			ExecTime:  result.ExecutionTime,
			Score:     result.TestCasesPassed * 100 / result.TotalTestCases,
		}
		ctrl.leaderboardService.UpdateLeaderboard(userID.(uint), sub)
	}

	utils.SuccessResponse(c, http.StatusOK, "code evaluated", result)
}
