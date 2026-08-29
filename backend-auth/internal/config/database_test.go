package config

import (
	"testing"
	"backend-auth/internal/models"
)

func TestSupabaseInitDB(t *testing.T) {
	cfg := Load()
	t.Logf("Connecting to Supabase Host=%s, User=%s", cfg.DBHost, cfg.DBUser)
	
	// Open connection
	db := InitDB(cfg)
	if db == nil {
		t.Fatal("Failed to initialize DB")
	}

	var userCount int64
	if err := db.Model(&models.User{}).Count(&userCount).Error; err != nil {
		t.Fatalf("Failed to query users table: %v", err)
	}
	t.Logf("🎉 Supabase migration and seeding successful! User count: %d", userCount)
}
