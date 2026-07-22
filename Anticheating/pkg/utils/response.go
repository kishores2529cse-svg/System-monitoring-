package utils

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func JSONResponse(c *gin.Context, statusCode int, success bool, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Success: success,
		Message: message,
		Data:    data,
	})
}

func SuccessResponse(c *gin.Context, message string, data interface{}) {
	JSONResponse(c, http.StatusOK, true, message, data)
}

func ErrorResponse(c *gin.Context, statusCode int, message string) {
	JSONResponse(c, statusCode, false, message, nil)
}
