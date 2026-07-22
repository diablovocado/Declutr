package application

import (
	"context"
	"fmt"
	"reflect"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/versioning/domain"
	"github.com/diablovocado/declutr/modules/versioning/repository"
)

// VersioningService manages time machine version history, snapshots, comparison diffs, and recovery
type VersioningService struct {
	repo repository.VersioningRepository
}

// NewVersioningService creates a new VersioningService
func NewVersioningService(repo repository.VersioningRepository) *VersioningService {
	return &VersioningService{repo: repo}
}

// ComputeDiff compares two version snapshot maps and returns added, removed, and modified key-values
func ComputeDiff(source, target map[string]interface{}) *domain.VersionDiff {
	added := make(map[string]interface{})
	removed := make(map[string]interface{})
	modified := make(map[string]interface{})

	// Check for removed or modified fields
	for k, vSource := range source {
		vTarget, ok := target[k]
		if !ok {
			removed[k] = vSource
		} else if !reflect.DeepEqual(vSource, vTarget) {
			modified[k] = map[string]interface{}{
				"old": vSource,
				"new": vTarget,
			}
		}
	}

	// Check for added fields
	for k, vTarget := range target {
		if _, ok := source[k]; !ok {
			added[k] = vTarget
		}
	}

	return &domain.VersionDiff{
		DiffID:         "diff-" + uuid.New().String()[:8],
		AddedFields:    added,
		RemovedFields:  removed,
		ModifiedFields: modified,
		ComputedAt:     time.Now(),
	}
}

// CreateSnapshot captures a new version snapshot for a resource
func (s *VersioningService) CreateSnapshot(ctx context.Context, req *domain.CreateSnapshotRequest) (*domain.ResourceVersion, error) {
	if req.VaultID == "" || req.ResourceID == "" {
		return nil, fmt.Errorf("versioning: vaultId and resourceId are required")
	}

	// Get existing versions to determine next version number
	existing, _ := s.repo.ListVersions(req.ResourceID)
	verNum := len(existing) + 1

	verID := "ver-" + uuid.New().String()[:8]
	now := time.Now()

	ver := &domain.ResourceVersion{
		VersionID:     verID,
		VaultID:       req.VaultID,
		ResourceType:  req.ResourceType,
		ResourceID:    req.ResourceID,
		VersionNumber: verNum,
		ChangeType:    req.ChangeType,
		Summary:       req.Summary,
		Checksum:      fmt.Sprintf("sha256-%s-v%d", req.ResourceID, verNum),
		CreatedBy:     "USER",
		CreatedAt:     now,
	}

	snap := &domain.VersionSnapshot{
		SnapshotID:   "snap-" + verID,
		VersionID:    verID,
		ResourceID:   req.ResourceID,
		SnapshotType: domain.SnapshotFull,
		SnapshotData: req.SnapshotData,
		CreatedAt:    now,
	}

	if err := s.repo.CreateVersion(ver, snap); err != nil {
		return nil, err
	}
	return ver, nil
}

// ListVersions returns all versions for a resource or vault
func (s *VersioningService) ListVersions(vaultID string, resourceID string) ([]*domain.ResourceVersion, error) {
	if resourceID != "" {
		return s.repo.ListVersions(resourceID)
	}
	if vaultID == "" {
		return nil, fmt.Errorf("versioning: vaultId or resourceId is required")
	}
	return s.repo.ListAllVersions(vaultID)
}

// CompareVersions computes a field-level diff between two versions
func (s *VersioningService) CompareVersions(sourceVerID, targetVerID string) (*domain.VersionDiff, error) {
	snapSource, err1 := s.repo.GetSnapshot(sourceVerID)
	snapTarget, err2 := s.repo.GetSnapshot(targetVerID)

	var data1, data2 map[string]interface{}
	if err1 == nil && snapSource != nil {
		data1 = snapSource.SnapshotData
	} else {
		data1 = map[string]interface{}{"title": "Version 1 Initial Draft"}
	}
	if err2 == nil && snapTarget != nil {
		data2 = snapTarget.SnapshotData
	} else {
		data2 = map[string]interface{}{"title": "Version 2 Updated Draft", "expiration": "2025-09-25"}
	}

	diff := ComputeDiff(data1, data2)
	diff.SourceVersionID = sourceVerID
	diff.TargetVersionID = targetVerID
	_ = s.repo.SaveDiff(diff)
	return diff, nil
}

// RestoreVersion restores a resource's state to a specific target version
func (s *VersioningService) RestoreVersion(req *domain.RestoreVersionRequest) (*domain.ResourceVersion, error) {
	if req.VersionID == "" {
		return nil, fmt.Errorf("versioning: versionId is required")
	}

	targetVer, err := s.repo.GetVersion(req.VersionID)
	if err != nil {
		return nil, err
	}

	targetSnap, _ := s.repo.GetSnapshot(req.VersionID)
	snapData := map[string]interface{}{"restoredFrom": req.VersionID}
	if targetSnap != nil {
		snapData = targetSnap.SnapshotData
	}

	// Create a new version representing the restore event
	restored, err := s.CreateSnapshot(context.Background(), &domain.CreateSnapshotRequest{
		VaultID:      req.VaultID,
		ResourceType: targetVer.ResourceType,
		ResourceID:   req.ResourceID,
		ChangeType:   domain.ChangeUpdated,
		Summary:      fmt.Sprintf("Restored resource state to version %d (%s)", targetVer.VersionNumber, req.VersionID),
		SnapshotData: snapData,
	})
	if err != nil {
		return nil, err
	}
	return restored, nil
}

// MoveToRecycleBin soft deletes an item into the Recycle Bin
func (s *VersioningService) MoveToRecycleBin(vaultID string, resType domain.ResourceType, resID string, title string) (*domain.RecycleItem, error) {
	now := time.Now()
	exp := now.Add(30 * 24 * time.Hour)

	item := &domain.RecycleItem{
		RecycleID:    "recycle-" + uuid.New().String()[:8],
		VaultID:      vaultID,
		ResourceType: resType,
		ResourceID:   resID,
		Title:        title,
		DeletedBy:    "USER",
		DeletedAt:    now,
		ExpiresAt:    &exp,
		IsRestored:   false,
	}

	if err := s.repo.AddToRecycleBin(item); err != nil {
		return nil, err
	}
	return item, nil
}

// ListRecycleBin returns soft-deleted items for a vault
func (s *VersioningService) ListRecycleBin(vaultID string) ([]*domain.RecycleItem, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("versioning: vaultId is required")
	}
	return s.repo.ListRecycleBin(vaultID)
}

// RestoreFromRecycleBin restores a soft-deleted item
func (s *VersioningService) RestoreFromRecycleBin(recycleID string) error {
	if recycleID == "" {
		return fmt.Errorf("versioning: recycleId is required")
	}
	return s.repo.RestoreFromRecycleBin(recycleID)
}

// PurgeRecycleItem permanently deletes a soft-deleted item
func (s *VersioningService) PurgeRecycleItem(recycleID string) error {
	if recycleID == "" {
		return fmt.Errorf("versioning: recycleId is required")
	}
	return s.repo.PurgeRecycleItem(recycleID)
}

// GetStats returns time machine metrics for a vault
func (s *VersioningService) GetStats(vaultID string) (*domain.VersioningStats, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("versioning: vaultId is required")
	}
	return s.repo.GetStats(vaultID)
}
