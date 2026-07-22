package application

import (
	"fmt"
	"log"
)

// PersonaEngine orchestrates the persona learning pipeline
type PersonaEngine struct {
	service *PersonaService
}

// NewPersonaEngine creates a new PersonaEngine
func NewPersonaEngine(service *PersonaService) *PersonaEngine {
	return &PersonaEngine{service: service}
}

// ProcessVault runs a full incremental persona update cycle for a vault.
// This is designed for efficient incremental updates — it never rebuilds from scratch.
func (e *PersonaEngine) ProcessVault(vaultID string) error {
	log.Printf("[PersonaEngine] Starting incremental learning for vault: %s", vaultID)

	// Step 1: Score signals and apply recency decay
	if err := e.service.ScoreAndLearn(vaultID); err != nil {
		return fmt.Errorf("persona engine: score and learn failed for vault %s: %w", vaultID, err)
	}
	log.Printf("[PersonaEngine] Scoring and decay applied for vault: %s", vaultID)

	// Step 2: Rebuild persona profile from updated scores
	if err := e.service.BuildPersonaProfile(vaultID); err != nil {
		return fmt.Errorf("persona engine: profile build failed for vault %s: %w", vaultID, err)
	}
	log.Printf("[PersonaEngine] Persona profile updated for vault: %s", vaultID)

	// Step 3: Generate fresh recommendations
	recs, err := e.service.GenerateRecommendations(vaultID)
	if err != nil {
		return fmt.Errorf("persona engine: recommendation generation failed for vault %s: %w", vaultID, err)
	}
	log.Printf("[PersonaEngine] Generated %d recommendations for vault: %s", len(recs), vaultID)

	return nil
}
