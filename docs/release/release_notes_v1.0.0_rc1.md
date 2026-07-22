# Declutr v1.0.0-rc1 Release Notes

Declutr Release Candidate 1 (**v1.0.0-rc1**) is the production-ready milestone of Declutr — an AI-powered, multi-tenant, offline-first personal & enterprise knowledge platform.

## Summary of Completed Capabilities

- **Core Vault & Content Ingestion**: Multi-vault workspace isolation, content extraction engine (PDF, DOCX, XLSX, OCR scans, audio/video transcriptions), and metadata extraction.
- **Hybrid Vector & Keyword Search Engine**: BM25 + PostgreSQL pgvector HNSW vector search with reciprocal rank fusion (RRF).
- **RAG Grounded AI Copilot**: Grounded multi-turn conversational AI with explicit citation verification, memory retrieval, and persona engine.
- **Offline-First Sync Engine**: Bidirectional delta sync with 3-way field-level merge conflict resolution (`backend/modules/sync/`).
- **Security Hub & Audit Engine**: Risk engine, session termination, trusted devices, and HMAC append-only audit trail (`backend/modules/security/`).
- **Integration Platform**: Connector SDK with Google Drive, Dropbox, Notion, WebDAV connectors, and inbound webhook ingestion (`backend/modules/integrations/`).
- **Production Hardening & Telemetry**: Prometheus metrics, OpenTelemetry distributed tracing, structured JSON logging with secret redaction, token bucket rate limiting, worker supervisors, and circuit breakers.
- **Enterprise Organizations & Multi-Tenancy**: Tenant isolation middleware, RBAC with 10 granular permissions, team/department groups, workspace hierarchy, policy engine, and SSO provider abstractions (`backend/modules/organization/`).
- **Public API & Developer SDKs**: Versioned REST API (`/api/v1/`), OpenAPI 3.0 specification, Scoped API Keys, OAuth 2.1 PKCE, Webhook engine with HMAC-SHA256 signing and DLQ, official TypeScript, Go, and Python SDKs, and Declutr CLI binary (`cli/cmd/declutr/main.go`).
- **Extension Platform & Marketplace**: Isolated sandbox runtime with CPU/memory quotas and execution timeouts, 20 extension types, 10 marketplace categories, user permission approval dialog, rating & review system, and publisher developer portal (`frontend/app/marketplace/`).
