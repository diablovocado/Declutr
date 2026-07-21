package repository

import (
	"context"

	"github.com/diablovocado/declutr/modules/graph/domain"
)

type GraphRepository interface {
	SaveNode(ctx context.Context, node *domain.GraphNode) error
	GetNodeByReference(ctx context.Context, vaultID, referenceID string) (*domain.GraphNode, error)
	
	SaveEdge(ctx context.Context, edge *domain.GraphEdge) error
	GetEdgesForNode(ctx context.Context, vaultID, nodeID string) ([]*domain.GraphEdge, error)
	GetEdgeByID(ctx context.Context, vaultID, edgeID string) (*domain.GraphEdge, error)

	SaveEvidence(ctx context.Context, evidence *domain.EdgeEvidence) error
}

type DefaultGraphRepository struct {
	// DB Conn
}

func NewGraphRepository() *DefaultGraphRepository {
	return &DefaultGraphRepository{}
}

func (r *DefaultGraphRepository) SaveNode(ctx context.Context, node *domain.GraphNode) error {
	return nil
}

func (r *DefaultGraphRepository) GetNodeByReference(ctx context.Context, vaultID, referenceID string) (*domain.GraphNode, error) {
	return nil, nil
}

func (r *DefaultGraphRepository) SaveEdge(ctx context.Context, edge *domain.GraphEdge) error {
	return nil
}

func (r *DefaultGraphRepository) GetEdgesForNode(ctx context.Context, vaultID, nodeID string) ([]*domain.GraphEdge, error) {
	return nil, nil
}

func (r *DefaultGraphRepository) GetEdgeByID(ctx context.Context, vaultID, edgeID string) (*domain.GraphEdge, error) {
	return nil, nil
}

func (r *DefaultGraphRepository) SaveEvidence(ctx context.Context, evidence *domain.EdgeEvidence) error {
	return nil
}
