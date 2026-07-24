// Package config handles application configuration loaded from environment variables.
package config

import (
	"bufio"
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all application configuration values.
type Config struct {
	// Server settings
	ServerPort string
	AppEnv     string

	// Database settings
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT settings
	JWTSecret        string
	JWTExpiry        time.Duration
	AdminJWTSecret   string
	AdminJWTExpiry   time.Duration

	// Compiler settings
	CompilerTimeout time.Duration
	MaxCodeSize     int
	TempDir         string
}

// Load reads configuration from environment variables and returns a Config struct.
func Load() *Config {
	loadDotEnv(".env")

	return &Config{
		ServerPort:       getEnv("SERVER_PORT", getEnv("PORT", "8080")),
		AppEnv:           getEnv("APP_ENV", "development"),
		DBHost:           getEnv("DB_HOST", "db.wdtshwffstjzfclwsqox.supabase.co"),
		DBPort:           getEnv("DB_PORT", "5432"),
		DBUser:           getEnv("DB_USER", "postgres"),
		DBPassword:       getEnv("DB_PASSWORD", "Kishores@2029"),
		DBName:           getEnv("DB_NAME", "postgres"),
		DBSSLMode:        getEnv("DB_SSLMODE", "require"),
		JWTSecret:        getEnv("JWT_SECRET", "codeshield-user-secret-key-change-in-production-2026"),
		JWTExpiry:        getDurationEnv("JWT_EXPIRY_HOURS", 24),
		AdminJWTSecret:   getEnv("ADMIN_JWT_SECRET", "codeshield-admin-secret-key-change-in-production-2026"),
		AdminJWTExpiry:   getDurationEnv("ADMIN_JWT_EXPIRY_HOURS", 12),
		CompilerTimeout:  getDurationEnv("COMPILER_TIMEOUT_SECONDS", 5),
		MaxCodeSize:      getIntEnv("MAX_CODE_SIZE_KB", 100) * 1024,
		TempDir:          validateTempDir(getEnv("TEMP_DIR", os.TempDir())),
	}
}

func validateTempDir(dir string) string {
	if _, err := os.Stat(dir); err != nil {
		return os.TempDir()
	}
	return dir
}

// loadDotEnv parses a simple .env file into OS environment variables.
func loadDotEnv(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			if os.Getenv(key) == "" {
				os.Setenv(key, val)
			}
		}
	}
}

// getEnv retrieves an environment variable or returns a fallback value.
func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

// getIntEnv retrieves an integer environment variable or returns a fallback.
func getIntEnv(key string, fallback int) int {
	if val, ok := os.LookupEnv(key); ok {
		if intVal, err := strconv.Atoi(val); err == nil {
			return intVal
		}
	}
	return fallback
}

// getDurationEnv retrieves a duration in hours from an environment variable.
func getDurationEnv(key string, fallbackHours int) time.Duration {
	if val, ok := os.LookupEnv(key); ok {
		if hours, err := strconv.Atoi(val); err == nil {
			return time.Duration(hours) * time.Hour
		}
	}
	return time.Duration(fallbackHours) * time.Hour
}
