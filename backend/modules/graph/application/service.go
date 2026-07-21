package application

import (
	"context"
	"fmt"
	"time"

	"github.com/diablovocado/declutr/modules/graph/discoverers"
	"github.com/diablovocado/declutr/modules/graph/domain"
	"github.com/diablovocado/declutr/modules/graph/repository"
)

type GraphService interface {
	DiscoverAndStoreRelationships(ctx context.Context, vaultID, assetID string) error
	GetRelationshipsForNode(ctx context.Context, vaultID, nodeID string) ([]*domain.GraphEdge, error)
}

type DefaultGraphService struct {
	repo       repository.GraphRepository
	discoverer discoverers.RelationshipDiscoverer
}

func NewGraphService(repo repository.GraphRepository, discoverer discoverers.RelationshipDiscoverer) *DefaultGraphService {
	return &DefaultGraphService{
		repo:       repo,
		discoverer: discoverer,
	}
}

func (s *DefaultGraphService) DiscoverAndStoreRelationships(ctx context.Context, vaultID, assetID string) error {
	edges, err := s.discoverer.DiscoverEdges(ctx, vaultID, assetID)
	if err != nil {
		return fmt.Errorf("failed to discover edges: %w", err)
	}

	for _, edge := range edges {
		// Mock ID generation
		edge.EdgeID = "edge_" + fmt.Sprintf("%d", time.Now().UnixNano())
		edge.CreatedAt = time.Now()
		edge.UpdatedAt = time.Now()

		if err := s.repo.SaveEdge(ctx, &edge); err != nil {
			return err
		}

		for _, ev := range edge.Evidence {
			ev.EvidenceID = "ev_" + fmt.Sprintf("%d", time.Now().UnixNano())
			ev.EdgeID = edge.EdgeID
			ev.CreatedAt = time.Now()
			if err := s.repo.SaveEvidence(ctx, &ev); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *DefaultGraphService) GetRelationshipsForNode(ctx context.Context, vaultID, nodeID string) ([]*domain.GraphEdge, error) {
	return s.repo.GetEdgesForNode(ctx, vaultID, nodeID)
}
