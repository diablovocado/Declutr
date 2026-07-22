package application

import (
	"context"
	"fmt"
	"log"

	"github.com/diablovocado/declutr/modules/sync/domain"
)

// SyncEngine orchestrates background queue processing, WebSocket/SSE push notifications, and conflict detection
type SyncEngine struct {
	service *SyncService
}

// NewSyncEngine creates a new SyncEngine instance
func NewSyncEngine(service *SyncService) *SyncEngine {
	return &SyncEngine{service: service}
}

// ProcessQueue flushes pending queued mutations when connectivity is restored
func (e *SyncEngine) ProcessQueue(ctx context.Context, vaultID string, deviceID string) (int, error) {
	log.Printf("[SyncEngine] Flushing pending sync queue for vault %s on device %s", vaultID, deviceID)

	pending, err := e.service.ListQueue(vaultID, domain.QueueQueued)
	if err != nil || len(pending) == 0 {
		return 0, nil
	}

	count, _, err := e.service.PushChanges(ctx, &domain.PushChangesRequest{
		VaultID:  vaultID,
		DeviceID: deviceID,
		Events:   pending,
	})
	if err != nil {
		return count, fmt.Errorf("queue processing failed: %w", err)
	}
	return count, nil
}
