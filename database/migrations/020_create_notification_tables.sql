-- Migration 020: Create Notification Center & Proactive Intelligence Tables

-- 1. notifications - core notification items
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- INFORMATION, SUCCESS, WARNING, CRITICAL, REMINDER, RECOMMENDATION, AI_INSIGHT, WORKFLOW, SECURITY, SYSTEM
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    related_assets JSONB NOT NULL DEFAULT '[]',
    related_context JSONB NOT NULL DEFAULT '{}',
    related_workflow JSONB NOT NULL DEFAULT '{}',
    action_type VARCHAR(50) NOT NULL DEFAULT 'NONE', -- OPEN_ASSET, VIEW_CONTEXT, RUN_WORKFLOW, RETRY_JOB, DISMISS, PIN, ARCHIVE, SNOOZE
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. notification_rules - custom alert rules
CREATE TABLE IF NOT EXISTS notification_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    event_trigger VARCHAR(100) NOT NULL,
    min_priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    channels JSONB NOT NULL DEFAULT '["IN_APP"]',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. notification_preferences - vault channel & alert preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE UNIQUE,
    enabled_types JSONB NOT NULL DEFAULT '["INFORMATION", "SUCCESS", "WARNING", "CRITICAL", "REMINDER", "RECOMMENDATION", "AI_INSIGHT", "WORKFLOW", "SECURITY", "SYSTEM"]',
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    desktop_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    digest_frequency VARCHAR(50) NOT NULL DEFAULT 'DAILY', -- DAILY, WEEKLY, OFF
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. notification_delivery - channel delivery status
CREATE TABLE IF NOT EXISTS notification_delivery (
    delivery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- IN_APP, EMAIL, PUSH, DESKTOP
    status VARCHAR(50) NOT NULL DEFAULT 'DELIVERED', -- DELIVERED, PENDING, FAILED
    delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. notification_history - user interaction history
CREATE TABLE IF NOT EXISTS notification_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    notification_id UUID NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
    action_taken VARCHAR(50) NOT NULL, -- READ, DISMISSED, ACTIONED, SNOOZED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. digest_reports - daily / weekly summary reports
CREATE TABLE IF NOT EXISTS digest_reports (
    digest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    digest_type VARCHAR(50) NOT NULL, -- DAILY, WEEKLY, MONTHLY
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content_data JSONB NOT NULL DEFAULT '{}',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_vault ON notifications(vault_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
