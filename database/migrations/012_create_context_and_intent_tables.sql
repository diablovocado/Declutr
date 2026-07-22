-- Migration 012: Create Context and Intent Engine Tables

CREATE TABLE IF NOT EXISTS contexts (
    context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g. Travel, Financial, Medical, Legal, Project, Life Activity
    summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED, MERGED, UNREVIEWED
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS context_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL REFERENCES contexts(context_id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    evidence TEXT,
    reasoning TEXT,
    prompt_version VARCHAR(50) DEFAULT '1.0.0',
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(context_id, asset_id)
);

CREATE TABLE IF NOT EXISTS context_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL REFERENCES contexts(context_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- Trip, Meeting, Purchase, Hospital Visit, Flight, Conference, Contract Signing, Birthday, Anniversary, Interview
    event_name VARCHAR(255) NOT NULL,
    event_date TIMESTAMPTZ,
    location VARCHAR(255),
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    evidence TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS intent_types (
    intent_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-seed canonical intent types
INSERT INTO intent_types (name, description, category) VALUES
    ('Travel', 'Items related to trips, flights, accommodation, and itineraries', 'Personal & Work'),
    ('Finance', 'Invoices, receipts, tax documents, bank statements, and expenses', 'Financial'),
    ('Health', 'Medical records, prescriptions, doctor visits, and lab reports', 'Personal Care'),
    ('Legal', 'Contracts, NDAs, lease agreements, and legal notices', 'Administrative'),
    ('Identity', 'Passports, IDs, driver licenses, and verification credentials', 'Security & ID'),
    ('Education', 'Transcripts, diplomas, course notes, and admission letters', 'Growth'),
    ('Business', 'Company formation, pitch decks, client proposals, and strategy', 'Commercial'),
    ('Shopping', 'Warranties, order confirmations, product research, and receipts', 'Commerce'),
    ('Personal', 'Personal notes, family moments, photos, and journal entries', 'Life'),
    ('Entertainment', 'Event tickets, movie reservations, and leisure activities', 'Leisure'),
    ('Research', 'Scientific papers, market research, articles, and references', 'Knowledge'),
    ('Knowledge', 'Tutorials, code snippets, documentation, and reference books', 'Learning')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS intent_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    intent_type_name VARCHAR(100) NOT NULL,
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    evidence TEXT,
    reasoning TEXT,
    prompt_version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS context_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL REFERENCES contexts(context_id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    prompt_version VARCHAR(50) DEFAULT '1.0.0',
    model_name VARCHAR(100) DEFAULT 'mock-llm-v1',
    changes_summary TEXT,
    token_usage JSONB DEFAULT '{}',
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contexts_vault ON contexts(vault_id);
CREATE INDEX IF NOT EXISTS idx_context_assets_context ON context_assets(context_id);
CREATE INDEX IF NOT EXISTS idx_context_assets_asset ON context_assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_context_events_context ON context_events(context_id);
CREATE INDEX IF NOT EXISTS idx_intent_predictions_asset ON intent_predictions(asset_id);
CREATE INDEX IF NOT EXISTS idx_intent_predictions_vault ON intent_predictions(vault_id);
