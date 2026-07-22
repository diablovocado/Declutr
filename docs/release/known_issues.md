# Declutr RC1 Known Issues & Limitations

This document lists minor known non-blocking items for the RC1 release candidate.

## Non-Blocking Items

1. **Local Redis In-Memory Fallback**: When Redis Cluster is disabled (`REDIS_ENABLED=false`), in-memory LRU cache is used. Cache invalidation across multiple backend replicas requires Redis.
2. **Third-Party Connector Sandbox**: WebDAV and Google Drive connectors execute in-process within Go routines; containerized isolated connector sandboxes are scheduled for v1.1.
3. **App Marketplace Monetization**: Revenue processing hooks in Publisher Portal are mock stubs ready for Stripe integration in v1.1.
