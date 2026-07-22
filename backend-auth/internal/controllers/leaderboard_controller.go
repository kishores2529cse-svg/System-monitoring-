package controllers

import (
	"net/http"
	"strconv"

	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// LeaderboardController handles leaderboard retrieval endpoints.
type LeaderboardController struct {
	leaderboardService *services.LeaderboardService
}

// NewLeaderboardController creates a new LeaderboardController.
func NewLeaderboardController(leaderboardService *services.LeaderboardService) *LeaderboardController {
	return &LeaderboardController{leaderboardService: leaderboardService}
}

// GetLeaderboard handles GET /api/leaderboard?limit=50
// Response 200: { "success": true, "data": [ { rank, name, score, ... } ] }
func (ctrl *LeaderboardController) GetLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 50
	}

	entries, err := ctrl.leaderboardService.GetLeaderboard(limit)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "leaderboard fetched successfully", entries)
}
