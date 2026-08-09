package models

import (
	"time"
)

// TimerStatus represents the possible states of the exam timer.
type TimerStatus string

const (
	TimerStatusNotStarted TimerStatus = "NOT_STARTED"
	TimerStatusRunning    TimerStatus = "RUNNING"
	TimerStatusPaused     TimerStatus = "PAUSED"
	TimerStatusEnded      TimerStatus = "ENDED"
)

// ExamTimer stores the centralized timer state and exam password in the database.
type ExamTimer struct {
	ID                 uint        `gorm:"primaryKey" json:"id"`
	DurationMinutes    int         `gorm:"default:60" json:"duration_minutes"`
	DurationSeconds    int         `gorm:"default:0" json:"duration_seconds"`
	ExamPassword       string      `gorm:"size:255;default:'exam123'" json:"exam_password"`
	Status             TimerStatus `gorm:"size:20;default:NOT_STARTED" json:"status"`
	StartTime          *time.Time  `json:"start_time"`
	AccumulatedSeconds int64       `gorm:"default:0" json:"accumulated_seconds"`
	TotalDurationSecs  int64       `gorm:"default:3600" json:"total_duration_seconds"`
	CreatedAt          time.Time   `json:"created_at"`
	UpdatedAt          time.Time   `json:"updated_at"`
}

// TimerConfigRequest DTO for setting timer duration and exam password.
type TimerConfigRequest struct {
	Minutes      int    `json:"minutes" binding:"gte=0"`
	Seconds      int    `json:"seconds" binding:"gte=0"`
	ExamPassword string `json:"exam_password"`
}

// TimerExtendRequest DTO for extending timer by minutes and seconds.
type TimerExtendRequest struct {
	Minutes int `json:"minutes" binding:"gte=0"`
	Seconds int `json:"seconds" binding:"gte=0"`
}

// VerifyExamPasswordRequest DTO for candidate exam gate verification.
type VerifyExamPasswordRequest struct {
	Password string `json:"password" binding:"required"`
}

// ExamTimerResponse DTO returned to clients for remaining time, status, and password info.
type ExamTimerResponse struct {
	ID                 uint        `json:"id"`
	DurationMinutes    int         `json:"duration_minutes"`
	DurationSeconds    int         `json:"duration_seconds"`
	ExamPassword       string      `json:"exam_password,omitempty"`
	Status             TimerStatus `json:"status"`
	RemainingSeconds   int64       `json:"remaining_seconds"`
	TotalDurationSecs  int64       `json:"total_duration_seconds"`
	AccumulatedSeconds int64       `json:"accumulated_seconds"`
	StartTime          *time.Time  `json:"start_time"`
	UpdatedAt          time.Time   `json:"updated_at"`
}

// GetRemainingSeconds calculates the current remaining time in seconds.
func (t *ExamTimer) GetRemainingSeconds() int64 {
	if t.Status == TimerStatusNotStarted {
		return t.TotalDurationSecs
	}
	if t.Status == TimerStatusEnded {
		return 0
	}

	elapsed := t.AccumulatedSeconds
	if t.Status == TimerStatusRunning && t.StartTime != nil {
		elapsed += int64(time.Since(*t.StartTime).Seconds())
	}

	rem := t.TotalDurationSecs - elapsed
	if rem < 0 {
		return 0
	}
	return rem
}

// ToResponse converts ExamTimer model to ExamTimerResponse DTO.
func (t *ExamTimer) ToResponse() *ExamTimerResponse {
	return &ExamTimerResponse{
		ID:                 t.ID,
		DurationMinutes:    t.DurationMinutes,
		DurationSeconds:    t.DurationSeconds,
		ExamPassword:       t.ExamPassword,
		Status:             t.Status,
		RemainingSeconds:   t.GetRemainingSeconds(),
		TotalDurationSecs:  t.TotalDurationSecs,
		AccumulatedSeconds: t.AccumulatedSeconds,
		StartTime:          t.StartTime,
		UpdatedAt:          t.UpdatedAt,
	}
}
