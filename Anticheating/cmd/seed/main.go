package main

import (
	"log"
	"time"

	"anticheating/internal/config"
	"anticheating/internal/models"
	"anticheating/internal/repositories"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	log.Println("Initializing seeder...")

	cfg := config.LoadConfig()
	db, err := repositories.InitDB(cfg)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}

	log.Println("Seeding database...")

	// 1. Seed Admin
	var adminCount int64
	db.Model(&models.Admin{}).Count(&adminCount)
	if adminCount == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to hash password: %v", err)
		}

		admin := &models.Admin{
			Username:     "admin",
			PasswordHash: string(hashedPassword),
			Email:        "admin@assessment.com",
		}
		if err := db.Create(admin).Error; err != nil {
			log.Fatalf("Failed to seed admin: %v", err)
		}
		log.Println("Default Admin seeded (username: admin, password: password)")
	} else {
		log.Println("Admin table already seeded.")
	}

	// Clean out existing sessions/violations/logs to start fresh during local run
	db.Exec("DELETE FROM exam_sessions")
	db.Exec("DELETE FROM monitor_events")
	db.Exec("DELETE FROM violations")
	db.Exec("DELETE FROM locked_users")
	db.Exec("DELETE FROM activity_logs")

	// 2. Seed Candidates / Exam Sessions
	sessions := []models.ExamSession{
		{
			UserID:         "C101",
			Name:           "Alice Smith",
			CurrentProblem: "Problem 2: Array Reverse",
			RemainingTime:  2700, // 45m
			Status:         "ACTIVE",
			WarningCount:   0,
			MaxWarnings:    3,
			LockedStatus:   false,
			LastHeartbeat:  time.Now(),
			StartedAt:      time.Now().Add(-15 * time.Minute),
		},
		{
			UserID:         "C102",
			Name:           "Bob Johnson",
			CurrentProblem: "Problem 4: Binary Trees",
			RemainingTime:  1200, // 20m
			Status:         "LOCKED",
			WarningCount:   3,
			MaxWarnings:    3,
			LockedStatus:   true,
			LastHeartbeat:  time.Now().Add(-10 * time.Minute),
			StartedAt:      time.Now().Add(-40 * time.Minute),
		},
		{
			UserID:         "C103",
			Name:           "Charlie Brown",
			CurrentProblem: "Problem 5: Graph Traversals",
			RemainingTime:  0,
			Status:         "COMPLETED",
			WarningCount:   1,
			MaxWarnings:    3,
			LockedStatus:   false,
			LastHeartbeat:  time.Now().Add(-5 * time.Minute),
			StartedAt:      time.Now().Add(-50 * time.Minute),
			EndedAt:        func() *time.Time { t := time.Now().Add(-5 * time.Minute); return &t }(),
		},
		{
			UserID:         "C104",
			Name:           "David Miller",
			CurrentProblem: "Problem 1: Two Sum",
			RemainingTime:  3000,
			Status:         "ACTIVE",
			WarningCount:   2,
			MaxWarnings:    3,
			LockedStatus:   false,
			LastHeartbeat:  time.Now(),
			StartedAt:      time.Now().Add(-10 * time.Minute),
		},
	}

	for i := range sessions {
		if err := db.Create(&sessions[i]).Error; err != nil {
			log.Fatalf("Failed to seed session for %s: %v", sessions[i].Name, err)
		}
	}
	log.Println("Sample candidate exam sessions seeded.")

	// 3. Seed Locked Users list
	lockedUser := &models.LockedUser{
		UserID:       "C102",
		Name:         "Bob Johnson",
		LockReason:   "Warning limit exceeded. Warning count: 3. Last violation: DEVTOOLS_OPENED",
		WarningCount: 3,
		LockedTime:   time.Now().Add(-10 * time.Minute),
	}
	if err := db.Create(lockedUser).Error; err != nil {
		log.Fatalf("Failed to seed locked user: %v", err)
	}
	log.Println("Locked users cache seeded.")

	// 4. Seed Violations for Bob Johnson (C102) & Charlie Brown (C103)
	violations := []models.Violation{
		{
			ExamSessionID: 2, // Bob
			UserID:        "C102",
			EventType:     "TAB_SWITCH",
			Details:       "Switched tab to browser search",
			Timestamp:     time.Now().Add(-30 * time.Minute),
		},
		{
			ExamSessionID: 2, // Bob
			UserID:        "C102",
			EventType:     "WINDOW_BLUR",
			Details:       "Client application lost focus",
			Timestamp:     time.Now().Add(-20 * time.Minute),
		},
		{
			ExamSessionID: 2, // Bob
			UserID:        "C102",
			EventType:     "DEVTOOLS_OPENED",
			Details:       "Developer Console opened via F12",
			Timestamp:     time.Now().Add(-10 * time.Minute),
		},
		{
			ExamSessionID: 3, // Charlie
			UserID:        "C103",
			EventType:     "RIGHT_CLICK",
			Details:       "Right-click context menu triggered",
			Timestamp:     time.Now().Add(-45 * time.Minute),
		},
	}

	for i := range violations {
		if err := db.Create(&violations[i]).Error; err != nil {
			log.Fatalf("Failed to seed violations: %v", err)
		}
	}
	log.Println("Sample violations seeded.")

	// 5. Seed Activity Logs
	logs := []models.ActivityLog{
		{
			UserID:    "C101",
			Username:  "Alice Smith",
			Action:    "LOGIN",
			Details:   "Alice Smith logged in and session started",
			Timestamp: time.Now().Add(-15 * time.Minute),
			IPAddress: "192.168.1.5",
		},
		{
			UserID:    "C102",
			Username:  "Bob Johnson",
			Action:    "LOGIN",
			Details:   "Bob Johnson logged in and session started",
			Timestamp: time.Now().Add(-40 * time.Minute),
			IPAddress: "192.168.1.12",
		},
		{
			UserID:    "C102",
			Username:  "Bob Johnson",
			Action:    "TAB_SWITCH",
			Details:   "Malpractice violation detected: TAB_SWITCH. Warning count: 1.",
			Timestamp: time.Now().Add(-30 * time.Minute),
			IPAddress: "192.168.1.12",
		},
		{
			UserID:    "C102",
			Username:  "Bob Johnson",
			Action:    "WINDOW_BLUR",
			Details:   "Malpractice violation detected: WINDOW_BLUR. Warning count: 2.",
			Timestamp: time.Now().Add(-20 * time.Minute),
			IPAddress: "192.168.1.12",
		},
		{
			UserID:    "C102",
			Username:  "Bob Johnson",
			Action:    "DEVTOOLS_OPENED",
			Details:   "Malpractice violation detected: DEVTOOLS_OPENED. Warning count: 3.",
			Timestamp: time.Now().Add(-10 * time.Minute),
			IPAddress: "192.168.1.12",
		},
		{
			UserID:    "SYSTEM",
			Username:  "Auto-Lock System",
			Action:    "LOCK",
			Details:   "Candidate Bob Johnson (ID: C102) automatically locked. Reason: Warning limit exceeded.",
			Timestamp: time.Now().Add(-10 * time.Minute),
			IPAddress: "127.0.0.1",
		},
	}

	for i := range logs {
		if err := db.Create(&logs[i]).Error; err != nil {
			log.Fatalf("Failed to seed activity logs: %v", err)
		}
	}
	log.Println("Sample activity logs seeded.")

	log.Println("Database seeded successfully!")
}
