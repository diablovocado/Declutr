# Declutr Production Monitoring & Alerting Guide

## Telemetry Endpoints

Declutr exposes real-time telemetry and health monitoring endpoints:

| Endpoint | Format | Description |
|---|---|---|
| `/health` | JSON | Complete 8-subsystem diagnostic health matrix |
| `/ready` | JSON | K8s readiness probe |
| `/live` | JSON | K8s liveness probe |
| `/version` | JSON | Engine build version, environment, and git commit |
| `/metrics` | Prometheus / JSON | Real-time performance metrics stream |
| `/api/v1/admin/status` | JSON | Admin console status overview |
| `/api/v1/admin/queues` | JSON | Background worker status and queue depth |
| `/api/v1/admin/cache` | JSON | Cache hit rate and memory footprint |

## Key Prometheus Metrics

- `declutr_http_requests_total`: Total processed HTTP requests.
- `declutr_http_latency_average_ms`: Average request latency in milliseconds.
- `declutr_cache_hit_rate`: Cache efficiency ratio (0.0 - 1.0).
- `declutr_storage_usage_bytes`: Total vault storage byte footprint.
- `declutr_queue_depth`: Background processing job depth.

## Alerting Rules Thresholds

- **API High Latency**: `declutr_http_latency_average_ms > 500ms` for 5m.
- **Cache Degradation**: `declutr_cache_hit_rate < 0.70` for 10m.
- **Queue Backlog**: `declutr_queue_depth > 1000` for 15m.
- **Subsystem Unhealthy**: `/health` HTTP status `503 Service Unavailable`.
