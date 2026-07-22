package repository

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/context/domain"
)

type ContextRepository interface {
	SaveContext(ctx context.Context, c *domain.Context) error
	GetContextByID(ctx context.Context, vaultID, contextID string) (*domain.Context, error)
	GetContextsByVault(ctx context.Context, vaultID string, contextType string, status string) ([]*domain.Context, error)
	FindMatchingContext(ctx context.Context, vaultID, name, contextType string) (*domain.Context, error)
	
	SaveContextAsset(ctx context.Context, ca *domain.ContextAsset) error
	GetAssetsByContext(ctx context.Context, contextID string) ([]*domain.ContextAsset, error)
	GetContextsByAsset(ctx context.Context, vaultID, assetID string) ([]*domain.ContextAsset, error)
	
	SaveContextEvent(ctx context.Context, ce *domain.ContextEvent) error
	GetEventsByContext(ctx context.Context, contextID string) ([]*domain.ContextEvent, error)
	
	SaveIntentPrediction(ctx context.Context, ip *domain.IntentPrediction) error
	GetIntentPredictionByAsset(ctx context.Context, vaultID, assetID string) (*domain.IntentPrediction, error)
	
	SaveContextVersion(ctx context.Context, cv *domain.ContextVersion) error
	GetVersionsByContext(ctx context.Context, contextID string) ([]*domain.ContextVersion, error)
	
	GetStats(ctx context.Context, vaultID string) (*domain.ContextStats, error)
}

type InMemoryContextRepository struct {
	mu            sync.RWMutex
	contexts      map[string]*domain.Context            // contextID -> Context
	contextAssets map[string]*domain.ContextAsset          // id -> ContextAsset
	contextEvents map[string]*domain.ContextEvent          // eventID -> ContextEvent
	intents       map[string]*domain.IntentPrediction      // assetID -> IntentPrediction
	versions      map[string][]*domain.ContextVersion      // contextID -> []ContextVersion
}

func NewInMemoryContextRepository() *InMemoryContextRepository {
	return &InMemoryContextRepository{
		contexts:      make(map[string]*domain.Context),
		contextAssets: make(map[string]*domain.ContextAsset),
		contextEvents: make(map[string]*domain.ContextEvent),
		intents:       make(map[string]*domain.IntentPrediction),
		versions:      make(map[string][]*domain.ContextVersion),
	}
}

func (r *InMemoryContextRepository) SaveContext(ctx context.Context, c *domain.Context) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if c.CreatedAt.IsZero() {
		c.CreatedAt = time.Now()
	}
	c.UpdatedAt = time.Now()
	r.contexts[c.ContextID] = c
	return nil
}

func (r *InMemoryContextRepository) GetContextByID(ctx context.Context, vaultID, contextID string) (*domain.Context, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	c, exists := r.contexts[contextID]
	if !exists || (vaultID != "" && c.VaultID != vaultID) {
		return nil, fmt.Errorf("context not found")
	}
	return c, nil
}

func (r *InMemoryContextRepository) GetContextsByVault(ctx context.Context, vaultID string, contextType string, status string) ([]*domain.Context, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*domain.Context
	for _, c := range r.contexts {
		if vaultID != "" && c.VaultID != vaultID {
			continue
		}
		if contextType != "" && c.Type != contextType {
			continue
		}
		if status != "" && string(c.Status) != status {
			continue
		}
		result = append(result, c)
	}
	return result, nil
}

func (r *InMemoryContextRepository) FindMatchingContext(ctx context.Context, vaultID, name, contextType string) (*domain.Context, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, c := range r.contexts {
		if c.VaultID == vaultID && (c.Name == name || (contextType != "" && c.Type == contextType)) {
			return c, nil
		}
	}
	return nil, nil
}

func (r *InMemoryContextRepository) SaveContextAsset(ctx context.Context, ca *domain.ContextAsset) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if ca.AddedAt.IsZero() {
		ca.AddedAt = time.Now()
	}
	r.contextAssets[ca.ID] = ca
	return nil
}

func (r *InMemoryContextRepository) GetAssetsByContext(ctx context.Context, contextID string) ([]*domain.ContextAsset, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*domain.ContextAsset
	for _, ca := range r.contextAssets {
		if ca.ContextID == contextID {
			result = append(result, ca)
		}
	}
	return result, nil
}

func (r *InMemoryContextRepository) GetContextsByAsset(ctx context.Context, vaultID, assetID string) ([]*domain.ContextAsset, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*domain.ContextAsset
	for _, ca := range r.contextAssets {
		if ca.AssetID == assetID {
			// Validate vaultID if context exists
			if c, ok := r.contexts[ca.ContextID]; ok && (vaultID == "" || c.VaultID == vaultID) {
				result = append(result, ca)
			}
		}
	}
	return result, nil
}

func (r *InMemoryContextRepository) SaveContextEvent(ctx context.Context, ce *domain.ContextEvent) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if ce.CreatedAt.IsZero() {
		ce.CreatedAt = time.Now()
	}
	r.contextEvents[ce.EventID] = ce
	return nil
}

func (r *InMemoryContextRepository) GetEventsByContext(ctx context.Context, contextID string) ([]*domain.ContextEvent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*domain.ContextEvent
	for _, ce := range r.contextEvents {
		if ce.ContextID == contextID {
			result = append(result, ce)
		}
	}
	return result, nil
}

func (r *InMemoryContextRepository) SaveIntentPrediction(ctx context.Context, ip *domain.IntentPrediction) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if ip.CreatedAt.IsZero() {
		ip.CreatedAt = time.Now()
	}
	r.intents[ip.AssetID] = ip
	return nil
}

func (r *InMemoryContextRepository) GetIntentPredictionByAsset(ctx context.Context, vaultID, assetID string) (*domain.IntentPrediction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	ip, ok := r.intents[assetID]
	if !ok || (vaultID != "" && ip.VaultID != vaultID) {
		return nil, fmt.Errorf("intent prediction not found")
	}
	return ip, nil
}

func (r *InMemoryContextRepository) SaveContextVersion(ctx context.Context, cv *domain.ContextVersion) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if cv.CreatedAt.IsZero() {
		cv.CreatedAt = time.Now()
	}
	r.versions[cv.ContextID] = append(r.versions[cv.ContextID], cv)
	return nil
}

func (r *InMemoryContextRepository) GetVersionsByContext(ctx context.Context, contextID string) ([]*domain.ContextVersion, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.versions[contextID], nil
}

func (r *InMemoryContextRepository) GetStats(ctx context.Context, vaultID string) (*domain.ContextStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	intentBreakdown := make(map[string]int)
	totalContexts := 0
	activeContexts := 0
	var totalConfidence float64

	for _, c := range r.contexts {
		if vaultID != "" && c.VaultID != vaultID {
			continue
		}
		totalContexts++
		if c.Status == domain.StatusActive {
			activeContexts++
		}
		totalConfidence += c.ConfidenceScore
	}

	for _, ip := range r.intents {
		if vaultID != "" && ip.VaultID != vaultID {
			continue
		}
		intentBreakdown[ip.IntentTypeName]++
	}

	totalEvents := 0
	for _, ce := range r.contextEvents {
		if c, ok := r.contexts[ce.ContextID]; ok && (vaultID == "" || c.VaultID == vaultID) {
			totalEvents++
		}
	}

	avgConf := 0.0
	if totalContexts > 0 {
		avgConf = totalConfidence / float64(totalContexts)
	}

	return &domain.ContextStats{
		TotalContexts:     totalContexts,
		ActiveContexts:    activeContexts,
		TotalEvents:       totalEvents,
		IntentBreakdown:   intentBreakdown,
		AverageConfidence: avgConf,
	}, nil
}
