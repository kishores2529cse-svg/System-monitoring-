package config

import (
	"testing"
	"backend-auth/internal/models"
)

func TestSupabaseInitDB(t *testing.T) {
	cfg := Load()
	t.Logf("Connecting to Supabase Host=%s, User=%s", cfg.DBHost, cfg.DBUser)
	
	// Open connection & auto-migrate all models (including MalpracticeLog with candidate_name)
	db := InitDB(cfg)
	if db == nil {
		t.Fatal("Failed to initialize DB")
	}

	var userCount int64
	if err := db.Model(&models.User{}).Count(&userCount).Error; err != nil {
		t.Fatalf("Failed to query users table: %v", err)
	}
	t.Logf("🎉 Users table active! User count: %d", userCount)

	// Seed a test malpractice log with Candidate Name
	testLog := models.MalpracticeLog{
		UserID:         1,
		CandidateName:  "Kishore S",
		CandidateEmail: "kishore@shakthi.edu",
		EventType:      "UNAUTHORIZED_OBJECT",
		Details:        "Mobile phone detected during assessment (91.2% confidence)",
		Severity:       "CRITICAL",
		DetectedItem:   "cell phone (91.2%)",
		Confidence:     0.912,
	}
	if err := db.Create(&testLog).Error; err != nil {
		t.Fatalf("Failed to create test malpractice log with candidate name: %v", err)
	}
	t.Logf("🎉 malpractice_logs table updated with candidate_name in Supabase! Log ID: %d", testLog.ID)
}
