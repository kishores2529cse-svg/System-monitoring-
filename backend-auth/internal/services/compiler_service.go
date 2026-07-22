package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"time"

	"backend-auth/internal/config"
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// CompilerService handles code compilation and execution.
type CompilerService struct {
	problemRepo    *repositories.ProblemRepo
	submissionRepo *repositories.SubmissionRepo
	cfg            *config.Config
}

// NewCompilerService creates a new CompilerService.
func NewCompilerService(
	problemRepo *repositories.ProblemRepo,
	submissionRepo *repositories.SubmissionRepo,
	cfg *config.Config,
) *CompilerService {
	return &CompilerService{
		problemRepo:    problemRepo,
		submissionRepo: submissionRepo,
		cfg:            cfg,
	}
}

// RunCode executes the user's code against sample test cases and returns output.
func (s *CompilerService) RunCode(userID uint, req models.RunRequest) (*models.RunResponse, error) {
	if len(req.Code) > s.cfg.MaxCodeSize {
		return nil, errors.New("code size exceeds the limit")
	}

	sampleCases, err := s.problemRepo.GetTestCasesByProblemID(req.ProblemID, models.TestCaseTypeSample)
	if err != nil {
		return nil, errors.New("failed to fetch test cases")
	}

	startTime := time.Now()
	output, compilationErr, runtimeErr := s.executeCode(req.Code, req.Language, sampleCases, s.cfg.CompilerTimeout)
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
	if len(req.Code) > s.cfg.MaxCodeSize {
		return nil, errors.New("code size exceeds the limit")
	}

	allCases, err := s.problemRepo.GetAllTestCasesByProblemID(problemID)
	if err != nil || len(allCases) == 0 {
		allCases, err = s.problemRepo.GetTestCasesByProblemID(problemID, models.TestCaseTypeSample)
		if err != nil {
			return nil, errors.New("failed to fetch test cases")
		}
	}

	totalCases := len(allCases)
	if totalCases == 0 {
		return nil, errors.New("no test cases available for this problem")
	}

	passed := 0
	var lastOutput, lastError string
	var totalTime float64

	for _, tc := range allCases {
		startTime := time.Now()
		output, compErr, runErr := s.executeCode(req.Code, req.Language, []models.TestCase{tc}, s.cfg.CompilerTimeout)
		execTime := time.Since(startTime).Seconds()
		totalTime += execTime

		if compErr != "" {
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
				Verdict:         models.VerdictCompilationError,
				Error:           compErr,
				ExecutionTime:   execTime,
				TestCasesPassed: 0,
				TotalTestCases:  totalCases,
			}, nil
		}

		if runErr != "" {
			lastError = runErr
			continue
		}

		if strings.TrimSpace(output) == strings.TrimSpace(tc.Expected) {
			passed++
		}
		lastOutput = output
	}

	verdict := models.VerdictWrongAnswer
	if passed == totalCases {
		verdict = models.VerdictAccepted
	} else if lastError != "" {
		verdict = models.VerdictRuntimeError
	}

	score := 0
	if verdict == models.VerdictAccepted {
		score = 100
	}

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

// executeCode routes code compilation and execution based on language.
func (s *CompilerService) executeCode(code string, language string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	lang := strings.ToLower(strings.TrimSpace(language))
	switch lang {
	case "go":
		return s.executeGoCode(code, testCases, timeout)
	case "python", "py":
		return s.executePythonCode(code, testCases, timeout)
	case "javascript", "js":
		return s.executeNodeCode(code, ".js", testCases, timeout)
	case "typescript", "ts":
		return s.executeNodeCode(code, ".ts", testCases, timeout)
	case "java":
		return s.executeJavaCode(code, testCases, timeout)
	case "cpp", "c++":
		return s.executeCppCode(code, testCases, timeout)
	case "rust":
		return s.executeRustCode(code, testCases, timeout)
	default:
		return "", "", fmt.Sprintf("Unsupported language runtime: %s", language)
	}
}

// executeGoCode writes source code to a temp file, compiles, and runs it.
func (s *CompilerService) executeGoCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-go-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	srcFile := filepath.Join(tmpDir, "main.go")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	binName := "program"
	if runtime.GOOS == "windows" {
		binName = "program.exe"
	}
	binPath := filepath.Join(tmpDir, binName)

	buildCmd := exec.CommandContext(ctx, "go", "build", "-o", binPath, srcFile)
	buildOutput, err := buildCmd.CombinedOutput()
	if err != nil {
		return "", fmt.Sprintf("compilation error:\n%s", string(buildOutput)), ""
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	runCtx, runCancel := context.WithTimeout(context.Background(), timeout)
	defer runCancel()

	runCmd := exec.CommandContext(runCtx, binPath)
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

// executePythonCode executes python script.
func (s *CompilerService) executePythonCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-py-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	srcFile := filepath.Join(tmpDir, "solution.py")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	cmdName := "python3"
	if runtime.GOOS == "windows" {
		cmdName = "py"
		if _, err := exec.LookPath("py"); err != nil {
			cmdName = "python"
		}
	} else {
		if _, err := exec.LookPath("python3"); err != nil {
			cmdName = "python"
		}
	}

	runCmd := exec.CommandContext(ctx, cmdName, srcFile)
	runCmd.Stdin = strings.NewReader(combinedInput.String())

	var stdout, stderr strings.Builder
	runCmd.Stdout = &stdout
	runCmd.Stderr = &stderr

	if err := runCmd.Run(); err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return "", "", "time limit exceeded"
		}
		return "", "", fmt.Sprintf("runtime error:\n%s", stderr.String())
	}

	return strings.TrimSpace(stdout.String()), "", ""
}

// executeNodeCode runs javascript or typescript code via node.
func (s *CompilerService) executeNodeCode(code string, ext string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-node-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	srcFile := filepath.Join(tmpDir, "solution"+ext)
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	runCmd := exec.CommandContext(ctx, "node", srcFile)
	runCmd.Stdin = strings.NewReader(combinedInput.String())

	var stdout, stderr strings.Builder
	runCmd.Stdout = &stdout
	runCmd.Stderr = &stderr

	if err := runCmd.Run(); err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return "", "", "time limit exceeded"
		}
		return "", "", fmt.Sprintf("runtime error:\n%s", stderr.String())
	}

	return strings.TrimSpace(stdout.String()), "", ""
}

// executeJavaCode compiles and runs Java class.
func (s *CompilerService) executeJavaCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-java-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	className := "Main"
	importRx := regexp.MustCompile(`(?:public\s+)?class\s+(\w+)`)
	matches := importRx.FindStringSubmatch(code)
	if len(matches) > 1 {
		className = matches[1]
	}

	srcFile := filepath.Join(tmpDir, className+".java")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	compileCmd := exec.CommandContext(ctx, "javac", srcFile)
	compileOutput, err := compileCmd.CombinedOutput()
	if err != nil {
		return "", fmt.Sprintf("compilation error:\n%s", string(compileOutput)), ""
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	runCtx, runCancel := context.WithTimeout(context.Background(), timeout)
	defer runCancel()

	runCmd := exec.CommandContext(runCtx, "java", "-cp", tmpDir, className)
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

// executeCppCode compiles and runs C++ code.
func (s *CompilerService) executeCppCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-cpp-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	srcFile := filepath.Join(tmpDir, "solution.cpp")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	binName := "program"
	if runtime.GOOS == "windows" {
		binName = "program.exe"
	}
	binPath := filepath.Join(tmpDir, binName)

	compileCmd := exec.CommandContext(ctx, "g++", "-O3", srcFile, "-o", binPath)
	compileOutput, err := compileCmd.CombinedOutput()
	if err != nil {
		return "", fmt.Sprintf("compilation error:\n%s", string(compileOutput)), ""
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	runCtx, runCancel := context.WithTimeout(context.Background(), timeout)
	defer runCancel()

	runCmd := exec.CommandContext(runCtx, binPath)
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

// executeRustCode compiles and runs Rust code.
func (s *CompilerService) executeRustCode(code string, testCases []models.TestCase, timeout time.Duration) (string, string, string) {
	tmpDir, err := os.MkdirTemp(s.cfg.TempDir, "compiler-rust-*")
	if err != nil {
		return "", "", "failed to create temp directory"
	}
	defer os.RemoveAll(tmpDir)

	srcFile := filepath.Join(tmpDir, "solution.rs")
	if err := os.WriteFile(srcFile, []byte(code), 0644); err != nil {
		return "", "", "failed to write source file"
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	binName := "program"
	if runtime.GOOS == "windows" {
		binName = "program.exe"
	}
	binPath := filepath.Join(tmpDir, binName)

	compileCmd := exec.CommandContext(ctx, "rustc", srcFile, "-o", binPath)
	compileOutput, err := compileCmd.CombinedOutput()
	if err != nil {
		return "", fmt.Sprintf("compilation error:\n%s", string(compileOutput)), ""
	}

	var combinedInput strings.Builder
	for _, tc := range testCases {
		combinedInput.WriteString(tc.Input)
		combinedInput.WriteString("\n")
	}

	runCtx, runCancel := context.WithTimeout(context.Background(), timeout)
	defer runCancel()

	runCmd := exec.CommandContext(runCtx, binPath)
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
