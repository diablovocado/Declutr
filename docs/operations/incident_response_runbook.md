# Declutr Incident Response Runbook (P1 / P2 / P3)

This runbook outlines incident triage, severity classification, communication protocols, and resolution workflows for Declutr production clusters.

## Incident Severity Matrix

| Severity | Definition | SLA Response | Escalation Path |
|---|---|---|---|
| **P1 - Critical** | Platform outage, database unavailable, security breach, total data loss risk | `< 15 mins` | On-Call Lead → SRE Director → VP Eng |
| **P2 - High** | Major feature degraded (Search, AI Copilot streaming down, Webhooks failing) | `< 1 hour` | On-Call SRE → Module Lead |
| **P3 - Medium** | Non-critical UI glitch, delayed background sync, minor performance degradation | `< 4 hours` | On-Call Engineer |

## Triage Procedure

1. **Acknowledge PagerDuty Alert**: Silence PagerDuty alarm and set incident status to `INVESTIGATING`.
2. **Inspect Telemetry**: Query Prometheus metrics (`/metrics`), Grafana dashboard, and OpenTelemetry trace traces (`/api/v1/admin/traces`).
3. **Execute Health Diagnostic**: Run `declutr diagnostics` CLI probe or curl `/api/v1/health`.
4. **Communicate on Status Page**: Update public status page (`/status`) with incident summary.
5. **Mitigate / Rollback**: If recent deployment caused regression, trigger automated rollback pipeline.
