-- Migration 022: Create Version History, Recovery & Time Machine Tables

-- 1. resource_versions - core version log
CREATE TABLE IF NOT EXISTS resource_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- ASSET, METADATA, AI_ANALYSIS, CONTEXT, RELATIONSHIP, COLLECTION, MEMORY, WORKFLOW, PREFERENCES
    resource_id VARCHAR(255) NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    change_type VARCHAR(50) NOT NULL, -- CREATED, UPDATED, DELETED, MOVED, RENAMED, AI_REGENERATED, PERMISSION_CHANGED, WORKFLOW_EXECUTED, SETTINGS_CHANGED
    summary TEXT NOT NULL DEFAULT '',
    checksum VARCHAR(255) NOT NULL DEFAULT '',
    storage_ref VARCHAR(255) NOT NULL DEFAULT '',
    created_by VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. version_snapshots - snapshot payload store
CREATE TABLE IF NOT EXISTS version_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES resource_versions(version_id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL,
    snapshot_type VARCHAR(50) NOT NULL DEFAULT 'FULL', -- FULL, INCREMENTAL, DELTA, COMPRESSED, IMMUTABLE
    snapshot_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. change_history - field-level audit change history
CREATE TABLE IF NOT EXISTS change_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL,
    version_id UUID NOT NULL REFERENCES resource_versions(version_id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL,
    changed_fields JSONB NOT NULL DEFAULT '[]',
    actor_id VARCHAR(100) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. recycle_bin - soft-deleted items bin
CREATE TABLE IF NOT EXISTS recycle_bin (
    recycle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    original_path VARCHAR(500) NOT NULL DEFAULT '',
    deleted_by VARCHAR(100) NOT NULL DEFAULT 'USER',
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_restored BOOLEAN NOT NULL DEFAULT FALSE,
    restored_at TIMESTAMPTZ
);

-- 5. restore_jobs - track restoration job execution
CREATE TABLE IF NOT EXISTS restore_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL,
    target_version_id UUID NOT NULL REFERENCES resource_versions(version_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, SUCCESS, FAILED
    restored_by VARCHAR(100) NOT NULL DEFAULT 'USER',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 6. version_diffs - cached version comparison diffs
CREATE TABLE IF NOT EXISTS version_diffs (
    diff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_version_id UUID NOT NULL REFERENCES resource_versions(version_id) ON DELETE CASCADE,
    target_version_id UUID NOT NULL REFERENCES resource_versions(version_id) ON DELETE CASCADE,
    added_fields JSONB NOT NULL DEFAULT '{}',
    removed_fields JSONB NOT NULL DEFAULT '{}',
    modified_fields JSONB NOT NULL DEFAULT '{}',
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_versions_resource ON resource_versions(resource_id);
CREATE INDEX IF NOT EXISTS idx_recycle_vault ON recycle_bin(vault_id);
