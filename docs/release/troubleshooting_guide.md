# Declutr RC1 Diagnostic & Troubleshooting Runbook

Runbook for diagnosing runtime issues, high latency, worker panics, or webhook delivery failures.

## Diagnostic Commands & Endpoints

1. **Check System Health**: Query `GET /health` or `GET /api/v1/health`. All 8 subsystems (`database`, `cache`, `storage`, `workers`, `rate_limiter`, `resilience`, `tenant`, `sandbox`) should return `UP`.
2. **Worker Supervisor Recovery**: Query `GET /api/v1/admin/workers`. Check worker restart counts.
3. **Webhook DLQ Inspector**: Query `GET /api/v1/developer/webhooks/deliveries` or view DLQ table in `/developer`.
4. **Extension Sandbox Crashes**: Query `/marketplace/manager` to inspect extension health diagnostics.
5. **CLI Health Probe**: Execute `declutr diagnostics` to probe API gateway connectivity.
