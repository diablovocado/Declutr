package repository

import (
	"context"

	"github.com/diablovocado/declutr/modules/extraction/domain"
)

type ContentRepository interface {
	SaveDocument(ctx context.Context, doc *domain.Document) error
	GetDocument(ctx context.Context, assetID string) (*domain.Document, error)
	
	SaveSections(ctx context.Context, sections []domain.Section) error
	GetSections(ctx context.Context, documentID string) ([]domain.Section, error)
	
	SaveBlocks(ctx context.Context, blocks []domain.Block) error
	GetBlocks(ctx context.Context, documentID string) ([]domain.Block, error)
	
	SaveVersion(ctx context.Context, version *domain.DocumentVersion) error
	GetVersionHistory(ctx context.Context, documentID string) ([]*domain.DocumentVersion, error)
}

type DefaultContentRepository struct {
	// DB conn
}

func NewContentRepository() *DefaultContentRepository {
	return &DefaultContentRepository{}
}

func (r *DefaultContentRepository) SaveDocument(ctx context.Context, doc *domain.Document) error {
	// Persist to extracted_documents
	return nil
}

func (r *DefaultContentRepository) GetDocument(ctx context.Context, assetID string) (*domain.Document, error) {
	return nil, nil
}

func (r *DefaultContentRepository) SaveSections(ctx context.Context, sections []domain.Section) error {
	return nil
}

func (r *DefaultContentRepository) GetSections(ctx context.Context, documentID string) ([]domain.Section, error) {
	return nil, nil
}

func (r *DefaultContentRepository) SaveBlocks(ctx context.Context, blocks []domain.Block) error {
	return nil
}

func (r *DefaultContentRepository) GetBlocks(ctx context.Context, documentID string) ([]domain.Block, error) {
	return nil, nil
}

func (r *DefaultContentRepository) SaveVersion(ctx context.Context, version *domain.DocumentVersion) error {
	return nil
}

func (r *DefaultContentRepository) GetVersionHistory(ctx context.Context, documentID string) ([]*domain.DocumentVersion, error) {
	return nil, nil
}
