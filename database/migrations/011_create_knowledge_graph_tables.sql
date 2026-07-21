-- Migration 011: Create Knowledge Graph Tables

CREATE TABLE IF NOT EXISTS graph_nodes (
    node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    node_type VARCHAR(50) NOT NULL, -- 'Asset', 'Entity', 'Collection'
    reference_id UUID NOT NULL,     -- The actual ID of the Asset, Entity, or Collection
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vault_id, node_type, reference_id)
);

CREATE TABLE IF NOT EXISTS graph_edges (
    edge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES graph_nodes(node_id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES graph_nodes(node_id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- e.g. MENTIONS, LOCATED_AT, RELATED_TO
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    strength FLOAT NOT NULL DEFAULT 1.0,
    discovery_method VARCHAR(100), -- 'AI_Analysis', 'Entity_Overlap', 'Manual'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_node_id, target_node_id, relationship_type)
);

CREATE TABLE IF NOT EXISTS graph_edge_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edge_id UUID NOT NULL REFERENCES graph_edges(edge_id) ON DELETE CASCADE,
    evidence_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS graph_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(vault_id) ON DELETE CASCADE,
    nodes_count INT NOT NULL DEFAULT 0,
    edges_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_graph_nodes_vault ON graph_nodes(vault_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_vault ON graph_edges(vault_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_node_id);
