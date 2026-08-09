package services

import (
	"errors"
	"strings"
	"time"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// TimerService handles business logic for central exam timer.
type TimerService struct {
	timerRepo *repositories.TimerRepo
}

// NewTimerService creates a new TimerService instance.
func NewTimerService(timerRepo *repositories.TimerRepo) *TimerService {
	return &TimerService{timerRepo: timerRepo}
}

// GetStatus returns the current exam timer status and updates state if expired.
func (s *TimerService) GetStatus() (*models.ExamTimerResponse, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer status")
	}

	// Auto-expire if running and remaining seconds reaches 0
	if timer.Status == models.TimerStatusRunning && timer.GetRemainingSeconds() <= 0 {
		timer.Status = models.TimerStatusEnded
		timer.StartTime = nil
		s.timerRepo.SaveTimer(timer)
	}

	return timer.ToResponse(), nil
}

// ConfigureTimer updates the total exam duration and optional exam password (Admin only).
func (s *TimerService) ConfigureTimer(minutes, seconds int, examPassword string) (*models.ExamTimerResponse, error) {
	totalSecs := int64(minutes*60 + seconds)
	if totalSecs <= 0 {
		return nil, errors.New("duration must be greater than 0 seconds")
	}

	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	timer.DurationMinutes = minutes
	timer.DurationSeconds = seconds
	timer.TotalDurationSecs = totalSecs

	if strings.TrimSpace(examPassword) != "" {
		timer.ExamPassword = strings.TrimSpace(examPassword)
	}

	// If timer has not started, reset accumulated time
	if timer.Status == models.TimerStatusNotStarted {
		timer.AccumulatedSeconds = 0
		timer.StartTime = nil
	} else if timer.Status == models.TimerStatusRunning || timer.Status == models.TimerStatusPaused {
		// Adjust status if new duration is less than elapsed time
		rem := timer.GetRemainingSeconds()
		if rem <= 0 {
			timer.Status = models.TimerStatusEnded
			timer.StartTime = nil
		}
	}

	if err := s.timerRepo.SaveTimer(timer); err != nil {
		return nil, errors.New("failed to update timer configuration")
	}

	return timer.ToResponse(), nil
}

// VerifyExamPassword checks if the candidate input password matches the admin-set ExamPassword.
func (s *TimerService) VerifyExamPassword(password string) (bool, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return false, errors.New("failed to fetch timer configuration")
	}

	cleanInput := strings.TrimSpace(password)
	cleanStored := strings.TrimSpace(timer.ExamPassword)
	if cleanStored == "" {
		cleanStored = "exam123" // default fallback
	}

	return cleanInput == cleanStored, nil
}

// StartTimer starts the assessment timer for all candidates (Admin only).
func (s *TimerService) StartTimer() (*models.ExamTimerResponse, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	now := time.Now()
	timer.Status = models.TimerStatusRunning
	timer.StartTime = &now
	timer.AccumulatedSeconds = 0

	if err := s.timerRepo.SaveTimer(timer); err != nil {
		return nil, errors.New("failed to start timer")
	}

	return timer.ToResponse(), nil
}

// PauseTimer pauses the assessment timer (Admin only).
func (s *TimerService) PauseTimer() (*models.ExamTimerResponse, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	if timer.Status == models.TimerStatusRunning && timer.StartTime != nil {
		timer.AccumulatedSeconds += int64(time.Since(*timer.StartTime).Seconds())
		timer.Status = models.TimerStatusPaused
		timer.StartTime = nil

		if err := s.timerRepo.SaveTimer(timer); err != nil {
			return nil, errors.New("failed to pause timer")
		}
	}

	return timer.ToResponse(), nil
}

// ResumeTimer resumes a paused assessment timer (Admin only).
func (s *TimerService) ResumeTimer() (*models.ExamTimerResponse, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	if timer.Status == models.TimerStatusPaused || timer.Status == models.TimerStatusNotStarted {
		now := time.Now()
		timer.Status = models.TimerStatusRunning
		timer.StartTime = &now

		if err := s.timerRepo.SaveTimer(timer); err != nil {
			return nil, errors.New("failed to resume timer")
		}
	}

	return timer.ToResponse(), nil
}

// ExtendTimer adds extra minutes and seconds to the current assessment duration (Admin only).
func (s *TimerService) ExtendTimer(minutes, seconds int) (*models.ExamTimerResponse, error) {
	addSecs := int64(minutes*60 + seconds)
	if addSecs <= 0 {
		return nil, errors.New("additional time must be greater than 0 seconds")
	}

	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	timer.TotalDurationSecs += addSecs
	timer.DurationMinutes += minutes + (timer.DurationSeconds+seconds)/60
	timer.DurationSeconds = (timer.DurationSeconds + seconds) % 60

	// If timer was ended due to timeout, set back to paused or running
	if timer.Status == models.TimerStatusEnded {
		timer.Status = models.TimerStatusPaused
	}

	if err := s.timerRepo.SaveTimer(timer); err != nil {
		return nil, errors.New("failed to extend timer")
	}

	return timer.ToResponse(), nil
}

// EndTimer ends the assessment for all candidates immediately (Admin only).
func (s *TimerService) EndTimer() (*models.ExamTimerResponse, error) {
	timer, err := s.timerRepo.GetTimer()
	if err != nil {
		return nil, errors.New("failed to fetch timer")
	}

	timer.Status = models.TimerStatusEnded
	timer.StartTime = nil

	if err := s.timerRepo.SaveTimer(timer); err != nil {
		return nil, errors.New("failed to end timer")
	}

	return timer.ToResponse(), nil
}
