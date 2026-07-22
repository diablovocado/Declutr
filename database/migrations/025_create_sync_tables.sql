-- Migration 025: Create Offline-First Sync Engine & Conflict Resolution Tables

-- 1. sync_queue - offline client mutation queue
CREATE TABLE IF NOT EXISTS sync_queue (
    queue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, MOVE, RENAME, PERMISSION_CHANGE
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED, UPLOADING, DOWNLOADING, RETRY, PAUSED, COMPLETED, FAILED, CANCELLED
    payload JSONB NOT NULL DEFAULT '{}',
    retry_count INT NOT NULL DEFAULT 0,
    error_msg TEXT NOT NULL DEFAULT '',
    queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. sync_events - append-only sequence log of synchronized vault changes
CREATE TABLE IF NOT EXISTS sync_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    sequence_num BIGSERIAL UNIQUE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    checksum VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. sync_conflicts - detected concurrent edit conflicts
CREATE TABLE IF NOT EXISTS sync_conflicts (
    conflict_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    local_payload JSONB NOT NULL DEFAULT '{}',
    remote_payload JSONB NOT NULL DEFAULT '{}',
    strategy VARCHAR(50) NOT NULL DEFAULT 'LAST_WRITE_WINS', -- LAST_WRITE_WINS, FIELD_LEVEL_MERGE, VERSION_BASED_MERGE, MANUAL_RESOLUTION
    status VARCHAR(50) NOT NULL DEFAULT 'UNRESOLVED', -- UNRESOLVED, RESOLVED_LOCAL, RESOLVED_REMOTE, RESOLVED_MERGE
    resolved_payload JSONB NOT NULL DEFAULT '{}',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 4. sync_sessions - sync session connection tracking
CREATE TABLE IF NOT EXISTS sync_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    session_type VARCHAR(50) NOT NULL DEFAULT 'PUSH', -- PUSH, PULL, FULL_SYNC
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, INTERRUPTED, FAILED
    events_processed INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. device_state - per-device sync sequence checkpoints
CREATE TABLE IF NOT EXISTS device_state (
    state_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL UNIQUE,
    last_pushed_seq BIGINT NOT NULL DEFAULT 0,
    last_pulled_seq BIGINT NOT NULL DEFAULT 0,
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_online BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. sync_statistics - vault sync metrics summary
CREATE TABLE IF NOT EXISTS sync_statistics (
    stats_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    total_synced_events INT NOT NULL DEFAULT 0,
    pending_queue_count INT NOT NULL DEFAULT 0,
    active_conflicts_count INT NOT NULL DEFAULT 0,
    last_sync_duration_ms INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. offline_operations - client recorded offline operations log
CREATE TABLE IF NOT EXISTS offline_operations (
    op_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(vault_id, status);
CREATE INDEX IF NOT EXISTS idx_sync_events_seq ON sync_events(sequence_num);
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_vault ON sync_conflicts(vault_id, status);
