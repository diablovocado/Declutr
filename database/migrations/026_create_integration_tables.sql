-- Migration 026: Create Integration Platform & Connector Framework Tables

-- 1. connectors - installed connector instances
CREATE TABLE IF NOT EXISTS connectors (
    connector_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    type_key VARCHAR(50) NOT NULL, -- GOOGLE_DRIVE, DROPBOX, NOTION, GITHUB, S3, WEBDAV, CUSTOM
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'STORAGE', -- STORAGE, CALENDAR, MAIL, PRODUCTIVITY, CODE
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIGURED', -- CONFIGURED, CONNECTED, DISCONNECTED, ERROR
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. connector_configs - connector runtime configuration
CREATE TABLE IF NOT EXISTS connector_configs (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    sync_direction VARCHAR(50) NOT NULL DEFAULT 'BIDIRECTIONAL', -- IMPORT_ONLY, EXPORT_ONLY, BIDIRECTIONAL
    auto_sync_interval_mins INT NOT NULL DEFAULT 60,
    sync_folder VARCHAR(255) NOT NULL DEFAULT '/',
    settings JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. connector_credentials - encrypted OAuth tokens and API keys
CREATE TABLE IF NOT EXISTS connector_credentials (
    cred_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    auth_type VARCHAR(50) NOT NULL DEFAULT 'OAUTH2', -- OAUTH2, API_KEY, PERSONAL_ACCESS_TOKEN, SERVICE_ACCOUNT
    encrypted_credentials JSONB NOT NULL DEFAULT '{}',
    expires_at TIMESTAMPTZ
);

-- 4. connector_sync_jobs - connector import/export execution jobs
CREATE TABLE IF NOT EXISTS connector_sync_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL DEFAULT 'FULL_IMPORT', -- FULL_IMPORT, DELTA_SYNC, EXPORT
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
    items_processed INT NOT NULL DEFAULT 0,
    bytes_transferred BIGINT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. connector_webhooks - inbound webhook event log
CREATE TABLE IF NOT EXISTS connector_webhooks (
    webhook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. connector_logs - runtime execution and audit logs
CREATE TABLE IF NOT EXISTS connector_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO, WARN, ERROR
    message TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. connector_health - health check diagnostic probing logs
CREATE TABLE IF NOT EXISTS connector_health (
    health_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY', -- HEALTHY, DEGRADED, UNHEALTHY
    latency_ms INT NOT NULL DEFAULT 0,
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_connector_vault ON connectors(vault_id);
CREATE INDEX IF NOT EXISTS idx_connector_sync_jobs ON connector_sync_jobs(connector_id);
CREATE INDEX IF NOT EXISTS idx_connector_logs ON connector_logs(connector_id);
