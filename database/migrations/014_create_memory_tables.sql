-- Migration 014: Create Memory Engine Tables

-- 1. memories - the core memory object
CREATE TABLE IF NOT EXISTS memories (
    memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    memory_type VARCHAR(50) NOT NULL DEFAULT 'SHORT_TERM',
    -- SHORT_TERM, WORKING, LONG_TERM, ARCHIVED, FORGOTTEN, PINNED, GENERATED, USER, AI
    importance_score FLOAT NOT NULL DEFAULT 0.0,
    confidence FLOAT NOT NULL DEFAULT 0.0,
    recency FLOAT NOT NULL DEFAULT 1.0,
    frequency INT NOT NULL DEFAULT 1,
    memory_strength FLOAT NOT NULL DEFAULT 0.0, -- composite strength [0,1]
    decay_rate FLOAT NOT NULL DEFAULT 0.03,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    pin_reason TEXT,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. memory_sources - which assets, entities, contexts, relationships contributed
CREATE TABLE IF NOT EXISTS memory_sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- ASSET, ENTITY, RELATIONSHIP, CONTEXT, PERSONA
    source_ref_id VARCHAR(255) NOT NULL, -- ID of the contributing source
    contribution_weight FLOAT NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. memory_scores - evolving strength scores over time
CREATE TABLE IF NOT EXISTS memory_scores (
    score_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    importance FLOAT NOT NULL DEFAULT 0.0,
    recency FLOAT NOT NULL DEFAULT 1.0,
    frequency INT NOT NULL DEFAULT 1,
    confidence FLOAT NOT NULL DEFAULT 0.0,
    decay_factor FLOAT NOT NULL DEFAULT 1.0,
    composite_strength FLOAT NOT NULL DEFAULT 0.0,
    scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. memory_events - significant events attached to memories
CREATE TABLE IF NOT EXISTS memory_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- FORMED, STRENGTHENED, DECAYED, PINNED, ARCHIVED, MERGED, ACCESSED
    event_data JSONB NOT NULL DEFAULT '{}',
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. memory_history - immutable audit log of memory state snapshots
CREATE TABLE IF NOT EXISTS memory_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL,
    memory_type VARCHAR(50),
    strength_snapshot FLOAT,
    snapshot_reason VARCHAR(255) DEFAULT 'periodic',
    snapshot_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. memory_settings - per-vault memory configuration
CREATE TABLE IF NOT EXISTS memory_settings (
    settings_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE UNIQUE,
    memory_learning_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    auto_archive_threshold FLOAT NOT NULL DEFAULT 0.1, -- strength below this → ARCHIVED
    auto_forget_threshold FLOAT NOT NULL DEFAULT 0.01, -- strength below this → FORGOTTEN
    default_decay_rate FLOAT NOT NULL DEFAULT 0.03,
    max_working_memories INT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. memory_clusters - groupings of related memories
CREATE TABLE IF NOT EXISTS memory_clusters (
    cluster_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    cluster_name VARCHAR(255) NOT NULL,
    cluster_type VARCHAR(100) NOT NULL, -- TOPIC, ENTITY, CONTEXT, TEMPORAL, PERSONA
    member_memory_ids JSONB NOT NULL DEFAULT '[]',
    cohesion_score FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memories_vault ON memories(vault_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_strength ON memories(memory_strength DESC);
CREATE INDEX IF NOT EXISTS idx_memories_pinned ON memories(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_memory_sources_memory ON memory_sources(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_scores_memory ON memory_scores(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_events_memory ON memory_events(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_clusters_vault ON memory_clusters(vault_id);
