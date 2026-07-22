package application

import (
	"fmt"
	"log"
)

// MemoryEngine orchestrates the full memory lifecycle for a vault
type MemoryEngine struct {
	service *MemoryService
}

// NewMemoryEngine creates a new MemoryEngine
func NewMemoryEngine(service *MemoryService) *MemoryEngine {
	return &MemoryEngine{service: service}
}

// ProcessVault runs one full incremental memory cycle for a vault:
//  1. Apply recency decay to all existing memories
//  2. Consolidate related memories into clusters
//  3. Promote/demote memory types based on updated strengths
//
// This is designed for incremental updates — it never rebuilds everything from scratch.
func (e *MemoryEngine) ProcessVault(vaultID string) error {
	log.Printf("[MemoryEngine] Starting incremental memory cycle for vault: %s", vaultID)

	// Step 1: Apply decay to existing memories
	if err := e.service.ApplyDecay(vaultID); err != nil {
		return fmt.Errorf("memory engine: decay failed for vault %s: %w", vaultID, err)
	}
	log.Printf("[MemoryEngine] Decay applied for vault: %s", vaultID)

	// Step 2: Consolidate memories into clusters
	if err := e.service.ConsolidateMemories(vaultID); err != nil {
		return fmt.Errorf("memory engine: consolidation failed for vault %s: %w", vaultID, err)
	}
	log.Printf("[MemoryEngine] Consolidation complete for vault: %s", vaultID)

	stats, _ := e.service.GetStats(vaultID)
	if stats != nil {
		log.Printf("[MemoryEngine] Vault %s: %d total memories | LT=%d | Working=%d | Archived=%d | Pinned=%d",
			vaultID, stats.TotalMemories, stats.LongTerm, stats.Working, stats.Archived, stats.Pinned)
	}

	return nil
}
