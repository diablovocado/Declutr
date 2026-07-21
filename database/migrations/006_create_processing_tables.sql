-- Migration 006: Create Processing Engine Tables

CREATE TABLE IF NOT EXISTS processing_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- e.g., 'METADATA_EXTRACTION', 'OCR', 'EMBEDDING'
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED', -- QUEUED, WAITING, RUNNING, PAUSED, RETRYING, COMPLETED, CANCELLED, FAILED, SKIPPED
    priority INT NOT NULL DEFAULT 0,
    current_stage VARCHAR(100),
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    failure_reason TEXT,
    worker_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processing_workers (
    worker_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(255) NOT NULL,
    capabilities TEXT[] NOT NULL, -- e.g., ['OCR', 'PDF_PROCESSING']
    status VARCHAR(30) NOT NULL DEFAULT 'IDLE', -- IDLE, BUSY, OFFLINE
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processing_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES processing_jobs(job_id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- e.g., 'PROCESSING_STARTED', 'PROCESSING_FAILED'
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processing_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES processing_jobs(job_id) ON DELETE CASCADE,
    worker_id UUID REFERENCES processing_workers(worker_id) ON DELETE SET NULL,
    attempt_number INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    error_details TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_asset_id ON processing_jobs(asset_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_vault_id ON processing_jobs(vault_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status_priority ON processing_jobs(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_processing_events_asset_id ON processing_events(asset_id);
CREATE INDEX IF NOT EXISTS idx_processing_workers_status ON processing_workers(status);
