package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/diablovocado/declutr/utils"
)

// statusResponseWriter wraps http.ResponseWriter to capture status code.
type statusResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *statusResponseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// SecurityHeaders attaches production security response headers.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID, X-Correlation-ID, X-Vault-ID")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RequestObservability injects request ID, correlation ID, trace context, tracks latency, and logs request metrics.
func RequestObservability(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		reqID := r.Header.Get("X-Request-ID")
		if reqID == "" {
			reqID = utils.GenerateID(12)
		}

		corrID := r.Header.Get("X-Correlation-ID")
		if corrID == "" {
			corrID = reqID
		}

		vaultID := r.Header.Get("X-Vault-ID")

		ctx := r.Context()
		ctx = context.WithValue(ctx, utils.RequestIDKey, reqID)
		ctx = context.WithValue(ctx, utils.CorrelationIDKey, corrID)
		if vaultID != "" {
			ctx = context.WithValue(ctx, utils.VaultIDKey, vaultID)
		}

		tracer := utils.GetTracer()
		ctx, span := tracer.StartSpan(ctx, r.Method+" "+r.URL.Path)

		w.Header().Set("X-Request-ID", reqID)
		w.Header().Set("X-Correlation-ID", corrID)

		srw := &statusResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(srw, r.WithContext(ctx))

		tracer.EndSpan(span)
		latency := time.Since(start).Milliseconds()

		utils.GetMetricsRegistry().RecordRequest(srw.statusCode, latency)

		utils.GetLogger().Info(ctx, "HTTP Request", map[string]interface{}{
			"path":        r.URL.Path,
			"method":      r.Method,
			"status_code": srw.statusCode,
			"latency_ms":  latency,
			"client_ip":   r.RemoteAddr,
		})
	})
}
