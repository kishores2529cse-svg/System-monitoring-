package repositories

import (
	"fmt"
	"log"
	
	"anticheating/internal/config"
	"anticheating/internal/models"
	
	"gorm.io/driver/postgres"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	if cfg.DBDriver == "postgres" {
		db, err = gorm.Open(postgres.Open(cfg.DBSource), &gorm.Config{})
	} else {
		db, err = gorm.Open(sqlite.Open(cfg.DBSource), &gorm.Config{})
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Migrating database schemas...")
	err = db.AutoMigrate(
		&models.Admin{},
		&models.ExamSession{},
		&models.MonitorEvent{},
		&models.Violation{},
		&models.LockedUser{},
		&models.ActivityLog{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to run database migration: %w", err)
	}

	log.Println("Database migration completed successfully.")
	return db, nil
}
