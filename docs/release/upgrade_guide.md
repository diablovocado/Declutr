# Declutr RC1 Zero-Downtime Upgrade Guide

Follow these steps to upgrade existing Declutr installations to `v1.0.0-rc1`.

## Upgrade Steps

1. **Backup Database Snapshot**: Execute `/api/v1/backups` or trigger `declutr backup` via CLI.
2. **Apply Database Migrations**: Run scripts `001` through `030` against PostgreSQL cluster.
3. **Rolling Pod Deployment**: Apply Kubernetes manifests in `infrastructure/kubernetes/` or run `helm upgrade declutr infrastructure/helm/declutr`.
4. **Health Verification**: Query `/ready` and `/health` endpoints to verify all 8 diagnostic subsystems return `UP`.
