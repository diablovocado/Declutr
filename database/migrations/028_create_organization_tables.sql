-- Migration: 028_create_organization_tables.sql
-- Description: Enterprise Organizations, Multi-Tenancy, Workspaces, RBAC, Groups, Policies & SSO Framework

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    owner_id VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    domains JSONB DEFAULT '[]'::jsonb,
    time_zone VARCHAR(100) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations (slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations (owner_id);

-- 2. Organization Members Table
CREATE TABLE IF NOT EXISTS organization_members (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id VARCHAR(255) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_org_user UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_user ON organization_members (organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_status ON organization_members (organization_id, status);

-- 3. Organization Roles Table (RBAC)
CREATE TABLE IF NOT EXISTS organization_roles (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_roles_org ON organization_roles (organization_id);

-- 4. Organization Groups Table (Teams & Departments)
CREATE TABLE IF NOT EXISTS organization_groups (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'TEAM', -- TEAM, DEPARTMENT, DYNAMIC
    description TEXT,
    role_ids JSONB DEFAULT '[]'::jsonb,
    member_user_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_groups_org ON organization_groups (organization_id);

-- 5. Workspaces Table
CREATE TABLE IF NOT EXISTS workspace_memberships (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    vault_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'ORGANIZATION', -- PERSONAL, ORGANIZATION, DEPARTMENT, SHARED, ARCHIVED
    department VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workspace_org_vault ON workspace_memberships (organization_id, vault_id);

-- 6. Organization Governance & Security Policies Table
CREATE TABLE IF NOT EXISTS organization_policies (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_org_policy UNIQUE (organization_id, type)
);

-- 7. SSO Configuration Table
CREATE TABLE IF NOT EXISTS sso_configurations (
    id VARCHAR(255) PRIMARY KEY,
    organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
    provider_type VARCHAR(50) NOT NULL, -- SAML, OIDC, AZURE_AD, GOOGLE_WORKSPACE, OKTA
    is_enabled BOOLEAN DEFAULT false,
    issuer_url TEXT NOT NULL,
    client_id TEXT NOT NULL,
    metadata_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Add Multi-Tenant organization_id Columns to Core Tables
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS organization_id VARCHAR(255);
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS organization_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_vaults_org_id ON vaults (organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_org_id ON audit_events (organization_id);
