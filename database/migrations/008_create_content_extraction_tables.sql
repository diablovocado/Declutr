-- Migration 008: Create Content Extraction Tables

CREATE TABLE IF NOT EXISTS extracted_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    extractor VARCHAR(100) NOT NULL,
    extractor_version VARCHAR(50) NOT NULL,
    language VARCHAR(10),
    encoding VARCHAR(50),
    word_count INT DEFAULT 0,
    char_count INT DEFAULT 0,
    reading_time_seconds INT DEFAULT 0,
    content_hash VARCHAR(64),
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES extracted_documents(document_id) ON DELETE CASCADE,
    parent_section_id UUID REFERENCES document_sections(section_id) ON DELETE CASCADE,
    title TEXT,
    sequence_order INT NOT NULL,
    page_number INT
);

CREATE TABLE IF NOT EXISTS document_blocks (
    block_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES extracted_documents(document_id) ON DELETE CASCADE,
    section_id UUID REFERENCES document_sections(section_id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL, -- e.g., 'heading', 'paragraph', 'list', 'code', 'table'
    content TEXT NOT NULL,
    metadata JSONB, -- For extra attributes like heading level, language for code block, URL for links
    sequence_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES extracted_documents(document_id) ON DELETE CASCADE,
    extractor VARCHAR(100) NOT NULL,
    extractor_version VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ext_doc_asset_id ON extracted_documents(asset_id);
CREATE INDEX IF NOT EXISTS idx_doc_blocks_doc_id ON document_blocks(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_sections_doc_id ON document_sections(document_id);
