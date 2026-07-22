// Package config handles application configuration loaded from environment variables.
package config

import (
	"os"
	"strconv"
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
	return &Config{
		ServerPort:       getEnv("SERVER_PORT", "8080"),
		AppEnv:           getEnv("APP_ENV", "development"),
		DBHost:           getEnv("DB_HOST", "localhost"),
		DBPort:           getEnv("DB_PORT", "5432"),
		DBUser:           getEnv("DB_USER", "postgres"),
		DBPassword:       getEnv("DB_PASSWORD", ""),
		DBName:           getEnv("DB_NAME", "assessment_db"),
		DBSSLMode:        getEnv("DB_SSLMODE", "disable"),
		JWTSecret:        getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiry:        getDurationEnv("JWT_EXPIRY_HOURS", 24),
		AdminJWTSecret:   getEnv("ADMIN_JWT_SECRET", "admin-secret-key-change-in-production"),
		AdminJWTExpiry:   getDurationEnv("ADMIN_JWT_EXPIRY_HOURS", 12),
		CompilerTimeout:  getDurationEnv("COMPILER_TIMEOUT_SECONDS", 5),
		MaxCodeSize:      getIntEnv("MAX_CODE_SIZE_KB", 100) * 1024,
		TempDir:          getEnv("TEMP_DIR", os.TempDir()),
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
