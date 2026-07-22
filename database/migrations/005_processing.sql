-- 005_processing.sql
-- Asset processing jobs, text extraction, OCR, background ingestion

CREATE TABLE IF NOT EXISTS asset_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    job_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    error_message TEXT,
    result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID UNIQUE NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    extracted_text TEXT,
    language VARCHAR(20),
    page_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_asset_id ON asset_processing_jobs(asset_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON asset_processing_jobs(status);
