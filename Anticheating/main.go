package main

import (
	"log"
	"net/http"
	"time"

	"anticheating/internal/config"
	"anticheating/internal/controllers"
	"anticheating/internal/repositories"
	"anticheating/internal/routes"
	"anticheating/internal/services"
)

func main() {
	log.Println("Starting Assessment Monitoring System Backend...")

	// 1. Load config
	cfg := config.LoadConfig()

	// 2. Initialize database
	db, err := repositories.InitDB(cfg)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}

	// 3. Initialize repositories
	adminRepo := repositories.NewAdminRepository(db)
	sessionRepo := repositories.NewSessionRepository(db)
	eventRepo := repositories.NewEventRepository(db)
	logRepo := repositories.NewLogRepository(db)

	// 4. Initialize services
	authService := services.NewAuthService(cfg, adminRepo, sessionRepo, logRepo)
	monitorService := services.NewMonitorService(cfg, sessionRepo, eventRepo, logRepo)
	adminService := services.NewAdminService(sessionRepo, eventRepo, logRepo)

	// 5. Start background worker for offline status checking
	go startOfflineDetector(monitorService)

	// 6. Initialize controllers
	authCtrl := controllers.NewAuthController(authService)
	monitorCtrl := controllers.NewMonitorController(monitorService)
	adminCtrl := controllers.NewAdminController(adminService)
	logCtrl := controllers.NewLogController(adminService)

	// 7. Setup router & start server
	router := routes.SetupRouter(cfg, authCtrl, monitorCtrl, adminCtrl, logCtrl)

	log.Printf("Server is running on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server startup failed: %v", err)
	}
}

// startOfflineDetector periodically sweeps active sessions and marks them OFFLINE if heartbeat is missing
func startOfflineDetector(s *services.MonitorService) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.CheckOfflineSessions()
		}
	}
}
