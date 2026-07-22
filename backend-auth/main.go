// Package main is the entry point for the Assessment Monitoring System backend.
package main

import (
	"log"

	"backend-auth/internal/config"
	"backend-auth/internal/controllers"
	"backend-auth/internal/middleware"
	"backend-auth/internal/repositories"
	"backend-auth/internal/routes"
	"backend-auth/internal/services"
)

func main() {
	// Load configuration from environment variables
	cfg := config.Load()

	// Initialize database connection and run migrations
	db := config.InitDB(cfg)

	// Initialize repositories
	userRepo := repositories.NewUserRepo(db)
	adminRepo := repositories.NewAdminRepo(db)
	examRepo := repositories.NewExamRepo(db)
	problemRepo := repositories.NewProblemRepo(db)
	submissionRepo := repositories.NewSubmissionRepo(db)
	leaderboardRepo := repositories.NewLeaderboardRepo(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, adminRepo, cfg)
	userService := services.NewUserService(userRepo)
	examService := services.NewExamService(examRepo)
	problemService := services.NewProblemService(problemRepo)
	compilerService := services.NewCompilerService(problemRepo, submissionRepo, cfg)
	leaderboardService := services.NewLeaderboardService(leaderboardRepo, submissionRepo, userRepo)

	// Initialize controllers
	authCtrl := controllers.NewAuthController(authService)
	userCtrl := controllers.NewUserController(userService)
	examCtrl := controllers.NewExamController(examService)
	problemCtrl := controllers.NewProblemController(problemService)
	compilerCtrl := controllers.NewCompilerController(compilerService, leaderboardService)
	leaderboardCtrl := controllers.NewLeaderboardController(leaderboardService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService, cfg)

	// Setup routes
	router := routes.Setup(
		authCtrl, userCtrl, examCtrl, problemCtrl,
		compilerCtrl, leaderboardCtrl,
		authMiddleware, cfg,
	)

	// Start server
	log.Printf("Server starting on port %s in %s mode", cfg.ServerPort, cfg.AppEnv)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
