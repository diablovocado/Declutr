package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/sync/domain"
)

// SyncRepository defines persistence contract for sync queue, events, conflicts, device checkpoints, and stats
type SyncRepository interface {
	EnqueueItems(items []*domain.SyncQueueItem) error
	ListQueue(vaultID string, status domain.QueueStatus) ([]*domain.SyncQueueItem, error)
	UpdateQueueItemStatus(queueID string, status domain.QueueStatus, errMsg string) error
	ClearQueueItem(queueID string) error

	AppendSyncEvent(evt *domain.SyncEvent) error
	GetSyncEventsSince(vaultID string, sinceSeq int64, limit int) ([]*domain.SyncEvent, int64, error)

	SaveConflict(conflict *domain.SyncConflict) error
	ListConflicts(vaultID string) ([]*domain.SyncConflict, error)
	GetConflict(conflictID string) (*domain.SyncConflict, error)
	ResolveConflict(conflictID string, resolution domain.ConflictStatus, payload map[string]interface{}) error

	SaveDeviceState(state *domain.DeviceState) error
	GetDeviceState(deviceID string) (*domain.DeviceState, error)

	GetStats(vaultID string) (*domain.SyncStats, error)
	ClearAllData(vaultID string) error
}

// InMemorySyncRepository is a thread-safe in-memory store
type InMemorySyncRepository struct {
	mu           sync.RWMutex
	queue        map[string]*domain.SyncQueueItem // queueID -> Item
	events       []*domain.SyncEvent              // ordered list of sequence events
	conflicts    map[string]*domain.SyncConflict  // conflictID -> Conflict
	deviceStates map[string]*domain.DeviceState   // deviceID -> State
	seqCounter   int64
}

// NewInMemorySyncRepository creates a new in-memory sync repository
func NewInMemorySyncRepository() *InMemorySyncRepository {
	return &InMemorySyncRepository{
		queue:        make(map[string]*domain.SyncQueueItem),
		conflicts:    make(map[string]*domain.SyncConflict),
		deviceStates: make(map[string]*domain.DeviceState),
		seqCounter:   100,
	}
}

func (r *InMemorySyncRepository) EnqueueItems(items []*domain.SyncQueueItem) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, item := range items {
		r.queue[item.QueueID] = item
	}
	return nil
}

func (r *InMemorySyncRepository) ListQueue(vaultID string, status domain.QueueStatus) ([]*domain.SyncQueueItem, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.SyncQueueItem
	for _, item := range r.queue {
		if item.VaultID == vaultID {
			if status == "" || item.Status == status {
				list = append(list, item)
			}
		}
	}
	if len(list) == 0 {
		list = defaultSampleQueue(vaultID)
		for _, item := range list {
			r.queue[item.QueueID] = item
		}
	}
	return list, nil
}

func (r *InMemorySyncRepository) UpdateQueueItemStatus(queueID string, status domain.QueueStatus, errMsg string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	item, ok := r.queue[queueID]
	if !ok {
		return fmt.Errorf("queue item %s not found", queueID)
	}
	item.Status = status
	item.ErrorMsg = errMsg
	item.UpdatedAt = time.Now()
	return nil
}

func (r *InMemorySyncRepository) ClearQueueItem(queueID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.queue, queueID)
	return nil
}

func (r *InMemorySyncRepository) AppendSyncEvent(evt *domain.SyncEvent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.seqCounter++
	evt.SequenceNum = r.seqCounter
	r.events = append(r.events, evt)
	return nil
}

func (r *InMemorySyncRepository) GetSyncEventsSince(vaultID string, sinceSeq int64, limit int) ([]*domain.SyncEvent, int64, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if len(r.events) == 0 {
		r.events = defaultSampleEvents(vaultID, &r.seqCounter)
	}

	var list []*domain.SyncEvent
	var maxSeq int64 = sinceSeq
	for _, evt := range r.events {
		if evt.VaultID == vaultID && evt.SequenceNum > sinceSeq {
			list = append(list, evt)
			if evt.SequenceNum > maxSeq {
				maxSeq = evt.SequenceNum
			}
		}
	}
	if limit > 0 && len(list) > limit {
		list = list[:limit]
	}
	return list, maxSeq, nil
}

func (r *InMemorySyncRepository) SaveConflict(conflict *domain.SyncConflict) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.conflicts[conflict.ConflictID] = conflict
	return nil
}

func (r *InMemorySyncRepository) ListConflicts(vaultID string) ([]*domain.SyncConflict, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.SyncConflict
	for _, c := range r.conflicts {
		if c.VaultID == vaultID && c.Status == domain.ConflictUnresolved {
			list = append(list, c)
		}
	}
	if len(list) == 0 {
		list = defaultSampleConflicts(vaultID)
		for _, c := range list {
			r.conflicts[c.ConflictID] = c
		}
	}
	return list, nil
}

func (r *InMemorySyncRepository) GetConflict(conflictID string) (*domain.SyncConflict, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	c, ok := r.conflicts[conflictID]
	if !ok {
		return nil, fmt.Errorf("conflict %s not found", conflictID)
	}
	return c, nil
}

func (r *InMemorySyncRepository) ResolveConflict(conflictID string, resolution domain.ConflictStatus, payload map[string]interface{}) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	c, ok := r.conflicts[conflictID]
	if !ok {
		return fmt.Errorf("conflict %s not found", conflictID)
	}
	now := time.Now()
	c.Status = resolution
	c.ResolvedPayload = payload
	c.ResolvedAt = &now
	return nil
}

func (r *InMemorySyncRepository) SaveDeviceState(state *domain.DeviceState) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.deviceStates[state.DeviceID] = state
	return nil
}

func (r *InMemorySyncRepository) GetDeviceState(deviceID string) (*domain.DeviceState, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	st, ok := r.deviceStates[deviceID]
	if !ok {
		return &domain.DeviceState{
			StateID:       "st-" + deviceID,
			VaultID:       "vault-demo",
			DeviceID:      deviceID,
			LastPushedSeq: 102,
			LastPulledSeq: 105,
			LastSyncAt:    time.Now().Add(-5 * time.Minute),
			IsOnline:      true,
		}, nil
	}
	return st, nil
}

func (r *InMemorySyncRepository) GetStats(vaultID string) (*domain.SyncStats, error) {
	queue, _ := r.ListQueue(vaultID, domain.QueueQueued)
	conflicts, _ := r.ListConflicts(vaultID)

	return &domain.SyncStats{
		VaultID:              vaultID,
		TotalSyncedEvents:    int64(len(r.events)),
		PendingQueueCount:    len(queue),
		ActiveConflictsCount: len(conflicts),
		LastSyncDurationMs:   145,
		UpdatedAt:            time.Now(),
	}, nil
}

func (r *InMemorySyncRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.events = nil
	r.queue = make(map[string]*domain.SyncQueueItem)
	r.conflicts = make(map[string]*domain.SyncConflict)
	return nil
}

// Sample Data Generators
func defaultSampleQueue(vaultID string) []*domain.SyncQueueItem {
	now := time.Now()
	return []*domain.SyncQueueItem{
		{
			QueueID:      "q-item-1",
			VaultID:      vaultID,
			DeviceID:     "dev-macbook-pro",
			ResourceType: "ASSET_METADATA",
			ResourceID:   "asset-tax-2025",
			ChangeType:   domain.SyncUpdate,
			Status:       domain.QueueQueued,
			Payload:      map[string]interface{}{"status": "APPROVED", "updatedBy": "USER"},
			QueuedAt:     now.Add(-10 * time.Minute),
			UpdatedAt:    now.Add(-10 * time.Minute),
		},
	}
}

func defaultSampleEvents(vaultID string, seq *int64) []*domain.SyncEvent {
	now := time.Now()
	*seq++
	s1 := *seq
	*seq++
	s2 := *seq

	return []*domain.SyncEvent{
		{
			EventID:      "evt-101",
			VaultID:      vaultID,
			DeviceID:     "dev-macbook-pro",
			SequenceNum:  s1,
			ResourceType: "COLLECTION",
			ResourceID:   "col-travel-2024",
			ChangeType:   domain.SyncCreate,
			Payload:      map[string]interface{}{"title": "Tokyo Trip Photos"},
			Checksum:     "sha256-evt-101",
			CreatedAt:    now.Add(-2 * time.Hour),
		},
		{
			EventID:      "evt-102",
			VaultID:      vaultID,
			DeviceID:     "dev-iphone-15",
			SequenceNum:  s2,
			ResourceType: "MEMORY",
			ResourceID:   "mem-japan-flight",
			ChangeType:   domain.SyncUpdate,
			Payload:      map[string]interface{}{"note": "Flight ticket confirmed for 9am"},
			Checksum:     "sha256-evt-102",
			CreatedAt:    now.Add(-30 * time.Minute),
		},
	}
}

func defaultSampleConflicts(vaultID string) []*domain.SyncConflict {
	now := time.Now()
	return []*domain.SyncConflict{
		{
			ConflictID:   "cnf-tokyo-title-001",
			VaultID:      vaultID,
			DeviceID:     "dev-iphone-15",
			ResourceType: "COLLECTION",
			ResourceID:   "col-travel-2024",
			LocalPayload:  map[string]interface{}{"title": "Japan Vacation Notes (Mobile)", "category": "Travel"},
			RemotePayload: map[string]interface{}{"title": "Japan Vacation Notes (Web)", "tags": []string{"Japan", "2024"}},
			Strategy:     domain.StrategyLastWriteWins,
			Status:       domain.ConflictUnresolved,
			DetectedAt:   now.Add(-15 * time.Minute),
		},
	}
}
