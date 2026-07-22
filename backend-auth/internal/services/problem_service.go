package services

import (
	"errors"

	"backend-auth/internal/models"
	"backend-auth/internal/repositories"

	"gorm.io/gorm"
)

// ProblemService handles problem retrieval operations.
type ProblemService struct {
	problemRepo *repositories.ProblemRepo
}

// NewProblemService creates a new ProblemService.
func NewProblemService(problemRepo *repositories.ProblemRepo) *ProblemService {
	return &ProblemService{problemRepo: problemRepo}
}

// GetAllProblems returns a list of all problems in condensed format.
func (s *ProblemService) GetAllProblems() ([]models.ProblemResponse, error) {
	problems, err := s.problemRepo.GetAll()
	if err != nil {
		return nil, errors.New("failed to fetch problems")
	}

	var responses []models.ProblemResponse
	for _, p := range problems {
		responses = append(responses, models.ProblemResponse{
			ID:         p.ID,
			Title:      p.Title,
			Difficulty: p.Difficulty,
			Tags:       p.Tags,
		})
	}

	return responses, nil
}

// GetProblemByID returns full problem details with sample test cases.
func (s *ProblemService) GetProblemByID(id uint) (*models.ProblemDetailResponse, error) {
	problem, err := s.problemRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("problem not found")
		}
		return nil, errors.New("failed to fetch problem")
	}

	return &models.ProblemDetailResponse{
		ID:           problem.ID,
		Title:        problem.Title,
		Description:  problem.Description,
		Constraints:  problem.Constraints,
		Difficulty:   problem.Difficulty,
		Tags:         problem.Tags,
		SampleInput:  problem.SampleInput,
		SampleOutput: problem.SampleOutput,
		TimeLimit:    problem.TimeLimit,
		MemoryLimit:  problem.MemoryLimit,
	}, nil
}

// GetTestCaseCount returns the total number of test cases for a problem.
func (s *ProblemService) GetTestCaseCount(problemID uint) (int, error) {
	count, err := s.problemRepo.CountTotalTestCases(problemID)
	return int(count), err
}
