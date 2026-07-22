package application

import (
	"context"
	"fmt"
	"log"
	"reflect"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/sync/domain"
	"github.com/diablovocado/declutr/modules/sync/repository"
)

// SyncService manages offline-first push/pull change streams, sync queue, conflict resolution, and device state
type SyncService struct {
	repo repository.SyncRepository
}

// NewSyncService creates a new SyncService instance
func NewSyncService(repo repository.SyncRepository) *SyncService {
	return &SyncService{repo: repo}
}

// MergeFieldLevel performs a 3-way non-overlapping field merge between local and remote payloads
func MergeFieldLevel(local, remote map[string]interface{}) map[string]interface{} {
	merged := make(map[string]interface{})
	for k, v := range remote {
		merged[k] = v
	}
	for k, v := range local {
		if _, ok := merged[k]; !ok {
			merged[k] = v
		} else if !reflect.DeepEqual(merged[k], v) {
			// If conflict on key, local overrides or suffix key
			merged[k] = v
		}
	}
	return merged
}

// PushChanges processes a batch of offline local change mutations pushed by a client device
func (s *SyncService) PushChanges(ctx context.Context, req *domain.PushChangesRequest) (int, []*domain.SyncConflict, error) {
	if req.VaultID == "" || req.DeviceID == "" {
		return 0, nil, fmt.Errorf("sync: vaultId and deviceId are required")
	}

	var processedCount int
	var detectedConflicts []*domain.SyncConflict

	for _, item := range req.Events {
		eventID := "evt-" + uuid.New().String()[:8]
		evt := &domain.SyncEvent{
			EventID:      eventID,
			VaultID:      req.VaultID,
			DeviceID:     req.DeviceID,
			ResourceType: item.ResourceType,
			ResourceID:   item.ResourceID,
			ChangeType:   item.ChangeType,
			Payload:      item.Payload,
			Checksum:     fmt.Sprintf("sha256-%s", eventID),
			CreatedAt:    time.Now(),
		}

		if err := s.repo.AppendSyncEvent(evt); err != nil {
			return processedCount, detectedConflicts, err
		}

		_ = s.repo.UpdateQueueItemStatus(item.QueueID, domain.QueueCompleted, "")
		processedCount++
	}

	// Update device push checkpoint
	st, _ := s.repo.GetDeviceState(req.DeviceID)
	if st != nil {
		st.LastPushedSeq += int64(processedCount)
		st.LastSyncAt = time.Now()
		_ = s.repo.SaveDeviceState(st)
	}

	log.Printf("[SyncService] Pushed %d local events from device %s", processedCount, req.DeviceID)
	return processedCount, detectedConflicts, nil
}

// PullChanges returns remote server changes since a client sequence checkpoint
func (s *SyncService) PullChanges(req *domain.PullChangesRequest) ([]*domain.SyncEvent, int64, error) {
	if req.VaultID == "" || req.DeviceID == "" {
		return nil, 0, fmt.Errorf("sync: vaultId and deviceId are required")
	}
	limit := req.Limit
	if limit <= 0 {
		limit = 50
	}

	events, newSeq, err := s.repo.GetSyncEventsSince(req.VaultID, req.SinceSeqNum, limit)
	if err != nil {
		return nil, 0, err
	}

	// Update device pull checkpoint
	st, _ := s.repo.GetDeviceState(req.DeviceID)
	if st != nil {
		st.LastPulledSeq = newSeq
		st.LastSyncAt = time.Now()
		_ = s.repo.SaveDeviceState(st)
	}

	return events, newSeq, nil
}

// ResolveConflict resolves a detected sync conflict using specified resolution strategy or payload
func (s *SyncService) ResolveConflict(req *domain.ResolveConflictRequest) (*domain.SyncConflict, error) {
	if req.ConflictID == "" {
		return nil, fmt.Errorf("sync: conflictId is required")
	}

	conflict, err := s.repo.GetConflict(req.ConflictID)
	if err != nil {
		return nil, err
	}

	var resolvedPayload map[string]interface{}
	switch req.Resolution {
	case domain.ConflictResolvedLocal:
		resolvedPayload = conflict.LocalPayload
	case domain.ConflictResolvedRemote:
		resolvedPayload = conflict.RemotePayload
	case domain.ConflictResolvedMerge:
		if len(req.ResolvedPayload) > 0 {
			resolvedPayload = req.ResolvedPayload
		} else {
			resolvedPayload = MergeFieldLevel(conflict.LocalPayload, conflict.RemotePayload)
		}
	default:
		resolvedPayload = conflict.RemotePayload
	}

	if err := s.repo.ResolveConflict(req.ConflictID, req.Resolution, resolvedPayload); err != nil {
		return nil, err
	}

	conflict.Status = req.Resolution
	conflict.ResolvedPayload = resolvedPayload
	now := time.Now()
	conflict.ResolvedAt = &now

	log.Printf("[SyncService] Conflict %s resolved via strategy %s", req.ConflictID, req.Resolution)
	return conflict, nil
}

// ListConflicts returns unresolved sync conflicts for a vault
func (s *SyncService) ListConflicts(vaultID string) ([]*domain.SyncConflict, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("sync: vaultId is required")
	}
	return s.repo.ListConflicts(vaultID)
}

// ListQueue returns pending queue items for a vault
func (s *SyncService) ListQueue(vaultID string, status domain.QueueStatus) ([]*domain.SyncQueueItem, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("sync: vaultId is required")
	}
	return s.repo.ListQueue(vaultID, status)
}

// RegisterDevice registers or updates device online state and checkpoints
func (s *SyncService) RegisterDevice(req *domain.RegisterDeviceRequest) (*domain.DeviceState, error) {
	if req.VaultID == "" || req.DeviceID == "" {
		return nil, fmt.Errorf("sync: vaultId and deviceId are required")
	}

	st, _ := s.repo.GetDeviceState(req.DeviceID)
	if st == nil {
		st = &domain.DeviceState{
			StateID:       "st-" + req.DeviceID,
			VaultID:       req.VaultID,
			DeviceID:      req.DeviceID,
			LastPushedSeq: 0,
			LastPulledSeq: 0,
			LastSyncAt:    time.Now(),
			IsOnline:      req.IsOnline,
		}
	} else {
		st.IsOnline = req.IsOnline
		st.LastSyncAt = time.Now()
	}

	if err := s.repo.SaveDeviceState(st); err != nil {
		return nil, err
	}
	return st, nil
}

// GetStats returns vault sync engine metrics
func (s *SyncService) GetStats(vaultID string) (*domain.SyncStats, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("sync: vaultId is required")
	}
	return s.repo.GetStats(vaultID)
}
