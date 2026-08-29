// Package routes registers all API endpoints with the Gin router.
package routes

import (
	"backend-auth/internal/config"
	"backend-auth/internal/controllers"
	"backend-auth/internal/middleware"

	"github.com/gin-gonic/gin"
)

// Setup configures all API routes and returns the Gin engine.
func Setup(
	authCtrl *controllers.AuthController,
	userCtrl *controllers.UserController,
	examCtrl *controllers.ExamController,
	problemCtrl *controllers.ProblemController,
	compilerCtrl *controllers.CompilerController,
	leaderboardCtrl *controllers.LeaderboardController,
	timerCtrl *controllers.TimerController,
	malpracticeCtrl *controllers.MalpracticeController,
	authMiddleware *middleware.AuthMiddleware,
	cfg *config.Config,
) *gin.Engine {
	// Set release mode in production
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api")

	// ======== Public Auth Routes ========
	auth := api.Group("/auth")
	{
		auth.POST("/register", authCtrl.Register)
		auth.POST("/login", authCtrl.Login)
		auth.POST("/logout", authMiddleware.RequireAuth(), authCtrl.Logout)
	}

	// ======== Admin Routes ========
	admin := api.Group("/admin")
	{
		admin.POST("/login", authCtrl.AdminLogin)
	}

	adminProtected := api.Group("/admin")
	adminProtected.Use(authMiddleware.RequireAdmin())
	{
		adminProtected.POST("/problems", problemCtrl.CreateProblem)
		adminProtected.GET("/timer", timerCtrl.GetTimerStatus)
		adminProtected.POST("/timer/config", timerCtrl.ConfigTimer)
		adminProtected.POST("/timer/start", timerCtrl.StartTimer)
		adminProtected.POST("/timer/pause", timerCtrl.PauseTimer)
		adminProtected.POST("/timer/resume", timerCtrl.ResumeTimer)
		adminProtected.POST("/timer/extend", timerCtrl.ExtendTimer)
		adminProtected.POST("/timer/end", timerCtrl.EndTimer)
		adminProtected.GET("/malpractice", malpracticeCtrl.GetAllMalpractices)
	}

	// ======== Public/Student Read-only Timer Status & Exam Gate ========
	api.GET("/timer/status", timerCtrl.GetTimerStatus)
	api.POST("/exam/verify-password", timerCtrl.VerifyExamPassword)

	// ======== Malpractice Logging Routes ========
	monitoring := api.Group("/monitoring")
	{
		monitoring.POST("/malpractice", malpracticeCtrl.LogMalpractice)
		monitoring.GET("/malpractice/user/:userId", malpracticeCtrl.GetUserMalpractices)
	}

	// ======== Protected User Routes ========
	user := api.Group("/user")
	user.Use(authMiddleware.RequireAuth())
	{
		user.GET("/profile", userCtrl.GetProfile)
		user.PUT("/profile", userCtrl.UpdateProfile)
	}

	// ======== Protected Exam Routes ========
	exam := api.Group("/exam")
	exam.Use(authMiddleware.RequireAuth())
	{
		exam.POST("/start", examCtrl.StartExam)
		exam.GET("/status", examCtrl.GetStatus)
		exam.POST("/end", examCtrl.EndExam)
	}

	// ======== Public Problem Routes (read-only) ========
	problems := api.Group("/problems")
	{
		problems.GET("", problemCtrl.GetAllProblems)
		problems.GET("/:problemId", problemCtrl.GetProblemByID)
	}

	// ======== Protected Compiler Routes ========
	compiler := api.Group("/compiler")
	compiler.Use(authMiddleware.RequireAuth())
	{
		compiler.POST("/run", compilerCtrl.RunCode)
		compiler.POST("/submit", compilerCtrl.SubmitCode)
	}

	// ======== Protected Leaderboard Routes ========
	leaderboard := api.Group("/leaderboard")
	{
		leaderboard.GET("", leaderboardCtrl.GetLeaderboard)
	}

	return r
}
