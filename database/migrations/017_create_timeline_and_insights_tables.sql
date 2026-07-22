-- Migration 017: Create Knowledge Insights & Timeline Tables

-- 1. timeline_events - chronological events generated across life, projects, travel, etc.
CREATE TABLE IF NOT EXISTS timeline_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL DEFAULT 'LIFE', -- LIFE, PROJECT, TRAVEL, MEDICAL, EDUCATION, FINANCIAL, LEGAL, PURCHASE, SUBSCRIPTION, CUSTOM
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    importance FLOAT NOT NULL DEFAULT 0.5,
    confidence FLOAT NOT NULL DEFAULT 0.8,
    related_assets JSONB NOT NULL DEFAULT '[]',
    related_entities JSONB NOT NULL DEFAULT '[]',
    related_contexts JSONB NOT NULL DEFAULT '[]',
    generated_by VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. timeline_groups - grouped timeline sequences (e.g. "Japan Vacation 2025 Timeline")
CREATE TABLE IF NOT EXISTS timeline_groups (
    group_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    group_name VARCHAR(255) NOT NULL,
    group_type VARCHAR(50) NOT NULL,
    event_ids JSONB NOT NULL DEFAULT '[]',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. knowledge_insights - proactive insights generated automatically by background engine
CREATE TABLE IF NOT EXISTS knowledge_insights (
    insight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- EXPIRATION_WARNING, RECURRING_EXPENSE, FREQUENT_PLACE, IMPORTANT_DOC, MISSING_DOC, INACTIVE_PROJECT, TRENDING_INTEREST, KNOWLEDGE_GROWTH, REPEATED_PATTERN
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    why_generated TEXT NOT NULL DEFAULT '',
    evidence JSONB NOT NULL DEFAULT '[]',
    related_assets JSONB NOT NULL DEFAULT '[]',
    related_entities JSONB NOT NULL DEFAULT '[]',
    importance FLOAT NOT NULL DEFAULT 0.7,
    confidence FLOAT NOT NULL DEFAULT 0.85,
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. insight_history - audit log of insight generation and dismissals
CREATE TABLE IF NOT EXISTS insight_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    insight_id UUID NOT NULL,
    action_taken VARCHAR(50) NOT NULL, -- GENERATED, DISMISSED, ACTIONED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. insight_preferences - vault configuration for insight generation
CREATE TABLE IF NOT EXISTS insight_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE UNIQUE,
    enabled_types JSONB NOT NULL DEFAULT '["EXPIRATION_WARNING", "RECURRING_EXPENSE", "FREQUENT_PLACE", "IMPORTANT_DOC", "MISSING_DOC", "INACTIVE_PROJECT", "TRENDING_INTEREST", "KNOWLEDGE_GROWTH", "REPEATED_PATTERN"]',
    min_confidence FLOAT NOT NULL DEFAULT 0.6,
    auto_refresh BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. milestones - detected major life, medical, travel, or project milestones
CREATE TABLE IF NOT EXISTS milestones (
    milestone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    milestone_type VARCHAR(50) NOT NULL, -- PASSPORT_EXPIRATION, VISA_COMPLETED, TAX_FILED, ADMISSION_COMPLETED, MEDICAL_COMPLETED, PROJECT_MILESTONE, TRAVEL_COMPLETED
    title VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, UPCOMING, COMPLETED, EXPIRED
    due_date TIMESTAMPTZ,
    related_asset_id VARCHAR(255),
    importance FLOAT NOT NULL DEFAULT 0.8,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_timeline_events_vault ON timeline_events(vault_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_insights_vault ON knowledge_insights(vault_id);
CREATE INDEX IF NOT EXISTS idx_milestones_vault ON milestones(vault_id);
