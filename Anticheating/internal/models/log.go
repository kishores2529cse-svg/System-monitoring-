package models

import (
	"time"
)

type ActivityLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index;size:100" json:"user_id"`
	Username  string    `gorm:"size:255" json:"username"`
	Action    string    `gorm:"index;size:100;not null" json:"action"` // LOGIN, LOGOUT, TAB_SWITCH, LOCK, etc.
	Details   string    `gorm:"size:1000" json:"details"`
	Timestamp time.Time `json:"timestamp"`
	IPAddress string    `gorm:"size:100" json:"ip_address"`
	CreatedAt time.Time `json:"created_at"`
}
