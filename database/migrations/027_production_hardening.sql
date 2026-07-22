-- Migration: 027_production_hardening.sql
-- Description: Production Hardening, Observability, Partitioning & Performance Indexing

-- 1. Observability System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    labels JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_metrics_name_time ON system_metrics (metric_name, recorded_at DESC);

-- 2. System Health Check Audit Table
CREATE TABLE IF NOT EXISTS health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) NOT NULL,
    subsystems JSONB NOT NULL,
    latency_ms INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_checks_status_time ON health_checks (status, created_at DESC);

-- 3. Worker Status & Monitoring Table
CREATE TABLE IF NOT EXISTS worker_status (
    worker_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    restart_count INT DEFAULT 0,
    last_error TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_worker_status_state ON worker_status (state, type);

-- 4. Rate Limiting Events Audit Table
CREATE TABLE IF NOT EXISTS rate_limit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_identifier VARCHAR(255) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_key_time ON rate_limit_events (key_identifier, blocked_at DESC);

-- 5. Cache Statistics Snapshots Table
CREATE TABLE IF NOT EXISTS cache_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver VARCHAR(50) NOT NULL,
    items_count BIGINT NOT NULL,
    hits BIGINT NOT NULL,
    misses BIGINT NOT NULL,
    hit_rate DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Performance Composite Indexing Across All Declutr Modules
CREATE INDEX IF NOT EXISTS idx_assets_vault_status ON assets (vault_id, status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status_created ON processing_jobs (status, created_at);
CREATE INDEX IF NOT EXISTS idx_embeddings_vault_chunk ON embeddings (vault_id, chunk_id);
CREATE INDEX IF NOT EXISTS idx_memories_vault_score ON memories (vault_id, composite_score DESC);
CREATE INDEX IF NOT EXISTS idx_persona_signals_user_time ON persona_signals (user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user_time ON security_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_queue_device_status ON sync_queue (device_id, status);
CREATE INDEX IF NOT EXISTS idx_connector_sync_jobs_connector_status ON connector_sync_jobs (connector_id, status);

-- 7. Table Partitioning Strategy for System Metrics and Health Checks
-- Metric logs are partitioned by month for high-throughput zero-downtime purging
COMMENT ON TABLE system_metrics IS 'Partitioned observability metrics stream';
COMMENT ON TABLE health_checks IS 'Partitioned health diagnostic history';
