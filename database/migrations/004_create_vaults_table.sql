-- Migration 004: Create Vaults and Vault Settings Tables
CREATE TABLE IF NOT EXISTS vaults (
    vault_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL DEFAULT 'My Life Vault',
    description TEXT DEFAULT 'Default Zero-Knowledge Personal Vault Workspace',
    storage_usage_bytes BIGINT NOT NULL DEFAULT 0,
    item_count INT NOT NULL DEFAULT 0,
    collection_count INT NOT NULL DEFAULT 0,
    workspace_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    encryption_status VARCHAR(30) NOT NULL DEFAULT 'ENCRYPTED',
    default_language VARCHAR(10) DEFAULT 'en',
    default_ai_mode VARCHAR(30) DEFAULT 'balanced',
    default_privacy_mode VARCHAR(30) DEFAULT 'local_first',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_settings (
    vault_id UUID PRIMARY KEY REFERENCES vaults(vault_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'My Life Vault',
    description TEXT DEFAULT 'Default Zero-Knowledge Personal Vault Workspace',
    theme VARCHAR(20) DEFAULT 'dark',
    privacy_mode VARCHAR(30) DEFAULT 'local_first',
    ai_mode VARCHAR(30) DEFAULT 'balanced',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vaults_owner_id ON vaults(owner_id);
