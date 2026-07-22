package controllers

import (
	"net/http"

	"backend-auth/internal/models"
	"backend-auth/internal/services"
	"backend-auth/pkg/utils"

	"github.com/gin-gonic/gin"
)

// UserController handles user profile endpoints.
type UserController struct {
	userService *services.UserService
}

// NewUserController creates a new UserController.
func NewUserController(userService *services.UserService) *UserController {
	return &UserController{userService: userService}
}

// GetProfile handles GET /api/user/profile
// Response 200: { "success": true, "data": { user } }
func (ctrl *UserController) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	user, err := ctrl.userService.GetProfile(userID.(uint))
	if err != nil {
		utils.NotFound(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "profile fetched successfully", user.ToUserResponse())
}

// UpdateProfile handles PUT /api/user/profile
// Request body: { "name": "...", "phone": "...", "college": "..." }
// Response 200: { "success": true, "data": { user } }
func (ctrl *UserController) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not authenticated")
		return
	}

	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "validation failed: "+err.Error())
		return
	}

	user, err := ctrl.userService.UpdateProfile(userID.(uint), req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "profile updated successfully", user.ToUserResponse())
}
