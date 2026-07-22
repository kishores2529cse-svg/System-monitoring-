package models

import (
	"time"
)

type MonitorEvent struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ExamSessionID    uint      `gorm:"index" json:"exam_session_id"`
	UserID           string    `gorm:"index;not null;size:100" json:"user_id"`
	Timestamp        time.Time `json:"timestamp"`
	FullscreenStatus bool      `json:"fullscreen_status"`
	TabFocusStatus   bool      `json:"tab_focus_status"`
	ConnectionStatus string    `gorm:"size:50" json:"connection_status"`
	CreatedAt        time.Time `json:"created_at"`
}

type Violation struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ExamSessionID uint      `gorm:"index" json:"exam_session_id"`
	UserID        string    `gorm:"index;not null;size:100" json:"user_id"`
	EventType     string    `gorm:"size:100;not null" json:"event_type"` // TAB_SWITCH, EXIT_FULLSCREEN, WINDOW_BLUR, etc.
	Details       string    `gorm:"size:500" json:"details"`
	Timestamp     time.Time `json:"timestamp"`
	CreatedAt     time.Time `json:"created_at"`
}
