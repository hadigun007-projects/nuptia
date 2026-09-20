package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	GinMode        string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	DBSSLMode      string
	AllowedOrigins []string
}

func LoadConfig() (*Config, error) {
	// Attempt to load .env, but ignore error if not found (e.g., in production / docker)
	_ = godotenv.Load()

	port := getEnv("PORT", "5000")
	ginMode := getEnv("GIN_MODE", "debug")
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "hadiyahku")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "nuptia_db")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	originsRaw := getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
	origins := strings.Split(originsRaw, ",")
	for i := range origins {
		origins[i] = strings.TrimSpace(origins[i])
	}

	return &Config{
		Port:           port,
		GinMode:        ginMode,
		DBHost:         dbHost,
		DBPort:         dbPort,
		DBUser:         dbUser,
		DBPassword:     dbPassword,
		DBName:         dbName,
		DBSSLMode:      dbSSLMode,
		AllowedOrigins: origins,
	}, nil
}

func (c *Config) DSN() string {
	if c.DBPassword == "" {
		return fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=%s",
			c.DBHost, c.DBPort, c.DBUser, c.DBName, c.DBSSLMode)
	}
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

func getEnv(key, defaultVal string) string {
	if val, exists := os.LookupEnv(key); exists && val != "" {
		return val
	}
	return defaultVal
}
