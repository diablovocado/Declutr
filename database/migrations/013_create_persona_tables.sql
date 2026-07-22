-- Migration 013: Create Reverse Persona Engine Tables

-- 1. Persona profiles - the dynamic persona type per vault
CREATE TABLE IF NOT EXISTS persona_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE UNIQUE,
    persona_type VARCHAR(100) NOT NULL DEFAULT 'Undefined', -- Traveller, Developer, Researcher, Student, etc.
    confidence_score FLOAT NOT NULL DEFAULT 0.0,
    attributes JSONB NOT NULL DEFAULT '{}', -- dynamic scored dimension map
    knowledge_model JSONB NOT NULL DEFAULT '{}', -- frequent entities, locations, contacts
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Behaviour signals - raw events collected per vault
CREATE TABLE IF NOT EXISTS persona_signals (
    signal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    signal_type VARCHAR(100) NOT NULL, -- ASSET_OPEN, SEARCH, PIN, UPLOAD, EDIT, CONTEXT_SWITCH, RELATIONSHIP_EXPLORE, COLLECTION_USE, TIME_OF_DAY
    asset_id UUID,                     -- nullable, not all signals relate to an asset
    value TEXT,                        -- signal value (e.g. search term, context name, time bucket)
    weight FLOAT NOT NULL DEFAULT 1.0, -- how strongly this signal counts
    source VARCHAR(100) DEFAULT 'user_interaction',
    is_disabled BOOLEAN NOT NULL DEFAULT FALSE, -- honoured when user disables this signal type
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Persona scores - scored dimensions with decay support
CREATE TABLE IF NOT EXISTS persona_scores (
    score_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    dimension VARCHAR(150) NOT NULL, -- e.g. "Travel", "Software Development", "Healthcare"
    importance FLOAT NOT NULL DEFAULT 0.0,
    recency FLOAT NOT NULL DEFAULT 0.0,
    frequency INT NOT NULL DEFAULT 0,
    confidence FLOAT NOT NULL DEFAULT 0.0,
    decay_rate FLOAT NOT NULL DEFAULT 0.05, -- per-day decay applied on recalculation
    trend VARCHAR(20) DEFAULT 'STABLE', -- RISING, FALLING, STABLE
    last_seen_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vault_id, dimension)
);

-- 4. Persona interests - inferred long-term topics and recurring entities
CREATE TABLE IF NOT EXISTS persona_interests (
    interest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100), -- Person, Location, Organization, Topic
    frequency_score FLOAT NOT NULL DEFAULT 0.0,
    personal_relevance FLOAT NOT NULL DEFAULT 0.0,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vault_id, topic)
);

-- 5. Persona recommendations - generated with full explainability
CREATE TABLE IF NOT EXISTS persona_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL, -- CONTINUE_PROJECT, RESUME_READING, RELATED_DOCUMENT, SUGGESTED_CONTEXT, SUGGESTED_COLLECTION, SUGGESTED_ARCHIVE
    title VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    confidence FLOAT NOT NULL DEFAULT 0.0,
    evidence JSONB NOT NULL DEFAULT '[]', -- list of supporting evidence strings
    related_asset_ids JSONB NOT NULL DEFAULT '[]',
    contributing_signals JSONB NOT NULL DEFAULT '[]', -- which signals drove this
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Persona settings - per-vault privacy controls
CREATE TABLE IF NOT EXISTS persona_settings (
    settings_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE UNIQUE,
    learning_paused BOOLEAN NOT NULL DEFAULT FALSE,
    disabled_signal_types JSONB NOT NULL DEFAULT '[]', -- array of disabled signal type strings
    allow_export BOOLEAN NOT NULL DEFAULT TRUE,
    data_retention_days INT DEFAULT NULL, -- NULL = keep forever
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Persona history - immutable audit snapshots
CREATE TABLE IF NOT EXISTS persona_history (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    persona_type VARCHAR(100),
    snapshot_data JSONB NOT NULL DEFAULT '{}',
    snapshot_reason VARCHAR(255) DEFAULT 'periodic',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_persona_signals_vault ON persona_signals(vault_id);
CREATE INDEX IF NOT EXISTS idx_persona_signals_type ON persona_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_persona_signals_recorded ON persona_signals(recorded_at);
CREATE INDEX IF NOT EXISTS idx_persona_scores_vault ON persona_scores(vault_id);
CREATE INDEX IF NOT EXISTS idx_persona_interests_vault ON persona_interests(vault_id);
CREATE INDEX IF NOT EXISTS idx_persona_recommendations_vault ON persona_recommendations(vault_id);
CREATE INDEX IF NOT EXISTS idx_persona_history_vault ON persona_history(vault_id);
