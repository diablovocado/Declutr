package application_test

import (
	"context"
	"testing"

	"github.com/diablovocado/declutr/modules/versioning/application"
	"github.com/diablovocado/declutr/modules/versioning/domain"
	"github.com/diablovocado/declutr/modules/versioning/repository"
)

const testVaultID = "vault-test-001"

func setupService() *application.VersioningService {
	repo := repository.NewInMemoryVersioningRepository()
	return application.NewVersioningService(repo)
}

// TestVersionSnapshotCreation validates snapshot creation and listing
func TestVersionSnapshotCreation(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	ver, err := svc.CreateSnapshot(ctx, &domain.CreateSnapshotRequest{
		VaultID:      testVaultID,
		ResourceType: domain.ResourceAsset,
		ResourceID:   "asset-doc-100",
		ChangeType:   domain.ChangeCreated,
		Summary:      "Created initial version of Tax Form 2025",
		SnapshotData: map[string]interface{}{"title": "Tax Form 2025", "status": "DRAFT"},
	})
	if err != nil {
		t.Fatalf("create snapshot failed: %v", err)
	}
	if ver.VersionNumber != 1 {
		t.Errorf("expected version number 1, got %d", ver.VersionNumber)
	}

	list, err := svc.ListVersions(testVaultID, "asset-doc-100")
	if err != nil {
		t.Fatalf("list versions failed: %v", err)
	}
	if len(list) == 0 {
		t.Error("expected version in list")
	}

	t.Logf("PASS: Version Snapshot Creation — Created %s (Version %d)", ver.VersionID, ver.VersionNumber)
}

// TestDiffEngineComparison validates diffing two version snapshots
func TestDiffEngineComparison(t *testing.T) {
	src := map[string]interface{}{"title": "Old Draft", "status": "DRAFT", "author": "John"}
	tgt := map[string]interface{}{"title": "New Final", "status": "PUBLISHED", "tags": []string{"Tax"}}

	diff := application.ComputeDiff(src, tgt)
	if len(diff.ModifiedFields) == 0 {
		t.Error("expected modified fields in diff")
	}
	if _, ok := diff.RemovedFields["author"]; !ok {
		t.Error("expected 'author' field to be marked as removed")
	}
	if _, ok := diff.AddedFields["tags"]; !ok {
		t.Error("expected 'tags' field to be marked as added")
	}

	t.Logf("PASS: Diff Engine Comparison — Computed diff: %d added, %d removed, %d modified",
		len(diff.AddedFields), len(diff.RemovedFields), len(diff.ModifiedFields))
}

// TestRestoreVersion validates restoring a resource state to a previous target version
func TestRestoreVersion(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	v1, _ := svc.CreateSnapshot(ctx, &domain.CreateSnapshotRequest{
		VaultID:      testVaultID,
		ResourceType: domain.ResourceAsset,
		ResourceID:   "asset-passport-001",
		ChangeType:   domain.ChangeCreated,
		Summary:      "Version 1",
		SnapshotData: map[string]interface{}{"title": "Passport Scan V1"},
	})

	restored, err := svc.RestoreVersion(&domain.RestoreVersionRequest{
		VaultID:    testVaultID,
		ResourceID: "asset-passport-001",
		VersionID:  v1.VersionID,
	})
	if err != nil {
		t.Fatalf("restore version failed: %v", err)
	}
	if restored.VersionNumber <= v1.VersionNumber {
		t.Errorf("expected restored version number to be greater than target version, got %d", restored.VersionNumber)
	}

	t.Logf("PASS: Restore Version — Restored resource to state of %s (New Version %d)",
		v1.VersionID, restored.VersionNumber)
}

// TestRecycleBinSoftDelete validates soft deleting items into the Recycle Bin
func TestRecycleBinSoftDelete(t *testing.T) {
	svc := setupService()

	item, err := svc.MoveToRecycleBin(testVaultID, domain.ResourceAsset, "asset-old-draft", "Old Draft.docx")
	if err != nil {
		t.Fatalf("move to recycle bin failed: %v", err)
	}

	list, err := svc.ListRecycleBin(testVaultID)
	if err != nil {
		t.Fatalf("list recycle bin failed: %v", err)
	}
	found := false
	for _, it := range list {
		if it.RecycleID == item.RecycleID {
			found = true
			break
		}
	}
	if !found {
		t.Error("expected item to be present in recycle bin")
	}

	t.Logf("PASS: Recycle Bin Soft Delete — Moved %s to recycle bin", item.RecycleID)
}

// TestRecycleBinRestoreAndPurge validates restoring and purging items from the Recycle Bin
func TestRecycleBinRestoreAndPurge(t *testing.T) {
	svc := setupService()

	item, _ := svc.MoveToRecycleBin(testVaultID, domain.ResourceAsset, "asset-temp", "Temp File.pdf")

	if err := svc.RestoreFromRecycleBin(item.RecycleID); err != nil {
		t.Fatalf("restore from recycle bin failed: %v", err)
	}

	if err := svc.PurgeRecycleItem(item.RecycleID); err != nil {
		t.Fatalf("purge recycle item failed: %v", err)
	}

	t.Logf("PASS: Recycle Bin Restore & Purge — Item %s restored and purged", item.RecycleID)
}

// TestVersioningStats validates time machine vault metrics
func TestVersioningStats(t *testing.T) {
	svc := setupService()

	stats, err := svc.GetStats(testVaultID)
	if err != nil {
		t.Fatalf("get stats failed: %v", err)
	}
	if stats.TotalVersions == 0 {
		t.Error("expected positive total versions count")
	}

	t.Logf("PASS: Versioning Stats — TotalVersions=%d, Snapshots=%d, RecycleBinCount=%d",
		stats.TotalVersions, stats.TotalSnapshots, stats.RecycleBinCount)
}
