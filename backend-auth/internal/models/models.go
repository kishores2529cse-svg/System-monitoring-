// Package models defines all database models and DTOs for the assessment system.
package models

import (
	"time"

	"gorm.io/gorm"
)

// ==================== User ====================

// User represents a registered candidate.
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Email     string         `gorm:"uniqueIndex;size:255;not null" json:"email" binding:"required,email"`
	Password  string         `gorm:"not null" json:"-"`
	Name      string         `gorm:"size:255;not null" json:"name" binding:"required"`
	Phone     string         `gorm:"size:20" json:"phone"`
	College   string         `gorm:"size:255" json:"college"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// RegisterRequest is the DTO for user registration.
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
	Phone    string `json:"phone"`
	College  string `json:"college"`
}

// LoginRequest is the DTO for user login.
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UpdateProfileRequest is the DTO for updating user profile.
type UpdateProfileRequest struct {
	Name    string `json:"name" binding:"omitempty"`
	Phone   string `json:"phone" binding:"omitempty"`
	College string `json:"college" binding:"omitempty"`
}

// UserResponse is the DTO returned to the client for user data.
type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	College   string    `json:"college"`
	CreatedAt time.Time `json:"created_at"`
}

// ToUserResponse converts a User model to a UserResponse DTO.
func (u *User) ToUserResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Name:      u.Name,
		Phone:     u.Phone,
		College:   u.College,
		CreatedAt: u.CreatedAt,
	}
}

// ==================== Admin ====================

// Admin represents an administrator account.
type Admin struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Email     string         `gorm:"uniqueIndex;size:255;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// AdminLoginRequest is the DTO for admin login.
type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AdminResponse is the DTO returned for admin data.
type AdminResponse struct {
	ID   uint   `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
}

// ==================== ExamSession ====================

// ExamStatus represents the possible states of an exam.
type ExamStatus string

const (
	ExamStatusNotStarted ExamStatus = "NOT_STARTED"
	ExamStatusActive     ExamStatus = "ACTIVE"
	ExamStatusCompleted  ExamStatus = "COMPLETED"
)

// ExamSession tracks a candidate's exam attempt.
type ExamSession struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index;not null" json:"user_id"`
	User        User      `gorm:"foreignKey:UserID" json:"-"`
	Status      ExamStatus `gorm:"size:20;default:NOT_STARTED" json:"status"`
	StartTime   *time.Time `json:"start_time"`
	EndTime     *time.Time `json:"end_time"`
	Duration    int        `gorm:"default:60" json:"duration"` // in minutes
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// StartExamRequest is the DTO to start an exam.
type StartExamRequest struct {
	Duration int `json:"duration" binding:"omitempty,min=10,max=180"`
}

// ExamStatusResponse is the DTO returned for exam status.
type ExamStatusResponse struct {
	Status           ExamStatus `json:"status"`
	RemainingSeconds int64      `json:"remaining_seconds"`
	StartTime        *time.Time `json:"start_time"`
	EndTime          *time.Time `json:"end_time"`
	IsSubmitted      bool       `json:"is_submitted"`
}

// ==================== Problem ====================

// Difficulty represents the difficulty level of a problem.
type Difficulty string

const (
	DifficultyEasy   Difficulty = "EASY"
	DifficultyMedium Difficulty = "MEDIUM"
	DifficultyHard   Difficulty = "HARD"
)

// Problem represents a coding problem.
type Problem struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"size:255;not null" json:"title"`
	Description string     `gorm:"type:text;not null" json:"description"`
	Constraints string     `gorm:"type:text" json:"constraints"`
	Difficulty  Difficulty `gorm:"size:20;not null" json:"difficulty"`
	Tags        string     `gorm:"size:500" json:"tags"` // comma-separated
	SampleInput  string    `gorm:"type:text" json:"sample_input"`
	SampleOutput string    `gorm:"type:text" json:"sample_output"`
	TimeLimit   int        `gorm:"default:2" json:"time_limit"`   // seconds
	MemoryLimit int        `gorm:"default:256" json:"memory_limit"` // MB
	TestCases   []TestCase `gorm:"foreignKey:ProblemID" json:"-"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// ProblemResponse is a condensed DTO for listing problems.
type ProblemResponse struct {
	ID         uint       `json:"id"`
	Title      string     `json:"title"`
	Difficulty Difficulty `json:"difficulty"`
	Tags       string     `json:"tags"`
}

// ProblemDetailResponse is the full DTO for a problem (includes samples, excludes hidden tests).
type ProblemDetailResponse struct {
	ID           uint       `json:"id"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Constraints  string     `json:"constraints"`
	Difficulty   Difficulty `json:"difficulty"`
	Tags         string     `json:"tags"`
	SampleInput  string     `json:"sample_input"`
	SampleOutput string     `json:"sample_output"`
	TimeLimit    int        `json:"time_limit"`
	MemoryLimit  int        `json:"memory_limit"`
}

// ==================== TestCase ====================

// TestCaseType distinguishes between sample and hidden test cases.
type TestCaseType string

const (
	TestCaseTypeSample SampleOrHidden = "SAMPLE"
	TestCaseTypeHidden SampleOrHidden = "HIDDEN"
)

// SampleOrHidden is used for test case visibility.
type SampleOrHidden string

// TestCase represents an input/output pair for testing solutions.
type TestCase struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ProblemID uint           `gorm:"index;not null" json:"problem_id"`
	Input     string         `gorm:"type:text;not null" json:"input"`
	Expected  string         `gorm:"type:text;not null" json:"expected_output"`
	Type      SampleOrHidden `gorm:"size:10;default:SAMPLE" json:"type"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

// ==================== Submission ====================

// Verdict represents the result of a code submission.
type Verdict string

const (
	VerdictAccepted        Verdict = "Accepted"
	VerdictWrongAnswer     Verdict = "Wrong Answer"
	VerdictRuntimeError    Verdict = "Runtime Error"
	VerdictCompilationError Verdict = "Compilation Error"
	VerdictTimeLimitExceeded Verdict = "Time Limit Exceeded"
	VerdictMemoryLimitExceeded Verdict = "Memory Limit Exceeded"
	VerdictPending         Verdict = "Pending"
)

// Submission records a candidate's code submission.
type Submission struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `gorm:"index;not null" json:"user_id"`
	ProblemID  uint      `gorm:"index;not null" json:"problem_id"`
	Code       string    `gorm:"type:text;not null" json:"code"`
	Language   string    `gorm:"size:20;default:go" json:"language"`
	Verdict    Verdict   `gorm:"size:30;default:Pending" json:"verdict"`
	Output     string    `gorm:"type:text" json:"output"`
	ErrorMsg   string    `gorm:"type:text" json:"error_message"`
	ExecTime   float64   `json:"execution_time"` // in seconds
	MemoryUsed int       `json:"memory_used"`    // in KB
	Score      int       `gorm:"default:0" json:"score"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// RunRequest is the DTO for running code against sample test cases.
type RunRequest struct {
	Code      string `json:"code" binding:"required"`
	Language  string `json:"language" binding:"required,oneof=go"`
	ProblemID uint   `json:"problem_id" binding:"required"`
}

// SubmitRequest is the DTO for submitting code for evaluation.
type SubmitRequest struct {
	Code     string `json:"code" binding:"required"`
	Language string `json:"language" binding:"required,oneof=go"`
}

// CompilerResponse is the DTO returned by the compiler.
type CompilerResponse struct {
	Verdict       Verdict `json:"verdict"`
	Output        string  `json:"output"`
	Error         string  `json:"error_message"`
	ExecutionTime float64 `json:"execution_time"`
	MemoryUsed    int     `json:"memory_used"`
	TestCasesPassed int   `json:"test_cases_passed"`
	TotalTestCases int    `json:"total_test_cases"`
}

// RunResponse is returned when running against sample cases.
type RunResponse struct {
	Output        string  `json:"output"`
	CompilationError string `json:"compilation_error,omitempty"`
	RuntimeError  string  `json:"runtime_error,omitempty"`
	ExecutionTime float64 `json:"execution_time"`
}

// ==================== Leaderboard ====================

// Leaderboard stores aggregated scoring for each candidate.
type Leaderboard struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	User             User      `gorm:"foreignKey:UserID" json:"-"`
	Score            int       `gorm:"default:0" json:"score"`
	ProblemsSolved   int       `gorm:"default:0" json:"problems_solved"`
	TotalSubmissions int       `gorm:"default:0" json:"total_submissions"`
	TotalTime        float64   `gorm:"default:0" json:"total_time"` // cumulative execution time
	LastSubmissionAt time.Time `json:"last_submission_at"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// LeaderboardEntry is the DTO for a single leaderboard row.
type LeaderboardEntry struct {
	Rank             int       `json:"rank"`
	UserID           uint      `json:"user_id"`
	Name             string    `json:"name"`
	Score            int       `json:"score"`
	ProblemsSolved   int       `json:"problems_solved"`
	TotalSubmissions int       `json:"total_submissions"`
	TotalTime        float64   `json:"total_time"`
	LastSubmissionAt time.Time `json:"last_submission_at"`
}
