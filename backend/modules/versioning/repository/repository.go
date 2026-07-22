package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/versioning/domain"
)

// VersioningRepository defines persistence contract for versions, snapshots, recycle bin, and diffs
type VersioningRepository interface {
	CreateVersion(ver *domain.ResourceVersion, snap *domain.VersionSnapshot) error
	GetVersion(versionID string) (*domain.ResourceVersion, error)
	GetSnapshot(versionID string) (*domain.VersionSnapshot, error)
	ListVersions(resourceID string) ([]*domain.ResourceVersion, error)
	ListAllVersions(vaultID string) ([]*domain.ResourceVersion, error)
	DeleteVersion(versionID string) error

	AddToRecycleBin(item *domain.RecycleItem) error
	ListRecycleBin(vaultID string) ([]*domain.RecycleItem, error)
	RestoreFromRecycleBin(recycleID string) error
	PurgeRecycleItem(recycleID string) error

	SaveDiff(diff *domain.VersionDiff) error
	GetDiff(sourceVersionID, targetVersionID string) (*domain.VersionDiff, error)

	GetStats(vaultID string) (*domain.VersioningStats, error)
	ClearAllData(vaultID string) error
}

// InMemoryVersioningRepository is a thread-safe in-memory store
type InMemoryVersioningRepository struct {
	mu         sync.RWMutex
	versions   map[string]*domain.ResourceVersion // verID -> Version
	snapshots  map[string]*domain.VersionSnapshot // verID -> Snapshot
	recycleBin map[string]*domain.RecycleItem     // recycleID -> Item
	diffs      map[string]*domain.VersionDiff     // key -> Diff
}

// NewInMemoryVersioningRepository creates a new in-memory versioning repository
func NewInMemoryVersioningRepository() *InMemoryVersioningRepository {
	return &InMemoryVersioningRepository{
		versions:   make(map[string]*domain.ResourceVersion),
		snapshots:  make(map[string]*domain.VersionSnapshot),
		recycleBin: make(map[string]*domain.RecycleItem),
		diffs:      make(map[string]*domain.VersionDiff),
	}
}

func (r *InMemoryVersioningRepository) CreateVersion(ver *domain.ResourceVersion, snap *domain.VersionSnapshot) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.versions[ver.VersionID] = ver
	if snap != nil {
		r.snapshots[ver.VersionID] = snap
	}
	return nil
}

func (r *InMemoryVersioningRepository) GetVersion(versionID string) (*domain.ResourceVersion, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	v, ok := r.versions[versionID]
	if !ok {
		return nil, fmt.Errorf("version %s not found", versionID)
	}
	return v, nil
}

func (r *InMemoryVersioningRepository) GetSnapshot(versionID string) (*domain.VersionSnapshot, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	snap, ok := r.snapshots[versionID]
	if !ok {
		return nil, fmt.Errorf("snapshot for version %s not found", versionID)
	}
	return snap, nil
}

func (r *InMemoryVersioningRepository) ListVersions(resourceID string) ([]*domain.ResourceVersion, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var list []*domain.ResourceVersion
	for _, v := range r.versions {
		if v.ResourceID == resourceID {
			list = append(list, v)
		}
	}
	return list, nil
}

func (r *InMemoryVersioningRepository) ListAllVersions(vaultID string) ([]*domain.ResourceVersion, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.ResourceVersion
	for _, v := range r.versions {
		if v.VaultID == vaultID {
			list = append(list, v)
		}
	}
	if len(list) == 0 {
		list = defaultSampleVersions(vaultID)
		for _, v := range list {
			r.versions[v.VersionID] = v
			r.snapshots[v.VersionID] = &domain.VersionSnapshot{
				SnapshotID:   "snap-" + v.VersionID,
				VersionID:    v.VersionID,
				ResourceID:   v.ResourceID,
				SnapshotType: domain.SnapshotFull,
				SnapshotData: map[string]interface{}{"title": v.Summary, "version": v.VersionNumber},
				CreatedAt:    v.CreatedAt,
			}
		}
	}
	return list, nil
}

func (r *InMemoryVersioningRepository) DeleteVersion(versionID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.versions, versionID)
	delete(r.snapshots, versionID)
	return nil
}

func (r *InMemoryVersioningRepository) AddToRecycleBin(item *domain.RecycleItem) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recycleBin[item.RecycleID] = item
	return nil
}

func (r *InMemoryVersioningRepository) ListRecycleBin(vaultID string) ([]*domain.RecycleItem, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.RecycleItem
	for _, item := range r.recycleBin {
		if item.VaultID == vaultID && !item.IsRestored {
			list = append(list, item)
		}
	}
	if len(list) == 0 {
		list = defaultSampleRecycleBin(vaultID)
		for _, item := range list {
			r.recycleBin[item.RecycleID] = item
		}
	}
	return list, nil
}

func (r *InMemoryVersioningRepository) RestoreFromRecycleBin(recycleID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	item, ok := r.recycleBin[recycleID]
	if !ok {
		return fmt.Errorf("recycle bin item %s not found", recycleID)
	}
	now := time.Now()
	item.IsRestored = true
	item.RestoredAt = &now
	return nil
}

func (r *InMemoryVersioningRepository) PurgeRecycleItem(recycleID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.recycleBin, recycleID)
	return nil
}

func (r *InMemoryVersioningRepository) SaveDiff(diff *domain.VersionDiff) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	key := diff.SourceVersionID + ":" + diff.TargetVersionID
	r.diffs[key] = diff
	return nil
}

func (r *InMemoryVersioningRepository) GetDiff(sourceVersionID, targetVersionID string) (*domain.VersionDiff, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	key := sourceVersionID + ":" + targetVersionID
	diff, ok := r.diffs[key]
	if !ok {
		return nil, fmt.Errorf("diff %s not found", key)
	}
	return diff, nil
}

func (r *InMemoryVersioningRepository) GetStats(vaultID string) (*domain.VersioningStats, error) {
	vers, _ := r.ListAllVersions(vaultID)
	bin, _ := r.ListRecycleBin(vaultID)

	return &domain.VersioningStats{
		VaultID:           vaultID,
		TotalVersions:     len(vers),
		TotalSnapshots:    len(r.snapshots),
		RecycleBinCount:   len(bin),
		TotalRestores:     3,
		StorageSavedBytes: 1024 * 1024 * 42,
	}, nil
}

func (r *InMemoryVersioningRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for id, v := range r.versions {
		if v.VaultID == vaultID {
			delete(r.versions, id)
			delete(r.snapshots, id)
		}
	}
	for id, item := range r.recycleBin {
		if item.VaultID == vaultID {
			delete(r.recycleBin, id)
		}
	}
	return nil
}

// Sample Data Generators
func defaultSampleVersions(vaultID string) []*domain.ResourceVersion {
	now := time.Now()
	return []*domain.ResourceVersion{
		{
			VersionID:     "ver-japan-v1",
			VaultID:       vaultID,
			ResourceType:  domain.ResourceAsset,
			ResourceID:    "asset-passport-001",
			VersionNumber: 1,
			ChangeType:    domain.ChangeCreated,
			Summary:       "Initial document upload: Japanese Visa Scan",
			Checksum:      "sha256-abc123v1",
			CreatedBy:     "USER",
			CreatedAt:     now.Add(-7 * 24 * time.Hour),
		},
		{
			VersionID:     "ver-japan-v2",
			VaultID:       vaultID,
			ResourceType:  domain.ResourceAsset,
			ResourceID:    "asset-passport-001",
			VersionNumber: 2,
			ChangeType:    domain.ChangeAIRegenerated,
			Summary:       "AI analysis regenerated: Extracted expiration date 2025-09-25",
			Checksum:      "sha256-abc123v2",
			CreatedBy:     "AI_WORKER",
			CreatedAt:     now.Add(-2 * 24 * time.Hour),
		},
	}
}

func defaultSampleRecycleBin(vaultID string) []*domain.RecycleItem {
	now := time.Now()
	exp := now.Add(23 * 24 * time.Hour)
	return []*domain.RecycleItem{
		{
			RecycleID:    "recycle-old-draft-001",
			VaultID:      vaultID,
			ResourceType: domain.ResourceAsset,
			ResourceID:   "asset-old-itinerary",
			Title:        "Draft Tokyo Itinerary 2024.docx",
			OriginalPath: "/Travel/Drafts/Tokyo.docx",
			DeletedBy:    "USER",
			DeletedAt:    now.Add(-7 * 24 * time.Hour),
			ExpiresAt:    &exp,
			IsRestored:   false,
		},
	}
}
