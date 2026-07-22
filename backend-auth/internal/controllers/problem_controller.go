package controllers

import (
	"net/http"
	"strconv"

	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// ProblemController handles problem retrieval endpoints.
type ProblemController struct {
	problemService *services.ProblemService
}

// NewProblemController creates a new ProblemController.
func NewProblemController(problemService *services.ProblemService) *ProblemController {
	return &ProblemController{problemService: problemService}
}

// GetAllProblems handles GET /api/problems
// Response 200: { "success": true, "data": [ { id, title, difficulty, tags } ] }
func (ctrl *ProblemController) GetAllProblems(c *gin.Context) {
	problems, err := ctrl.problemService.GetAllProblems()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "problems fetched successfully", problems)
}

// GetProblemByID handles GET /api/problems/:problemId
// Response 200: { "success": true, "data": { problem details with samples } }
func (ctrl *ProblemController) GetProblemByID(c *gin.Context) {
	problemIDStr := c.Param("problemId")
	problemID, err := strconv.ParseUint(problemIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "invalid problem ID")
		return
	}

	problem, err := ctrl.problemService.GetProblemByID(uint(problemID))
	if err != nil {
		utils.NotFound(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "problem fetched successfully", problem)
}
