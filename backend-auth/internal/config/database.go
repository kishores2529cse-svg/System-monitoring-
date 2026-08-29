// Package config - database initialization with GORM.
package config

import (
	"fmt"
	"log"
	"strings"

	"backend-auth/internal/models"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitDB establishes a connection to PostgreSQL and runs auto-migrations.
func InitDB(cfg *Config) *gorm.DB {
	var dsn string
	if strings.Contains(cfg.DBHost, "supabase") {
		dsn = fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=%s",
			cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSSLMode)
	} else {
		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
			cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Printf("Warning: Failed to connect via primary DSN (%v), trying fallback format...", err)
		fallbackDSN := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
		)
		db, err = gorm.Open(postgres.Open(fallbackDSN), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err != nil {
			log.Printf("Warning: Failed to connect to PostgreSQL database (%v).", err)
			log.Println("Falling back to local SQLite database: sqlite.db")
			db, err = gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{
				Logger: logger.Default.LogMode(logger.Info),
			})
			if err != nil {
				log.Fatalf("Failed to initialize local SQLite database: %v", err)
			}
		}
	}

	// Auto-migrate all models (creates or updates tables safely without dropping data)

	// Auto-migrate all models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.ExamSession{},
		&models.Problem{},
		&models.TestCase{},
		&models.Submission{},
		&models.Leaderboard{},
		&models.ExamTimer{},
		&models.MalpracticeLog{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connected and migrated successfully")
	SeedInitialData(db)
	return db
}

// SeedInitialData seeds the database with initial Admin, User, and Problem data if empty.
func SeedInitialData(db *gorm.DB) {
	// Seed Admin
	var adminCount int64
	db.Model(&models.Admin{}).Count(&adminCount)
	if adminCount == 0 {
		hashedAdminPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err == nil {
			admin := models.Admin{
				Email:    "admin@codeshield.ai",
				Password: string(hashedAdminPassword),
				Name:     "System Administrator",
			}
			if err := db.Create(&admin).Error; err == nil {
				log.Println("Seeded initial Admin account: admin@codeshield.ai")
			}
		}
	}

	// Seed Admin abc@gmail.com
	var abcAdmin models.Admin
	if err := db.Where("email = ?", "abc@gmail.com").First(&abcAdmin).Error; err != nil {
		hashedPwd, err := bcrypt.GenerateFromPassword([]byte("xyz"), bcrypt.DefaultCost)
		if err == nil {
			admin := models.Admin{
				Email:    "abc@gmail.com",
				Password: string(hashedPwd),
				Name:     "Admin ABC",
			}
			if err := db.Create(&admin).Error; err == nil {
				log.Println("Seeded Admin account: abc@gmail.com")
			}
		}
	}

	// Seed User
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		hashedUserPassword, err := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)
		if err == nil {
			user := models.User{
				Username: "user_codeshield",
				Email:    "user@codeshield.ai",
				Password: string(hashedUserPassword),
				Name:     "Default Candidate",
				College:  "Technology Institute",
			}
			if err := db.Create(&user).Error; err == nil {
				log.Println("Seeded initial Candidate User account: user@codeshield.ai")
			}
		}
	}

	// Seed User kishore@shakthi.edu
	var kishoreUser models.User
	if err := db.Where("email = ?", "kishore@shakthi.edu").First(&kishoreUser).Error; err != nil {
		hashedUserPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		if err == nil {
			user := models.User{
				Username: "kishore_shakthi",
				Email:    "kishore@shakthi.edu",
				Password: string(hashedUserPassword),
				Name:     "Kishore S",
				College:  "Sri Shakthi Institute of Engineering and Technology",
			}
			if err := db.Create(&user).Error; err == nil {
				log.Println("Seeded User account: kishore@shakthi.edu")
			}
		}
	}

	// Seed Initial Problem if none exists
	var problemCount int64
	db.Model(&models.Problem{}).Count(&problemCount)
	if problemCount == 0 {
		prob := models.Problem{
			Title:        "Two Sum",
			Description:  "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
			Constraints:  "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
			Difficulty:   models.DifficultyEasy,
			Tags:         "array,hash-table",
			SampleInput:  "nums = [2,7,11,15], target = 9",
			SampleOutput: "[0, 1]",
			TimeLimit:    2,
			MemoryLimit:  256,
			TestCases: []models.TestCase{
				{
					Input:    "nums = [2,7,11,15], target = 9",
					Expected: "[0, 1]",
					Type:     models.TestCaseTypeSample,
				},
				{
					Input:    "nums = [3,2,4], target = 6",
					Expected: "[1, 2]",
					Type:     models.TestCaseTypeHidden,
				},
			},
		}
		if err := db.Create(&prob).Error; err == nil {
			log.Println("Seeded initial Problem: Two Sum")
		}
	}

	// Seed Initial Central ExamTimer if none exists
	var timerCount int64
	db.Model(&models.ExamTimer{}).Count(&timerCount)
	if timerCount == 0 {
		timer := models.ExamTimer{
			ID:                 1,
			DurationMinutes:    60,
			Status:             models.TimerStatusNotStarted,
			AccumulatedSeconds: 0,
			TotalDurationSecs:  3600,
		}
		if err := db.Create(&timer).Error; err == nil {
			log.Println("Seeded initial Central ExamTimer (ID: 1, 60m)")
		}
	}
}

