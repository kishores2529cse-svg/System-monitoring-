package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"backend-auth/internal/config"
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// CompilerService handles code compilation and execution.
type CompilerService struct {
	problemRepo   *repositories.ProblemRepo
	submissionRepo *repositories.SubmissionRepo
	cfg           *config.Config
}

// NewCompilerService creates a new CompilerService.
func NewCompilerService(
	problemRepo *repositories.ProblemRepo,
	submissionRepo *repositories.SubmissionRepo,
	cfg *config.Config,
) *CompilerService {
	return &CompilerService{
		problemRepo:   problemRepo,
		submissionRepo: submissionRepo,
		cfg:           cfg,
	}
}

// RunCode executes the user's Go code against sample test cases and returns output.
func (s *CompilerService) RunCode(userID uint, req models.RunRequest) (*models.RunResponse, error) {
	// Validate code size
	if len(req.Code) > s.cfg.MaxCodeSize {
		return nil, errors.New("code size exceeds the limit")
	}

	// Get sample test cases for the specified problem
	sampleCases, err := s.problemRepo.GetTestCasesByProblemID(req.ProblemID, models.TestCaseTypeSample)
	if err != nil {
		return nil, errors.New("failed to fetch test cases")
	}

	// Execute code against sample cases
	startTime := time.Now()
	output, compilationErr, runtimeErr := s.executeGoCode(req.Code, sampleCases, s.cfg.CompilerTimeout)
	execTime := time.Since(startTime).Seconds()

	if compilationErr != "" {
		return &models.RunResponse{
			CompilationError: compilationErr,
			ExecutionTime:    execTime,
		}, nil
	}

	if runtimeErr != "" {
		return &models.RunResponse{
			RuntimeError:  runtimeErr,
			ExecutionTime: execTime,
		}, nil
	}

	return &models.RunResponse{
		Output:        output,
		ExecutionTime: execTime,
	}, nil
}

// SubmitCode evaluates user code against all test cases and records the submission.
func (s *CompilerService) SubmitCode(userID, problemID uint, req models.SubmitRequest) (*models.CompilerResponse, error) {
	// Validate code size
	if len(req.Code) > s.cfg.MaxCodeSize {
		return nil, errors.New("code size exceeds the limit")
	}

	// Fetch all test cases for the problem
	allCases, err := s.problemRepo.GetAllTestCasesByProblemID(problemID)
	if err != nil || len(allCases) == 0 {
		// Fallback to sample cases
		allCases, err = s.problemRepo.GetTestCasesByProblemID(problemID, models.TestCaseTypeSample)
		if err != nil {
			return nil, errors.New("failed to fetch test cases")
		}
	}

	totalCases := len(allCases)
	if totalCases == 0 {
		return nil, errors.New("no test cases available for this problem")
	}

	// Execute against each test case
	passed := 0
	var lastOutput, lastError string
	var totalTime float64

	for _, tc := range allCases {
		startTime := time.Now()
		output, compErr, runErr := s.executeGoCode(req.Code, []models.TestCase{tc}, s.cfg.CompilerTimeout)
		execTime := time.Since(startTime).Seconds()
		totalTime += execTime

		if compErr != "" {
			// Save failed submission
			sub := &models.Submission{
				UserID:    userID,
				ProblemID: problemID,
				Code:      req.Code,
				Language:  req.Language,
				Verdict:   models.VerdictCompilationError,
				ErrorMsg:  compErr,
				ExecTime:  execTime,
			}
			s.submissionRepo.Create(sub)

			return &models.CompilerResponse{
				Verdict:        models.VerdictCompilationError,
				Error:          compErr,
				ExecutionTime:  execTime,
				TestCasesPassed: 0,
				TotalTestCases: totalCases,
			}, nil
		}

		if runErr != "" {
			lastError = runErr
			continue
		}

		// Trim whitespace for comparison
		if strings.TrimSpace(output) == strings.TrimSpace(tc.Expected) {
			passed++
		}
		lastOutput = output
	}

	// Determine verdict
	verdict := models.VerdictWrongAnswer
	if passed == totalCases {
		verdict = models.VerdictAccepted
	} else if lastError != "" {
		verdict = models.VerdictRuntimeError
	}

	// Calculate score (proportional to cases passed)
	score := 0
	if verdict == models.VerdictAccepted {
		score = 100 // full score for accepted
	}

	// Record submission
	submission := &models.Submission{
		UserID:    userID,
		ProblemID: problemID,
		Code:      req.Code,
		Language:  req.Language,
		Verdict:   verdict,
		Output:    lastOutput,
		ErrorMsg:  lastError,
		ExecTime:  totalTime,
		Score:     score,
	}
	if err := s.submissionRepo.Create(submission); err != nil {
		return nil, errors.New("failed to record submission")
	}

	return &models.CompilerResponse{
		Verdict:         verdict,
		Output:          lastOutput,
		Error:           lastError,
		ExecutionTime:   totalTime,
		TestCasesPassed: passed,
		TotalTestCases:  totalCases,
	}, nil
}

// executeGoCode writes the source code to a temp file, compiles, and runs it.
// Returns (output, compilationError, runtimeError).
func (s *CompilerService) executeGoCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	// Create temporary directory for compilation
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	// Write user code to a file
	srcFile := filepath.Join(tmpDir, "main.go")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	// Build the Go binary
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	buildCmd := exec.CommandContext(ctx, "go", "build", "-o", filepath.Join(tmpDir, "program.exe"), srcFile)
	buildOutput, err := buildCmd.CombinedOutput()
	if err != nil {
		return "", fmt.Sprintf("compilation error:\n%s", string(buildOutput)), ""
	}

	// Combine all test case inputs
	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	// Run the compiled binary with combined input
	runCtx, runCancel := context.WithTimeout(context.Background(), timeout)
	defer runCancel()

	runCmd := exec.CommandContext(runCtx, filepath.Join(tmpDir, "program.exe"))
	runCmd.Stdin = strings.NewReader(combinedInput.String())

	var stdout, stderr strings.Builder
	runCmd.Stdout = &stdout
	runCmd.Stderr = &stderr

	if err := runCmd.Run(); err != nil {
		if runCtx.Err() == context.DeadlineExceeded {
			return "", "", "time limit exceeded"
		}
		return "", "", fmt.Sprintf("runtime error:\n%s", stderr.String())
	}

	return strings.TrimSpace(stdout.String()), "", ""
}
