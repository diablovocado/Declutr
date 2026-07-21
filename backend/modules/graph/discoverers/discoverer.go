package discoverers

import (
	"context"

	"github.com/diablovocado/declutr/modules/graph/domain"
)

type RelationshipDiscoverer interface {
	DiscoverEdges(ctx context.Context, vaultID, assetID string) ([]domain.GraphEdge, error)
}

// MockRelationshipDiscoverer provides deterministic relationships for testing.
type MockRelationshipDiscoverer struct{}

func NewMockRelationshipDiscoverer() *MockRelationshipDiscoverer {
	return &MockRelationshipDiscoverer{}
}

func (d *MockRelationshipDiscoverer) DiscoverEdges(ctx context.Context, vaultID, assetID string) ([]domain.GraphEdge, error) {
	// Mocks edges based on entities found
	return []domain.GraphEdge{
		{
			VaultID:         vaultID,
			SourceNodeID:    "node_asset_1",
			TargetNodeID:    "node_org_1",
			Relationship:    domain.TypeMentions,
			ConfidenceScore: 0.98,
			Strength:        1.0,
			DiscoveryMethod: "Mock_Entity_Overlap",
			Evidence: []domain.EdgeEvidence{
				{EvidenceText: "Document explicitly mentions Google LLC in the AI Summary."},
			},
		},
		{
			VaultID:         vaultID,
			SourceNodeID:    "node_asset_1",
			TargetNodeID:    "node_loc_1",
			Relationship:    domain.TypeLocatedAt,
			ConfidenceScore: 0.85,
			Strength:        0.8,
			DiscoveryMethod: "Mock_NER_Analysis",
			Evidence: []domain.EdgeEvidence{
				{EvidenceText: "Identified NYC as the primary location context for this file."},
			},
		},
	}, nil
}
