package utils

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"log"
)

type contextKey string

const (
	RequestIDKey     contextKey = "request_id"
	CorrelationIDKey contextKey = "correlation_id"
	VaultIDKey       contextKey = "vault_id"
)

type Logger struct{}

func (l *Logger) Info(ctx context.Context, msg string, fields map[string]interface{}) {
	log.Printf("[INFO] %s: %v", msg, fields)
}

func (l *Logger) Error(ctx context.Context, msg string, fields map[string]interface{}) {
	log.Printf("[ERROR] %s: %v", msg, fields)
}

type Span struct{}

type Tracer struct{}

func (t *Tracer) StartSpan(ctx context.Context, name string) (context.Context, *Span) {
	return ctx, &Span{}
}

func (t *Tracer) EndSpan(s *Span) {}

type MetricsRegistry struct{}

func (m *MetricsRegistry) RecordRequest(statusCode int, latencyMs int64) {}

var (
	defaultLogger   = &Logger{}
	defaultTracer   = &Tracer{}
	defaultMetrics  = &MetricsRegistry{}
)

func GetLogger() *Logger {
	return defaultLogger
}

func GetTracer() *Tracer {
	return defaultTracer
}

func GetMetricsRegistry() *MetricsRegistry {
	return defaultMetrics
}

func GenerateID(length int) string {
	b := make([]byte, length/2+1)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)[:length]
}
