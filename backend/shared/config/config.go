package config

import (
	"os"
	"strconv"
	"strings"
	"sync"
)

// AppConfig contains centralized configuration settings.
type AppConfig struct {
	Env                   string
	Port                  string
	DatabaseURL           string
	RedisURL              string
	StorageProvider       string
	StorageBucket         string
	AIProvider            string
	OpenAIAPIKey          string
	VectorDBProvider      string
	LogLevel              string
	RateLimitGlobalMax    int
	RateLimitUserMax      int
	EnableFeatureFlagRAG  bool
	EnableFeatureFlagSync bool
	EnableFeatureFlagAI   bool
	mu                    sync.RWMutex
}

var globalConfig *AppConfig
var configOnce sync.Once

// LoadConfig initializes AppConfig from environment variables.
func LoadConfig() *AppConfig {
	configOnce.Do(func() {
		globalConfig = &AppConfig{
			Env:                   getEnv("APP_ENV", "production"),
			Port:                  getEnv("PORT", "8080"),
			DatabaseURL:           getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/declutr?sslmode=disable"),
			RedisURL:              getEnv("REDIS_URL", "localhost:6379"),
			StorageProvider:       getEnv("STORAGE_PROVIDER", "local"),
			StorageBucket:         getEnv("STORAGE_BUCKET", "declutr-vault"),
			AIProvider:            getEnv("AI_PROVIDER", "openai"),
			OpenAIAPIKey:          getEnv("OPENAI_API_KEY", ""),
			VectorDBProvider:      getEnv("VECTOR_DB_PROVIDER", "pgvector"),
			LogLevel:              getEnv("LOG_LEVEL", "INFO"),
			RateLimitGlobalMax:    getEnvInt("RATE_LIMIT_GLOBAL_MAX", 10000),
			RateLimitUserMax:      getEnvInt("RATE_LIMIT_USER_MAX", 300),
			EnableFeatureFlagRAG:  getEnvBool("FEATURE_RAG_ENABLED", true),
			EnableFeatureFlagSync: getEnvBool("FEATURE_SYNC_ENABLED", true),
			EnableFeatureFlagAI:   getEnvBool("FEATURE_AI_ENABLED", true),
		}
	})
	return globalConfig
}

// Get returns global AppConfig.
func Get() *AppConfig {
	if globalConfig == nil {
		return LoadConfig()
	}
	return globalConfig
}

func getEnv(key, defaultVal string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	return val
}

func getEnvInt(key string, defaultVal int) int {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		return defaultVal
	}
	return val
}

func getEnvBool(key string, defaultVal bool) bool {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	valStr = strings.ToLower(valStr)
	return valStr == "true" || valStr == "1"
}

// IsFeatureEnabled checks runtime feature flags.
func (c *AppConfig) IsFeatureEnabled(flagName string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	switch strings.ToLower(flagName) {
	case "rag":
		return c.EnableFeatureFlagRAG
	case "sync":
		return c.EnableFeatureFlagSync
	case "ai":
		return c.EnableFeatureFlagAI
	default:
		return true
	}
}
