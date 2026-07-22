-- Migration: 030_create_extension_tables.sql
-- Description: Extension Platform, Capability Registry, Sandbox, Permissions & Marketplace Database Tables

-- 1. Extension Publishers Table
CREATE TABLE IF NOT EXISTS extension_publishers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Extensions Table (Marketplace Catalog)
CREATE TABLE IF NOT EXISTS extensions (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    publisher_id VARCHAR(255) NOT NULL REFERENCES extension_publishers(id) ON DELETE CASCADE,
    manifest JSONB NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    downloads_count INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_extensions_slug ON extensions (slug);
CREATE INDEX IF NOT EXISTS idx_extensions_publisher ON extensions (publisher_id);

-- 3. Extension Versions Table
CREATE TABLE IF NOT EXISTS extension_versions (
    id VARCHAR(255) PRIMARY KEY,
    extension_id VARCHAR(255) NOT NULL REFERENCES extensions(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    manifest JSONB NOT NULL,
    bundle_url TEXT NOT NULL,
    release_notes TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_extension_version UNIQUE (extension_id, version)
);

CREATE INDEX IF NOT EXISTS idx_ext_versions_ext ON extension_versions (extension_id);

-- 4. Extension Installations Table
CREATE TABLE IF NOT EXISTS extension_installations (
    id VARCHAR(255) PRIMARY KEY,
    extension_id VARCHAR(255) NOT NULL REFERENCES extensions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    organization_id VARCHAR(255),
    installed_version VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'INSTALLED', -- INSTALLED, ENABLED, DISABLED, ERROR, UNINSTALLED
    approved_permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_ext_install UNIQUE (user_id, extension_id)
);

CREATE INDEX IF NOT EXISTS idx_ext_install_user ON extension_installations (user_id);
CREATE INDEX IF NOT EXISTS idx_ext_install_status ON extension_installations (status);

-- 5. Extension Reviews Table
CREATE TABLE IF NOT EXISTS extension_reviews (
    id VARCHAR(255) PRIMARY KEY,
    extension_id VARCHAR(255) NOT NULL REFERENCES extensions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ext_reviews_ext ON extension_reviews (extension_id);

-- 6. Extension Permissions Master Reference Table
CREATE TABLE IF NOT EXISTS extension_permissions (
    id VARCHAR(255) PRIMARY KEY,
    extension_id VARCHAR(255) NOT NULL REFERENCES extensions(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL
);

-- 7. Extension Statistics & Observability Telemetry Table
CREATE TABLE IF NOT EXISTS extension_statistics (
    extension_id VARCHAR(255) PRIMARY KEY REFERENCES extensions(id) ON DELETE CASCADE,
    installs_count INT DEFAULT 0,
    active_users INT DEFAULT 0,
    crashes_count INT DEFAULT 0,
    avg_latency_ms INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
