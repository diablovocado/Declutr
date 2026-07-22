# Declutr Scaling Strategy & High Availability Guide

Declutr's architecture scales horizontally across stateless API servers, asynchronous background worker pools, caching layers, and database clusters.

## Horizontal Scaling Vectors

1. **API Tier (Go Stateless Backend)**:
   - Stateless design enables scaling up to 50+ Kubernetes pod replicas via HPA based on CPU/memory utilization (>75%).
   - NGINX / Cloudflare Ingress handles round-robin & least-connection load balancing.

2. **Vector Search & PostgreSQL**:
   - `pgvector` HNSW index configurations optimized for sub-50ms vector query retrieval across 10M+ embeddings.
   - Master PostgreSQL instance manages write traffic; read-only replicas handle search and retrieval queries.

3. **Cache Tier (Redis Cluster)**:
   - Sharded Redis cluster caches frequent search plans, metadata, contexts, and user preferences.
   - High cache hit rate (>92%) reduces PostgreSQL query pressure by 10x.

4. **Background Workers (Queue & AI Pipeline)**:
   - Background processing pools scale independently from public API endpoints.
   - Supervisors auto-restart worker processes on failure.
