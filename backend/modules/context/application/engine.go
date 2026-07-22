package application

import (
	"context"
	"fmt"

	"github.com/diablovocado/declutr/modules/context/domain"
)

type ContextEngine interface {
	ProcessAssetContext(ctx context.Context, vaultID, assetID string) error
	GetAssetIntent(ctx context.Context, vaultID, assetID string) (*domain.IntentPrediction, error)
	GetVaultContexts(ctx context.Context, vaultID string, contextType string, status string) ([]*domain.Context, error)
}

type DefaultContextEngine struct {
	service ContextService
}

func NewContextEngine(service ContextService) *DefaultContextEngine {
	return &DefaultContextEngine{service: service}
}

func (e *DefaultContextEngine) ProcessAssetContext(ctx context.Context, vaultID, assetID string) error {
	if assetID == "" {
		return fmt.Errorf("assetID cannot be empty")
	}
	return e.service.PredictIntentAndContext(ctx, vaultID, assetID)
}

func (e *DefaultContextEngine) GetAssetIntent(ctx context.Context, vaultID, assetID string) (*domain.IntentPrediction, error) {
	return e.service.GetIntentForAsset(ctx, vaultID, assetID)
}

func (e *DefaultContextEngine) GetVaultContexts(ctx context.Context, vaultID string, contextType string, status string) ([]*domain.Context, error) {
	return e.service.GetContexts(ctx, vaultID, contextType, status)
}
