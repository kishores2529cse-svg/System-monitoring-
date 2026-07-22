package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port                   string
	DBDriver               string
	DBSource               string
	JWTSecret              string
	WarningLimit           int
	OfflineThresholdSec    int
}

func LoadConfig() *Config {
	port := getEnv("PORT", "8080")
	dbDriver := getEnv("DB_DRIVER", "sqlite")
	dbSource := getEnv("DB_SOURCE", "anticheating.db")
	jwtSecret := getEnv("JWT_SECRET", "super-secret-assessment-key")
	
	warningLimitStr := getEnv("WARNING_LIMIT", "3")
	warningLimit, err := strconv.Atoi(warningLimitStr)
	if err != nil {
		warningLimit = 3
	}

	offlineThresholdSecStr := getEnv("OFFLINE_THRESHOLD_SECONDS", "15")
	offlineThresholdSec, err := strconv.Atoi(offlineThresholdSecStr)
	if err != nil {
		offlineThresholdSec = 15
	}

	return &Config{
		Port:                port,
		DBDriver:            dbDriver,
		DBSource:            dbSource,
		JWTSecret:           jwtSecret,
		WarningLimit:        warningLimit,
		OfflineThresholdSec: offlineThresholdSec,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
