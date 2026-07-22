package models

import (
	"time"
)

type ExamSession struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	UserID         string     `gorm:"uniqueIndex;not null;size:100" json:"user_id"`
	Name           string     `gorm:"not null;size:255" json:"name"`
	CurrentProblem string     `gorm:"size:255" json:"current_problem"`
	RemainingTime  int        `gorm:"default:3600" json:"remaining_time"` // in seconds
	Status         string     `gorm:"default:'ACTIVE';size:50" json:"status"` // ACTIVE, LOCKED, COMPLETED, TERMINATED, OFFLINE
	WarningCount   int        `gorm:"default:0" json:"warning_count"`
	MaxWarnings    int        `gorm:"default:3" json:"max_warnings"`
	LockedStatus   bool       `gorm:"default:false" json:"locked_status"`
	LastHeartbeat  time.Time  `json:"last_heartbeat"`
	StartedAt      time.Time  `json:"started_at"`
	EndedAt        *time.Time `json:"ended_at,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type LockedUser struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       string    `gorm:"uniqueIndex;not null;size:100" json:"user_id"`
	Name         string    `gorm:"not null;size:255" json:"name"`
	LockReason   string    `gorm:"size:500" json:"lock_reason"`
	WarningCount int       `json:"warning_count"`
	LockedTime   time.Time `json:"locked_time"`
	CreatedAt    time.Time `json:"created_at"`
}
