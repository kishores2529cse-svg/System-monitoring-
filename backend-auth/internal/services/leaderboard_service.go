package services

import (
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// LeaderboardService handles leaderboard ranking and updates.
type LeaderboardService struct {
	leaderboardRepo *repositories.LeaderboardRepo
	submissionRepo  *repositories.SubmissionRepo
	userRepo        *repositories.UserRepo
}

// NewLeaderboardService creates a new LeaderboardService.
func NewLeaderboardService(
	leaderboardRepo *repositories.LeaderboardRepo,
	submissionRepo *repositories.SubmissionRepo,
	userRepo *repositories.UserRepo,
) *LeaderboardService {
	return &LeaderboardService{
		leaderboardRepo: leaderboardRepo,
		submissionRepo:  submissionRepo,
		userRepo:        userRepo,
	}
}

// GetLeaderboard returns the top performers with rank information.
func (s *LeaderboardService) GetLeaderboard(limit int) ([]models.LeaderboardEntry, error) {
	if limit <= 0 {
		limit = 50 // default top 50
	}

	entries, err := s.leaderboardRepo.GetTopPerformers(limit)
	if err != nil {
		return nil, err
	}

	var result []models.LeaderboardEntry
	for i, entry := range entries {
		result = append(result, models.LeaderboardEntry{
			Rank:             i + 1,
			UserID:           entry.UserID,
			Name:             entry.User.Name,
			Score:            entry.Score,
			ProblemsSolved:   entry.ProblemsSolved,
			TotalSubmissions: entry.TotalSubmissions,
			TotalTime:        entry.TotalTime,
			LastSubmissionAt: entry.LastSubmissionAt,
		})
	}

	return result, nil
}

// UpdateLeaderboard refreshes the leaderboard entry after a submission.
func (s *LeaderboardService) UpdateLeaderboard(userID uint, submission *models.Submission) error {
	scoreDelta := 0
	if submission.Verdict == models.VerdictAccepted {
		scoreDelta = submission.Score
	}

	problemsSolvedDelta := 0
	if submission.Verdict == models.VerdictAccepted {
		// Check if this is the first accepted submission for this problem
		accepted, err := s.submissionRepo.FindAcceptedByUserAndProblem(userID, submission.ProblemID)
		if err == nil && len(accepted) <= 1 {
			problemsSolvedDelta = 1 // first time solving this problem
		}
	}

	entry, err := s.leaderboardRepo.FindByUserID(userID)
	if err != nil {
		// Create new entry
		entry = &models.Leaderboard{
			UserID:           userID,
			Score:            scoreDelta,
			ProblemsSolved:   problemsSolvedDelta,
			TotalSubmissions: 1,
			TotalTime:        submission.ExecTime,
			LastSubmissionAt: submission.CreatedAt,
		}
		return s.leaderboardRepo.Create(entry)
	}

	// Update existing entry
	entry.Score += scoreDelta
	entry.ProblemsSolved += problemsSolvedDelta
	entry.TotalSubmissions++
	entry.TotalTime += submission.ExecTime
	entry.LastSubmissionAt = submission.CreatedAt

	return s.leaderboardRepo.Update(entry)
}
