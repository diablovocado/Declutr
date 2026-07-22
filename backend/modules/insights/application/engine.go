package application

import (
	"context"
	"fmt"
	"log"
)

// KnowledgeInsightsEngine orchestrates timeline generation, milestone detection, and proactive insight discovery
type KnowledgeInsightsEngine struct {
	service *InsightsService
}

// NewKnowledgeInsightsEngine creates a new KnowledgeInsightsEngine
func NewKnowledgeInsightsEngine(service *InsightsService) *KnowledgeInsightsEngine {
	return &KnowledgeInsightsEngine{service: service}
}

// ProcessVault runs one full incremental insights and timeline intelligence cycle for a vault.
func (e *KnowledgeInsightsEngine) ProcessVault(ctx context.Context, vaultID string) error {
	log.Printf("[KnowledgeInsightsEngine] Starting incremental intelligence cycle for vault: %s", vaultID)

	if err := e.service.RefreshInsights(ctx, vaultID); err != nil {
		return fmt.Errorf("knowledge insights engine: refresh failed for vault %s: %w", vaultID, err)
	}

	stats, _ := e.service.GetStats(vaultID)
	if stats != nil {
		log.Printf("[KnowledgeInsightsEngine] Vault %s: %d timeline events | %d active insights | %d milestones (%d expirations)",
			vaultID, stats.TotalTimelineEvents, stats.TotalActiveInsights, stats.TotalMilestones, stats.UpcomingExpirations)
	}

	return nil
}
