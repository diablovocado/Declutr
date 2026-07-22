-- Migration 018: Create Declutr AI Copilot RAG & Conversation Tables

-- 1. conversations - user RAG conversation sessions
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    summary TEXT NOT NULL DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED
    message_count INT NOT NULL DEFAULT 0,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. messages - individual user and grounded assistant messages
CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    tokens_used INT NOT NULL DEFAULT 0,
    citations JSONB NOT NULL DEFAULT '[]',
    confidence FLOAT NOT NULL DEFAULT 0.9,
    reasoning_overview TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. conversation_context - retrieved RAG context snapshots for auditable grounding
CREATE TABLE IF NOT EXISTS conversation_context (
    context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    retrieved_assets JSONB NOT NULL DEFAULT '[]',
    retrieved_entities JSONB NOT NULL DEFAULT '[]',
    retrieved_memories JSONB NOT NULL DEFAULT '[]',
    retrieved_timeline JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. conversation_feedback - user ratings on AI response grounding quality
CREATE TABLE IF NOT EXISTS conversation_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
    user_rating VARCHAR(50) NOT NULL, -- UPVOTE, DOWNVOTE
    comment TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. prompt_versions - versioned structured prompts
CREATE TABLE IF NOT EXISTS prompt_versions (
    prompt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_name VARCHAR(50) NOT NULL UNIQUE,
    system_prompt TEXT NOT NULL,
    user_template TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. response_history - latency and audit metrics
CREATE TABLE IF NOT EXISTS response_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL DEFAULT 'declutr-grounded-rag-v1',
    latency_ms INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_vault ON conversations(vault_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
