package application

import (
	"context"
	"fmt"
	"log"

	"github.com/diablovocado/declutr/modules/versioning/domain"
)

// TimeMachineRecoveryEngine orchestrates automatic state snapshots, diff computing, and recovery jobs
type TimeMachineRecoveryEngine struct {
	service *VersioningService
}

// NewTimeMachineRecoveryEngine creates a new TimeMachineRecoveryEngine
func NewTimeMachineRecoveryEngine(service *VersioningService) *TimeMachineRecoveryEngine {
	return &TimeMachineRecoveryEngine{service: service}
}

// CaptureAutoSnapshot records an automatic version snapshot after a resource mutation
func (e *TimeMachineRecoveryEngine) CaptureAutoSnapshot(ctx context.Context, vaultID string, resType domain.ResourceType, resID string, summary string, payload map[string]interface{}) error {
	log.Printf("[TimeMachineRecoveryEngine] Capturing auto snapshot for %s (%s)", resID, resType)

	_, err := e.service.CreateSnapshot(ctx, &domain.CreateSnapshotRequest{
		VaultID:      vaultID,
		ResourceType: resType,
		ResourceID:   resID,
		ChangeType:   domain.ChangeUpdated,
		Summary:      summary,
		SnapshotData: payload,
	})
	if err != nil {
		return fmt.Errorf("auto snapshot capture failed: %w", err)
	}
	return nil
}
