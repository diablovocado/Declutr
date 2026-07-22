# Declutr Performance Tuning & Optimization Guide

## Database Optimization

- **Composite Indexing**: 27 migrations define composite B-Tree and GIN indexes across key high-traffic fields (`vault_id`, `status`, `created_at`, `recorded_at`).
- **pgvector Indexing**: Vector embeddings use HNSW (`m=16`, `ef_construction=64`) for sub-linear similarity search scaling.
- **Connection Pooling**: PostgreSQL connection pool configured for 100 max connections with 25 idle connections and 15s timeout.

## Memory & Caching

- Thread-safe `InMemoryCache` with 30s background TTL eviction loop.
- Distributed Redis Cluster driver fallback for multi-region deployments.
- Cache pre-warming for user preferences and active workflow rules.
