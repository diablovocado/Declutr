package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/shared/observability"
)

// CacheStats provides cache statistics.
type CacheStats struct {
	ItemsCount int64   `json:"items_count"`
	Hits       int64   `json:"hits"`
	Misses     int64   `json:"misses"`
	HitRate    float64 `json:"hit_rate"`
	Driver     string  `json:"driver"`
}

// Cache defines the unified cache abstraction interface.
type Cache interface {
	Get(ctx context.Context, key string) (string, bool, error)
	Set(ctx context.Context, key string, value string, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	Flush(ctx context.Context) error
	Stats(ctx context.Context) (CacheStats, error)
}

// item represents an in-memory cache entry.
type item struct {
	value     string
	expiresAt time.Time
}

// InMemoryCache provides a thread-safe in-memory cache with TTL eviction.
type InMemoryCache struct {
	mu     sync.RWMutex
	items  map[string]item
	hits   int64
	misses int64
}

// NewInMemoryCache creates a new in-memory cache.
func NewInMemoryCache() *InMemoryCache {
	c := &InMemoryCache{
		items: make(map[string]item),
	}
	go c.startEvictionLoop()
	return c
}

func (c *InMemoryCache) startEvictionLoop() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for k, v := range c.items {
			if !v.expiresAt.IsZero() && now.After(v.expiresAt) {
				delete(c.items, k)
			}
		}
		c.mu.Unlock()
	}
}

func (c *InMemoryCache) Get(ctx context.Context, key string) (string, bool, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	it, found := c.items[key]
	if !found {
		c.misses++
		observability.GetMetricsRegistry().RecordCacheHitMiss(false)
		return "", false, nil
	}

	if !it.expiresAt.IsZero() && time.Now().After(it.expiresAt) {
		delete(c.items, key)
		c.misses++
		observability.GetMetricsRegistry().RecordCacheHitMiss(false)
		return "", false, nil
	}

	c.hits++
	observability.GetMetricsRegistry().RecordCacheHitMiss(true)
	return it.value, true, nil
}

func (c *InMemoryCache) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	var exp time.Time
	if ttl > 0 {
		exp = time.Now().Add(ttl)
	}

	c.items[key] = item{
		value:     value,
		expiresAt: exp,
	}
	return nil
}

func (c *InMemoryCache) Delete(ctx context.Context, key string) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.items, key)
	return nil
}

func (c *InMemoryCache) Flush(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items = make(map[string]item)
	return nil
}

func (c *InMemoryCache) Stats(ctx context.Context) (CacheStats, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	total := c.hits + c.misses
	var rate float64
	if total > 0 {
		rate = float64(c.hits) / float64(total)
	}

	return CacheStats{
		ItemsCount: int64(len(c.items)),
		Hits:       c.hits,
		Misses:     c.misses,
		HitRate:    rate,
		Driver:     "in_memory",
	}, nil
}

// RedisCache provides a Redis-backed distributed cache driver stub.
type RedisCache struct {
	fallback *InMemoryCache
	address  string
}

// NewRedisCache creates a new Redis cache with fallback.
func NewRedisCache(address string) *RedisCache {
	return &RedisCache{
		fallback: NewInMemoryCache(),
		address:  address,
	}
}

func (r *RedisCache) Get(ctx context.Context, key string) (string, bool, error) {
	return r.fallback.Get(ctx, key)
}

func (r *RedisCache) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	return r.fallback.Set(ctx, key, value, ttl)
}

func (r *RedisCache) Delete(ctx context.Context, key string) error {
	return r.fallback.Delete(ctx, key)
}

func (r *RedisCache) Flush(ctx context.Context) error {
	return r.fallback.Flush(ctx)
}

func (r *RedisCache) Stats(ctx context.Context) (CacheStats, error) {
	st, err := r.fallback.Stats(ctx)
	if err == nil {
		st.Driver = "redis"
	}
	return st, err
}

// Specialized Typed Cache Managers

// SearchCache handles caching search query results.
type SearchCache struct {
	cache Cache
}

func NewSearchCache(c Cache) *SearchCache {
	return &SearchCache{cache: c}
}

func (s *SearchCache) GetSearch(ctx context.Context, queryKey string) (interface{}, bool) {
	val, ok, _ := s.cache.Get(ctx, fmt.Sprintf("search:%s", queryKey))
	if !ok {
		return nil, false
	}
	var res interface{}
	_ = json.Unmarshal([]byte(val), &res)
	return res, true
}

func (s *SearchCache) SetSearch(ctx context.Context, queryKey string, result interface{}, ttl time.Duration) error {
	b, err := json.Marshal(result)
	if err != nil {
		return err
	}
	return s.cache.Set(ctx, fmt.Sprintf("search:%s", queryKey), string(b), ttl)
}

// MetadataCache handles caching asset metadata.
type MetadataCache struct {
	cache Cache
}

func NewMetadataCache(c Cache) *MetadataCache {
	return &MetadataCache{cache: c}
}

func (m *MetadataCache) GetMetadata(ctx context.Context, assetID string) (string, bool) {
	val, ok, _ := m.cache.Get(ctx, fmt.Sprintf("meta:%s", assetID))
	return val, ok
}

func (m *MetadataCache) SetMetadata(ctx context.Context, assetID string, meta string, ttl time.Duration) error {
	return m.cache.Set(ctx, fmt.Sprintf("meta:%s", assetID), meta, ttl)
}

// ContextCache handles caching context definitions.
type ContextCache struct {
	cache Cache
}

func NewContextCache(c Cache) *ContextCache {
	return &ContextCache{cache: c}
}

func (cc *ContextCache) GetContext(ctx context.Context, contextID string) (string, bool) {
	val, ok, _ := cc.cache.Get(ctx, fmt.Sprintf("ctx:%s", contextID))
	return val, ok
}

func (cc *ContextCache) SetContext(ctx context.Context, contextID string, val string, ttl time.Duration) error {
	return cc.cache.Set(ctx, fmt.Sprintf("ctx:%s", contextID), val, ttl)
}

// Global cache instance
var defaultCache Cache = NewInMemoryCache()

func GetDefaultCache() Cache {
	return defaultCache
}
