# Declutr Production Architecture Specification

Declutr is designed as a cloud-native, modular monorepo platform capable of handling millions of encrypted digital assets, high-throughput hybrid vector search queries, and distributed AI workloads.

## System Topology & Micro-Layering

```
                             [ NGINX / Cloudflare Ingress ]
                                           │
                                  ( TLS Termination )
                                           │
               ┌───────────────────────────┴───────────────────────────┐
               ▼                                                       ▼
  [ Web Application Frontend ]                            [ API Gateway / Load Balancer ]
   Next.js 14 SSR (Port 3000)                                         │
                                                    ┌──────────────────┴──────────────────┐
                                                    ▼                                     ▼
                                       [ Security & Rate Limits ]              [ Health & Metrics ]
                                         HSTS / CSP / Token Bucket              /health /metrics /ready
                                                    │
                                       [ Go Core Modular Monolith ]
                                               (Port 8080)
                                                    │
           ┌───────────────────┬────────────────────┼───────────────────┬───────────────────┐
           ▼                   ▼                    ▼                   ▼                   ▼
    [ Auth & Vault ]   [ Search Engine ]    [ Copilot RAG ]     [ Worker Pool ]     [ Connectors ]
       SRP-6a / AES     Hybrid PGVector       Grounded LLM       Queue Supervisor    Google/WebDAV
           │                   │                    │                   │                   │
           └───────────────────┴────────────────────┼───────────────────┴───────────────────┘
                                                    │
                   ┌────────────────────────────────┼────────────────────────────────┐
                   ▼                                ▼                                ▼
         [ PostgreSQL + pgvector ]           [ Redis Cluster ]               [ S3 / MinIO Storage ]
          Primary & Read Replicas             Multi-Tier Cache               Encrypted Vault Files
```

## Core Production Components

1. **API Transport & Middleware**:
   - Structured JSON logging with context correlation IDs (`X-Request-ID`, `X-Correlation-ID`).
   - Token-bucket sliding window rate limiting (Global, User, IP, AI, Upload).
   - Distributed tracing context propagation (`TraceID`, `SpanID`).
   - Hardened security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).

2. **Data & Storage Layer**:
   - PostgreSQL 16 + `pgvector` extension with composite indexing across all 27 migrations.
   - Table partitioning on metrics and audit logs for zero-downtime automated log rotation.
   - Unified Cache Abstraction Layer supporting thread-safe In-Memory and Redis Cluster driver.

3. **Background Worker Supervisors**:
   - Capability-driven self-healing worker pool monitoring Queue, Workflow, Sync, AI, and Connector daemons.
   - Panic recovery interceptors and exponential backoff restart loops.

4. **Resilience & Circuit Breakers**:
   - Fault-isolated Circuit Breaker pattern protecting AI inference providers and cloud storage APIs.
   - Graceful shutdown handlers catching `SIGINT` / `SIGTERM` OS signals with 15-second drain window.
