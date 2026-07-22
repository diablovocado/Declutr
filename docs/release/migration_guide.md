# Declutr RC1 Database Migration Guide

Declutr's database schema consists of 30 PostgreSQL migration scripts (`database/migrations/001_...sql` through `database/migrations/030_create_extension_tables.sql`).

## Migration Audit Matrix

- `001-026`: Core schema (users, vaults, assets, embeddings, search, copilot, workflows, notifications, sharing, versioning, backups, security, sync, integrations).
- `027_production_hardening.sql`: Telemetry tables, health checks, rate limit events, worker statuses, and performance indexes.
- `028_create_organization_tables.sql`: Enterprise multi-tenancy, RBAC roles, team groups, workspace memberships, governance policies, and SSO configs.
- `029_create_developer_platform_tables.sql`: Public API keys, OAuth 2.1 clients/tokens, webhooks, webhook deliveries, and DLQ.
- `030_create_extension_tables.sql`: Marketplace catalog, versions, installations, reviews, publishers, and sandbox statistics.

All migrations are transactional and idempotent (`CREATE TABLE IF NOT EXISTS`).
