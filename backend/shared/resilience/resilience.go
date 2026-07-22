package resilience

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/diablovocado/declutr/shared/observability"
)

// CircuitState represents Circuit Breaker state.
type CircuitState string

const (
	StateClosed   CircuitState = "CLOSED"
	StateHalfOpen CircuitState = "HALF_OPEN"
	StateOpen     CircuitState = "OPEN"
)

// CircuitBreaker prevents cascading failures by halting calls to unstable external services.
type CircuitBreaker struct {
	mu           sync.Mutex
	name         string
	state        CircuitState
	failures     int
	threshold    int
	resetTimeout time.Duration
	lastStateChange time.Time
}

var circuitRegistry = make(map[string]*CircuitBreaker)
var registryMu sync.Mutex

// GetCircuitBreaker returns or creates a named circuit breaker.
func GetCircuitBreaker(name string, failureThreshold int, resetTimeout time.Duration) *CircuitBreaker {
	registryMu.Lock()
	defer registryMu.Unlock()

	cb, exists := circuitRegistry[name]
	if !exists {
		cb = &CircuitBreaker{
			name:         name,
			state:        StateClosed,
			threshold:    failureThreshold,
			resetTimeout: resetTimeout,
			lastStateChange: time.Now().UTC(),
		}
		circuitRegistry[name] = cb
	}
	return cb
}

// Execute runs a function guarded by the circuit breaker.
func (cb *CircuitBreaker) Execute(fn func() error) error {
	cb.mu.Lock()
	now := time.Now().UTC()

	if cb.state == StateOpen {
		if now.Sub(cb.lastStateChange) > cb.resetTimeout {
			cb.state = StateHalfOpen
			cb.lastStateChange = now
		} else {
			cb.mu.Unlock()
			return fmt.Errorf("circuit breaker %s is OPEN (service unavailable)", cb.name)
		}
	}
	cb.mu.Unlock()

	err := fn()

	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil {
		cb.failures++
		if cb.state == StateHalfOpen || cb.failures >= cb.threshold {
			cb.state = StateOpen
			cb.lastStateChange = time.Now().UTC()
			observability.GetLogger().Error(context.Background(), fmt.Sprintf("Circuit Breaker %s tripped to OPEN", cb.name), "CIRCUIT_OPEN", nil)
		}
		return err
	}

	if cb.state == StateHalfOpen {
		cb.state = StateClosed
		cb.failures = 0
		cb.lastStateChange = time.Now().UTC()
	}
	return nil
}

// RetryPolicy defines retry options.
type RetryPolicy struct {
	MaxAttempts int
	InitialBackoff time.Duration
	MaxBackoff     time.Duration
}

// ExecuteWithRetry retries a function with exponential backoff.
func ExecuteWithRetry(ctx context.Context, policy RetryPolicy, fn func() error) error {
	var lastErr error
	backoff := policy.InitialBackoff

	for attempt := 1; attempt <= policy.MaxAttempts; attempt++ {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		err := fn()
		if err == nil {
			return nil
		}
		lastErr = err

		if attempt == policy.MaxAttempts {
			break
		}

		time.Sleep(backoff)
		backoff *= 2
		if backoff > policy.MaxBackoff {
			backoff = policy.MaxBackoff
		}
	}
	return fmt.Errorf("failed after %d attempts: %w", policy.MaxAttempts, lastErr)
}

// GracefulShutdown listens for OS signals (SIGINT, SIGTERM) and shuts down HTTP server safely.
func GracefulShutdown(server *http.Server, timeout time.Duration) {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop
	observability.GetLogger().Info(context.Background(), "Shutting down HTTP server gracefully...", nil)

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		observability.GetLogger().Error(context.Background(), "Server forced shutdown", "SHUTDOWN_ERROR", map[string]interface{}{"error": err.Error()})
	} else {
		observability.GetLogger().Info(context.Background(), "Server shutdown complete", nil)
	}
}

// SystemError provides a standard structured API error model.
type SystemError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"status"`
}

func (e *SystemError) Error() string {
	return e.Message
}

var (
	ErrNotFound         = &SystemError{Code: "NOT_FOUND", Message: "Requested resource not found", Status: http.StatusNotFound}
	ErrUnauthorized     = &SystemError{Code: "UNAUTHORIZED", Message: "Authentication required", Status: http.StatusUnauthorized}
	ErrForbidden        = &SystemError{Code: "FORBIDDEN", Message: "Access denied", Status: http.StatusForbidden}
	ErrRateLimited      = &SystemError{Code: "RATE_LIMITED", Message: "Too many requests", Status: http.StatusTooManyRequests}
	ErrInternalError    = &SystemError{Code: "INTERNAL_ERROR", Message: "Internal system error", Status: http.StatusInternalServerError}
	ErrServiceUnavailable = &SystemError{Code: "SERVICE_UNAVAILABLE", Message: "Service temporarily unavailable", Status: http.StatusServiceUnavailable}
)

// HandleError returns a JSON response for a SystemError or standard error.
func HandleError(w http.ResponseWriter, r *http.Request, err error) {
	w.Header().Set("Content-Type", "application/json")
	var sysErr *SystemError
	if errors.As(err, &sysErr) {
		w.WriteHeader(sysErr.Status)
		_ = sysErr
	} else {
		sysErr = ErrInternalError
		w.WriteHeader(http.StatusInternalServerError)
	}
	fmt.Fprintf(w, `{"error":{"code":"%s","message":"%s"}}`, sysErr.Code, sysErr.Message)
}
