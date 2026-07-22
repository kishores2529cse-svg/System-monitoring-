// Package config - database initialization with GORM.
package config

import (
	"fmt"
	"log"

	"backend-auth/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitDB establishes a connection to PostgreSQL and runs auto-migrations.
func InitDB(cfg *Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate all models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.ExamSession{},
		&models.Problem{},
		&models.TestCase{},
		&models.Submission{},
		&models.Leaderboard{},
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
}

