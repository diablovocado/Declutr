package tests

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/diablovocado/declutr/pkg/health"
	"github.com/diablovocado/declutr/shared/cache"
	"github.com/diablovocado/declutr/shared/middleware"
	"github.com/diablovocado/declutr/shared/observability"
	"github.com/diablovocado/declutr/shared/ratelimit"
	"github.com/diablovocado/declutr/shared/resilience"
	"github.com/diablovocado/declutr/shared/supervisor"
)

func TestStructuredLoggerAndTracing(t *testing.T) {
	logger := observability.InitLogger("test-service", nil)
	ctx := context.Background()

	// Test logging with correlation IDs
	ctx = context.WithValue(ctx, observability.RequestIDKey, "req-1234")
	ctx = context.WithValue(ctx, observability.CorrelationIDKey, "corr-5678")

	logger.Info(ctx, "Testing structured log entry", map[string]interface{}{
		"component": "platform_test",
	})

	// Test distributed tracer
	tracer := observability.GetTracer()
	ctx, span := tracer.StartSpan(ctx, "TestPipelineSpan")
	time.Sleep(10 * time.Millisecond)
	tracer.EndSpan(span)

	if span.Duration < 5 {
		t.Errorf("Expected span duration > 5ms, got %dms", span.Duration)
	}

	spans := tracer.GetSpans()
	if len(spans) == 0 {
		t.Error("Expected recorded spans, got 0")
	}
}

func TestCacheAbstractionLayer(t *testing.T) {
	c := cache.NewInMemoryCache()
	ctx := context.Background()

	err := c.Set(ctx, "test_key", "test_value", 5*time.Second)
	if err != nil {
		t.Fatalf("Failed to set cache: %v", err)
	}

	val, found, err := c.Get(ctx, "test_key")
	if err != nil || !found || val != "test_value" {
		t.Errorf("Cache get mismatch: found=%v, val=%s, err=%v", found, val, err)
	}

	stats, _ := c.Stats(ctx)
	if stats.Hits != 1 {
		t.Errorf("Expected 1 hit, got %d", stats.Hits)
	}
}

func TestRateLimiterPolicies(t *testing.T) {
	limiter := ratelimit.NewLimiter()
	policy := ratelimit.Policy{MaxRequests: 2, Window: 1 * time.Minute}

	key := "test-user-ip"
	if !limiter.Allow(key, policy) {
		t.Error("First request should be allowed")
	}
	if !limiter.Allow(key, policy) {
		t.Error("Second request should be allowed")
	}
	if limiter.Allow(key, policy) {
		t.Error("Third request should be rate-limited (blocked)")
	}
}

func TestWorkerSupervisorPanicRecovery(t *testing.T) {
	sup := supervisor.NewSupervisor()
	ctx := context.Background()

	panicCount := 0
	sup.RegisterWorker("w-panic-test", "Panic Worker Test", "TEST", func(ctx context.Context) error {
		panicCount++
		if panicCount == 1 {
			panic("simulated worker crash")
		}
		return nil
	})

	err := sup.StartWorker(ctx, "w-panic-test")
	if err != nil {
		t.Fatalf("Worker start error: %v", err)
	}

	time.Sleep(100 * time.Millisecond)

	status := sup.GetWorkerStatus()
	found := false
	for _, w := range status {
		if w.ID == "w-panic-test" {
			found = true
			break
		}
	}
	if !found {
		t.Error("Worker not found in supervisor status")
	}
}

func TestCircuitBreaker(t *testing.T) {
	cb := resilience.GetCircuitBreaker("test-ai-provider", 2, 100*time.Millisecond)

	// Trip circuit breaker with 2 failures
	_ = cb.Execute(func() error { return resilience.ErrServiceUnavailable })
	_ = cb.Execute(func() error { return resilience.ErrServiceUnavailable })

	// 3rd call should fail immediately without executing
	executed := false
	err := cb.Execute(func() error {
		executed = true
		return nil
	})

	if executed {
		t.Error("Expected circuit breaker to block execution, but function executed")
	}
	if err == nil {
		t.Error("Expected circuit breaker open error, got nil")
	}
}

func TestHealthAndReadinessEndpoints(t *testing.T) {
	req := httptest.NewRequest("GET", "/health", nil)
	rr := httptest.NewRecorder()

	health.Handler(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status OK, got %d", rr.Code)
	}

	reqReady := httptest.NewRequest("GET", "/ready", nil)
	rrReady := httptest.NewRecorder()

	health.ReadinessHandler(rrReady, reqReady)
	if rrReady.Code != http.StatusOK {
		t.Errorf("Expected status OK for readiness, got %d", rrReady.Code)
	}
}

func TestSecurityHeadersMiddleware(t *testing.T) {
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handlerToTest := middleware.SecurityHeaders(nextHandler)

	req := httptest.NewRequest("GET", "http://example.com/foo", nil)
	rec := httptest.NewRecorder()

	handlerToTest.ServeHTTP(rec, req)

	if rec.Header().Get("X-Frame-Options") != "DENY" {
		t.Errorf("Expected X-Frame-Options DENY, got %s", rec.Header().Get("X-Frame-Options"))
	}
	if rec.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("Expected X-Content-Type-Options nosniff, got %s", rec.Header().Get("X-Content-Type-Options"))
	}
}
