package ratelimit

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"
)

// Policy defines rate limit rules.
type Policy struct {
	MaxRequests int
	Window      time.Duration
}

// Default Policies
var (
	GlobalPolicy   = Policy{MaxRequests: 10000, Window: 1 * time.Minute}
	UserPolicy     = Policy{MaxRequests: 300, Window: 1 * time.Minute}
	IPPolicy       = Policy{MaxRequests: 100, Window: 1 * time.Minute}
	AIPolicy       = Policy{MaxRequests: 30, Window: 1 * time.Minute}
	UploadPolicy   = Policy{MaxRequests: 20, Window: 1 * time.Minute}
	APIPolicy      = Policy{MaxRequests: 500, Window: 1 * time.Minute}
)

type tokenBucket struct {
	tokens     float64
	maxTokens  float64
	refillRate float64 // tokens per second
	lastRefill time.Time
}

// Limiter manages multi-tier token bucket rate limiting.
type Limiter struct {
	mu      sync.Mutex
	buckets map[string]*tokenBucket
}

var globalLimiter = NewLimiter()

// NewLimiter creates a rate limiter instance.
func NewLimiter() *Limiter {
	l := &Limiter{
		buckets: make(map[string]*tokenBucket),
	}
	go l.startCleanupLoop()
	return l
}

// GetLimiter returns global limiter instance.
func GetLimiter() *Limiter {
	return globalLimiter
}

func (l *Limiter) startCleanupLoop() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		l.mu.Lock()
		now := time.Now()
		for key, bucket := range l.buckets {
			if now.Sub(bucket.lastRefill) > 10*time.Minute {
				delete(l.buckets, key)
			}
		}
		l.mu.Unlock()
	}
}

// Allow checks whether a request under key and policy is allowed.
func (l *Limiter) Allow(key string, policy Policy) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	bucket, exists := l.buckets[key]
	if !exists {
		maxT := float64(policy.MaxRequests)
		rate := maxT / policy.Window.Seconds()
		l.buckets[key] = &tokenBucket{
			tokens:     maxT - 1.0,
			maxTokens:  maxT,
			refillRate: rate,
			lastRefill: now,
		}
		return true
	}

	// Refill tokens
	elapsed := now.Sub(bucket.lastRefill).Seconds()
	bucket.tokens += elapsed * bucket.refillRate
	if bucket.tokens > bucket.maxTokens {
		bucket.tokens = bucket.maxTokens
	}
	bucket.lastRefill = now

	if bucket.tokens >= 1.0 {
		bucket.tokens -= 1.0
		return true
	}

	return false
}

// RateLimitMiddleware returns an HTTP middleware enforcing rate limits.
func RateLimitMiddleware(targetPolicy Policy, keyFunc func(*http.Request) string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key := "global"
			if keyFunc != nil {
				key = keyFunc(r)
			}

			if !globalLimiter.Allow(key, targetPolicy) {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(targetPolicy.Window.Seconds())))
				http.Error(w, `{"error":"Too Many Requests","code":"RATE_LIMIT_EXCEEDED"}`, http.StatusTooManyRequests)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// AllowUser checks per-user limit.
func AllowUser(userID string) bool {
	return globalLimiter.Allow("user:"+userID, UserPolicy)
}

// AllowIP checks per-IP limit.
func AllowIP(ip string) bool {
	return globalLimiter.Allow("ip:"+ip, IPPolicy)
}

// AllowAI checks AI request limit.
func AllowAI(userID string) bool {
	return globalLimiter.Allow("ai:"+userID, AIPolicy)
}

// AllowUpload checks upload request limit.
func AllowUpload(userID string) bool {
	return globalLimiter.Allow("upload:"+userID, UploadPolicy)
}

// ExtractIP returns request IP address.
func ExtractIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip != "" {
		return ip
	}
	return r.RemoteAddr
}
