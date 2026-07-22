package controllers

import (
	"net/http"
	"anticheating/internal/services"
	"anticheating/pkg/utils"
	"github.com/gin-gonic/gin"
)

type LogController struct {
	adminService *services.AdminService
}

func NewLogController(adminService *services.AdminService) *LogController {
	return &LogController{adminService: adminService}
}

func (ctrl *LogController) GetLogs(c *gin.Context) {
	userID := c.Query("userId")
	dateStr := c.Query("date")
	action := c.Query("action")

	logs, err := ctrl.adminService.GetAuditLogs(userID, dateStr, action)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve activity logs: "+err.Error())
		return
	}

	utils.SuccessResponse(c, "Audit logs retrieved", logs)
}
