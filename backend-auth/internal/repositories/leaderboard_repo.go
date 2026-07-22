package repositories

import (
	"backend-auth/internal/models"

	"gorm.io/gorm"
)

// LeaderboardRepo provides CRUD and ranking operations for Leaderboard.
type LeaderboardRepo struct {
	db *gorm.DB
}

// NewLeaderboardRepo creates a new LeaderboardRepo instance.
func NewLeaderboardRepo(db *gorm.DB) *LeaderboardRepo {
	return &LeaderboardRepo{db: db}
}

// FindByUserID retrieves the leaderboard entry for a specific user.
func (r *LeaderboardRepo) FindByUserID(userID uint) (*models.Leaderboard, error) {
	var entry models.Leaderboard
	err := r.db.Where("user_id = ?", userID).First(&entry).Error
	return &entry, err
}

// Create inserts a new leaderboard entry.
func (r *LeaderboardRepo) Create(entry *models.Leaderboard) error {
	return r.db.Create(entry).Error
}

// Update modifies a leaderboard entry.
func (r *LeaderboardRepo) Update(entry *models.Leaderboard) error {
	return r.db.Save(entry).Error
}

// GetTopPerformers retrieves the top N performers sorted by score, problems solved, and time.
func (r *LeaderboardRepo) GetTopPerformers(limit int) ([]models.Leaderboard, error) {
	var entries []models.Leaderboard
	err := r.db.Joins("User").
		Order("score DESC, problems_solved DESC, total_time ASC").
		Limit(limit).
		Find(&entries).Error
	return entries, err
}

// UpsertLeaderboard creates or updates a leaderboard entry for the user.
func (r *LeaderboardRepo) UpsertLeaderboard(userID uint, scoreDelta, problemsSolvedDelta int, execTime float64) error {
	var entry models.Leaderboard
	err := r.db.Where("user_id = ?", userID).First(&entry).Error

	if err == gorm.ErrRecordNotFound {
		// Create new entry
		entry = models.Leaderboard{
			UserID:           userID,
			Score:            scoreDelta,
			ProblemsSolved:   problemsSolvedDelta,
			TotalSubmissions: 1,
			TotalTime:        execTime,
			LastSubmissionAt: models.Submission{}.CreatedAt, // will be set by caller
		}
		return r.db.Create(&entry).Error
	}

	if err != nil {
		return err
	}

	// Update existing entry
	entry.Score += scoreDelta
	entry.ProblemsSolved += problemsSolvedDelta
	entry.TotalSubmissions++
	entry.TotalTime += execTime
	return r.db.Save(&entry).Error
}
