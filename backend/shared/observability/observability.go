package observability

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// LogLevel defines severity level for structured logs.
type LogLevel string

const (
	LevelDebug LogLevel = "DEBUG"
	LevelInfo  LogLevel = "INFO"
	LevelWarn  LogLevel = "WARN"
	LevelError LogLevel = "ERROR"
	LevelFatal LogLevel = "FATAL"
)

// Context keys for request tracking.
type contextKey string

const (
	RequestIDKey     contextKey = "request_id"
	CorrelationIDKey contextKey = "correlation_id"
	UserIDKey        contextKey = "user_id"
	VaultIDKey       contextKey = "vault_id"
	SessionIDKey     contextKey = "session_id"
	TraceIDKey       contextKey = "trace_id"
	SpanIDKey        contextKey = "span_id"
)

// LogEntry defines structured log schema.
type LogEntry struct {
	Timestamp     string                 `json:"timestamp"`
	Level         LogLevel               `json:"level"`
	ServiceName   string                 `json:"service_name"`
	Message       string                 `json:"message"`
	RequestID     string                 `json:"request_id,omitempty"`
	CorrelationID string                 `json:"correlation_id,omitempty"`
	UserID        string                 `json:"user_id,omitempty"`
	VaultID       string                 `json:"vault_id,omitempty"`
	SessionID     string                 `json:"session_id,omitempty"`
	TraceID       string                 `json:"trace_id,omitempty"`
	SpanID        string                 `json:"span_id,omitempty"`
	LatencyMs     int64                  `json:"latency_ms,omitempty"`
	StatusCode    int                    `json:"status_code,omitempty"`
	ErrorCode     string                 `json:"error_code,omitempty"`
	Path          string                 `json:"path,omitempty"`
	Method        string                 `json:"method,omitempty"`
	Fields        map[string]interface{} `json:"fields,omitempty"`
}

// Logger is a thread-safe structured logger.
type Logger struct {
	serviceName string
	out         io.Writer
	mu          sync.Mutex
}

var globalLogger *Logger
var once sync.Once

// InitLogger initializes global logger singleton.
func InitLogger(serviceName string, out io.Writer) *Logger {
	if out == nil {
		out = os.Stdout
	}
	once.Do(func() {
		globalLogger = &Logger{
			serviceName: serviceName,
			out:         out,
		}
	})
	return globalLogger
}

// GetLogger returns global logger.
func GetLogger() *Logger {
	if globalLogger == nil {
		return InitLogger("declutr-backend", os.Stdout)
	}
	return globalLogger
}

// sanitizeSecrets removes sensitive data fields before logging.
func sanitizeSecrets(data map[string]interface{}) map[string]interface{} {
	if data == nil {
		return nil
	}
	sanitized := make(map[string]interface{})
	sensitiveKeys := []string{"password", "passphrase", "secret", "token", "authorization", "private_key", "srp_verifier", "srp_salt", "mvk", "key"}

	for k, v := range data {
		lowerK := strings.ToLower(k)
		isSensitive := false
		for _, s := range sensitiveKeys {
			if strings.Contains(lowerK, s) {
				isSensitive = true
				break
			}
		}
		if isSensitive {
			sanitized[k] = "[REDACTED]"
		} else {
			sanitized[k] = v
		}
	}
	return sanitized
}

// Log writes structured log entry.
func (l *Logger) Log(ctx context.Context, level LogLevel, msg string, fields map[string]interface{}) {
	entry := LogEntry{
		Timestamp:   time.Now().UTC().Format(time.RFC3339Nano),
		Level:       level,
		ServiceName: l.serviceName,
		Message:     msg,
		Fields:      sanitizeSecrets(fields),
	}

	if ctx != nil {
		if reqID, ok := ctx.Value(RequestIDKey).(string); ok {
			entry.RequestID = reqID
		}
		if corrID, ok := ctx.Value(CorrelationIDKey).(string); ok {
			entry.CorrelationID = corrID
		}
		if userID, ok := ctx.Value(UserIDKey).(string); ok {
			entry.UserID = userID
		}
		if vaultID, ok := ctx.Value(VaultIDKey).(string); ok {
			entry.VaultID = vaultID
		}
		if sessionID, ok := ctx.Value(SessionIDKey).(string); ok {
			entry.SessionID = sessionID
		}
		if traceID, ok := ctx.Value(TraceIDKey).(string); ok {
			entry.TraceID = traceID
		}
		if spanID, ok := ctx.Value(SpanIDKey).(string); ok {
			entry.SpanID = spanID
		}
	}

	payload, err := json.Marshal(entry)
	if err != nil {
		return
	}

	l.mu.Lock()
	defer l.mu.Unlock()
	fmt.Fprintln(l.out, string(payload))
}

// Info helper.
func (l *Logger) Info(ctx context.Context, msg string, fields map[string]interface{}) {
	l.Log(ctx, LevelInfo, msg, fields)
}

// Error helper.
func (l *Logger) Error(ctx context.Context, msg string, errCode string, fields map[string]interface{}) {
	if fields == nil {
		fields = make(map[string]interface{})
	}
	fields["error_code"] = errCode
	l.Log(ctx, LevelError, msg, fields)
}

// GenerateID produces a random hex string for IDs.
func GenerateID(bytesLen int) string {
	b := make([]byte, bytesLen)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// Span represents a distributed tracing span.
type Span struct {
	TraceID   string    `json:"trace_id"`
	SpanID    string    `json:"span_id"`
	ParentID  string    `json:"parent_id,omitempty"`
	Name      string    `json:"name"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Duration  int64     `json:"duration_ms"`
	Tags      map[string]string `json:"tags,omitempty"`
}

// Tracer manages distributed traces.
type Tracer struct {
	mu     sync.RWMutex
	spans  []Span
}

var globalTracer = &Tracer{spans: make([]Span, 0)}

// GetTracer returns global tracer instance.
func GetTracer() *Tracer {
	return globalTracer
}

// StartSpan creates a new tracing span context.
func (t *Tracer) StartSpan(ctx context.Context, name string) (context.Context, *Span) {
	traceID, ok := ctx.Value(TraceIDKey).(string)
	if !ok || traceID == "" {
		traceID = GenerateID(16)
	}
	parentID, _ := ctx.Value(SpanIDKey).(string)
	spanID := GenerateID(8)

	span := &Span{
		TraceID:   traceID,
		SpanID:    spanID,
		ParentID:  parentID,
		Name:      name,
		StartTime: time.Now().UTC(),
		Tags:      make(map[string]string),
	}

	newCtx := context.WithValue(ctx, TraceIDKey, traceID)
	newCtx = context.WithValue(newCtx, SpanIDKey, spanID)
	return newCtx, span
}

// EndSpan finishes a tracing span.
func (t *Tracer) EndSpan(span *Span) {
	span.EndTime = time.Now().UTC()
	span.Duration = span.EndTime.Sub(span.StartTime).Milliseconds()

	t.mu.Lock()
	defer t.mu.Unlock()
	t.spans = append(t.spans, *span)
	if len(t.spans) > 2000 {
		t.spans = t.spans[len(t.spans)-1000:]
	}
}

// GetSpans returns recorded spans.
func (t *Tracer) GetSpans() []Span {
	t.mu.RLock()
	defer t.mu.RUnlock()
	result := make([]Span, len(t.spans))
	copy(result, t.spans)
	return result
}

// MetricsRegistry holds collected system and application metrics.
type MetricsRegistry struct {
	mu                   sync.RWMutex
	TotalRequests        int64              `json:"total_requests"`
	RequestThroughput    float64            `json:"request_throughput_qps"`
	LatencySumMs         int64              `json:"latency_sum_ms"`
	AverageLatencyMs     float64            `json:"average_latency_ms"`
	StatusCodes          map[int]int64      `json:"status_codes"`
	QueueDepth           int64              `json:"queue_depth"`
	UploadDurationSumMs  int64              `json:"upload_duration_sum_ms"`
	UploadCount          int64              `json:"upload_count"`
	AIPipelineDurationMs int64              `json:"ai_pipeline_duration_sum_ms"`
	AIPipelineCount      int64              `json:"ai_pipeline_count"`
	EmbeddingGenSumMs    int64              `json:"embedding_gen_sum_ms"`
	EmbeddingGenCount    int64              `json:"embedding_gen_count"`
	WorkflowCount        int64              `json:"workflow_count"`
	SearchLatencySumMs   int64              `json:"search_latency_sum_ms"`
	SearchCount          int64              `json:"search_count"`
	DatabaseLatencySumMs int64              `json:"database_latency_sum_ms"`
	DatabaseQueryCount   int64              `json:"database_query_count"`
	CacheHits            int64              `json:"cache_hits"`
	CacheMisses          int64              `json:"cache_misses"`
	CacheHitRate         float64            `json:"cache_hit_rate"`
	StorageUsageBytes    int64              `json:"storage_usage_bytes"`
	MemoryUsageBytes     uint64             `json:"memory_usage_bytes"`
	CPUUsagePercent      float64            `json:"cpu_usage_percent"`
	LastUpdated          time.Time          `json:"last_updated"`
}

var globalMetrics = &MetricsRegistry{
	StatusCodes: make(map[int]int64),
	LastUpdated: time.Now().UTC(),
}

// GetMetricsRegistry returns metrics instance.
func GetMetricsRegistry() *MetricsRegistry {
	return globalMetrics
}

// RecordRequest records HTTP request metrics.
func (m *MetricsRegistry) RecordRequest(statusCode int, latencyMs int64) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.TotalRequests++
	m.LatencySumMs += latencyMs
	m.StatusCodes[statusCode]++
	m.AverageLatencyMs = float64(m.LatencySumMs) / float64(m.TotalRequests)
	m.LastUpdated = time.Now().UTC()
}

// RecordUpload records file upload metrics.
func (m *MetricsRegistry) RecordUpload(durationMs int64, bytesCount int64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.UploadCount++
	m.UploadDurationSumMs += durationMs
	m.StorageUsageBytes += bytesCount
}

// RecordAIPipeline records AI processing duration.
func (m *MetricsRegistry) RecordAIPipeline(durationMs int64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.AIPipelineCount++
	m.AIPipelineDurationMs += durationMs
}

// RecordEmbeddingGen records embedding generation duration.
func (m *MetricsRegistry) RecordEmbeddingGen(durationMs int64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.EmbeddingGenCount++
	m.EmbeddingGenSumMs += durationMs
}

// RecordSearch records search latency.
func (m *MetricsRegistry) RecordSearch(durationMs int64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.SearchCount++
	m.SearchLatencySumMs += durationMs
}

// RecordCacheHitMiss records cache hit or miss.
func (m *MetricsRegistry) RecordCacheHitMiss(hit bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if hit {
		m.CacheHits++
	} else {
		m.CacheMisses++
	}
	total := m.CacheHits + m.CacheMisses
	if total > 0 {
		m.CacheHitRate = float64(m.CacheHits) / float64(total)
	}
}

// Snapshot returns a copy of metrics.
func (m *MetricsRegistry) Snapshot() MetricsRegistry {
	m.mu.RLock()
	defer m.mu.RUnlock()

	scCopy := make(map[int]int64)
	for k, v := range m.StatusCodes {
		scCopy[k] = v
	}

	snap := *m
	snap.StatusCodes = scCopy
	return snap
}

// PrometheusFormat exports metrics in Prometheus text format.
func (m *MetricsRegistry) PrometheusFormat() string {
	snap := m.Snapshot()
	var b strings.Builder

	b.WriteString("# HELP declutr_http_requests_total Total number of HTTP requests processed.\n")
	b.WriteString("# TYPE declutr_http_requests_total counter\n")
	b.WriteString(fmt.Sprintf("declutr_http_requests_total %d\n", snap.TotalRequests))

	b.WriteString("# HELP declutr_http_latency_average_ms Average request latency in milliseconds.\n")
	b.WriteString("# TYPE declutr_http_latency_average_ms gauge\n")
	b.WriteString(fmt.Sprintf("declutr_http_latency_average_ms %.2f\n", snap.AverageLatencyMs))

	b.WriteString("# HELP declutr_cache_hit_rate Cache hit rate percentage (0.0 to 1.0).\n")
	b.WriteString("# TYPE declutr_cache_hit_rate gauge\n")
	b.WriteString(fmt.Sprintf("declutr_cache_hit_rate %.4f\n", snap.CacheHitRate))

	b.WriteString("# HELP declutr_storage_usage_bytes Total storage usage in bytes.\n")
	b.WriteString("# TYPE declutr_storage_usage_bytes gauge\n")
	b.WriteString(fmt.Sprintf("declutr_storage_usage_bytes %d\n", snap.StorageUsageBytes))

	b.WriteString("# HELP declutr_queue_depth Current processing queue depth.\n")
	b.WriteString("# TYPE declutr_queue_depth gauge\n")
	b.WriteString(fmt.Sprintf("declutr_queue_depth %d\n", snap.QueueDepth))

	return b.String()
}
