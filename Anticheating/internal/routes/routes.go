package routes

import (
	"anticheating/internal/config"
	"anticheating/internal/controllers"
	"anticheating/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter(
	cfg *config.Config,
	authCtrl *controllers.AuthController,
	monitorCtrl *controllers.MonitorController,
	adminCtrl *controllers.AdminController,
	logCtrl *controllers.LogController,
) *gin.Engine {
	r := gin.Default()

	r.Use(gin.Recovery())

	api := r.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/candidate/login", authCtrl.CandidateLogin)
			auth.POST("/admin/login", authCtrl.AdminLogin)
		}

		// Candidate-specific protected routes
		candidate := api.Group("")
		candidate.Use(middleware.AuthMiddleware(cfg))
		{
			candidate.POST("/monitor/heartbeat", middleware.CandidateOnly(), monitorCtrl.Heartbeat)
			candidate.POST("/monitor/event", middleware.CandidateOnly(), monitorCtrl.MalpracticeEvent)
			candidate.POST("/exam/lock", middleware.CandidateOnly(), monitorCtrl.LockExam)
		}

		// Shared protected routes (Any valid candidate or admin token)
		shared := api.Group("")
		shared.Use(middleware.AuthMiddleware(cfg))
		{
			shared.GET("/monitor/history", monitorCtrl.ViolationHistory)
		}

		// Admin-only protected routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(cfg), middleware.AdminOnly())
		{
			admin.GET("/dashboard", adminCtrl.Dashboard)
			admin.GET("/live-sessions", adminCtrl.LiveSessions)
			admin.GET("/live-events", adminCtrl.LiveEvents)
			admin.GET("/locked-users", adminCtrl.LockedUsers)
			admin.GET("/user/:userId", adminCtrl.UserDetails)

			admin.POST("/unlock", adminCtrl.Unlock)
			admin.POST("/reject", adminCtrl.Reject)
			admin.POST("/extend-time", adminCtrl.ExtendTime)
			admin.POST("/terminate-session", adminCtrl.TerminateSession)
		}

		// Audit Logs (AdminOnly)
		logs := api.Group("")
		logs.Use(middleware.AuthMiddleware(cfg), middleware.AdminOnly())
		{
			logs.GET("/logs", logCtrl.GetLogs)
		}
	}

	return r
}
