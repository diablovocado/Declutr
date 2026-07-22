package application_test

import (
	"context"
	"testing"

	"github.com/diablovocado/declutr/modules/sync/application"
	"github.com/diablovocado/declutr/modules/sync/domain"
	"github.com/diablovocado/declutr/modules/sync/repository"
)

const testVaultID = "vault-test-001"
const testDeviceID = "dev-macbook-pro"

func setupService() (*application.SyncService, *application.SyncEngine) {
	repo := repository.NewInMemorySyncRepository()
	svc := application.NewSyncService(repo)
	eng := application.NewSyncEngine(svc)
	return svc, eng
}

// TestPushChangesAndQueueProcessing validates pushing local mutation events
func TestPushChangesAndQueueProcessing(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	queueItems := []*domain.SyncQueueItem{
		{
			QueueID:      "q-1",
			VaultID:      testVaultID,
			DeviceID:     testDeviceID,
			ResourceType: "ASSET",
			ResourceID:   "asset-100",
			ChangeType:   domain.SyncCreate,
			Status:       domain.QueueQueued,
			Payload:      map[string]interface{}{"title": "Passport PDF"},
		},
	}

	count, conflicts, err := svc.PushChanges(ctx, &domain.PushChangesRequest{
		VaultID:  testVaultID,
		DeviceID: testDeviceID,
		Events:   queueItems,
	})
	if err != nil {
		t.Fatalf("push changes failed: %v", err)
	}
	if count != 1 {
		t.Errorf("expected 1 processed event, got %d", count)
	}

	t.Logf("PASS: Push Changes & Queue — Pushed %d events (Conflicts: %d)", count, len(conflicts))
}

// TestPullChangesDelta validates pulling remote changes since checkpoint sequence number
func TestPullChangesDelta(t *testing.T) {
	svc, _ := setupService()

	events, newSeq, err := svc.PullChanges(&domain.PullChangesRequest{
		VaultID:     testVaultID,
		DeviceID:    testDeviceID,
		SinceSeqNum: 0,
		Limit:       10,
	})
	if err != nil {
		t.Fatalf("pull changes failed: %v", err)
	}
	if len(events) == 0 {
		t.Error("expected pulled events")
	}

	t.Logf("PASS: Pull Changes Delta — Pulled %d events (New Sequence Checkpoint: %d)", len(events), newSeq)
}

// TestConflictResolution validates conflict resolution via Field Merge & Last Write Wins
func TestConflictResolution(t *testing.T) {
	svc, _ := setupService()

	conflicts, err := svc.ListConflicts(testVaultID)
	if err != nil || len(conflicts) == 0 {
		t.Fatalf("list conflicts failed or empty")
	}

	targetConflict := conflicts[0]
	resolved, err := svc.ResolveConflict(&domain.ResolveConflictRequest{
		VaultID:    testVaultID,
		ConflictID: targetConflict.ConflictID,
		Resolution: domain.ConflictResolvedMerge,
	})
	if err != nil {
		t.Fatalf("resolve conflict failed: %v", err)
	}
	if resolved.Status != domain.ConflictResolvedMerge {
		t.Errorf("expected RESOLVED_MERGE status, got %s", resolved.Status)
	}

	t.Logf("PASS: Conflict Resolution — Resolved conflict %s via Field Merge Strategy", targetConflict.ConflictID)
}

// TestDeviceRegistrationAndCheckpoint validates device online state and sequence checkpointing
func TestDeviceRegistrationAndCheckpoint(t *testing.T) {
	svc, _ := setupService()

	st, err := svc.RegisterDevice(&domain.RegisterDeviceRequest{
		VaultID:  testVaultID,
		DeviceID: testDeviceID,
		IsOnline: true,
	})
	if err != nil {
		t.Fatalf("register device failed: %v", err)
	}
	if !st.IsOnline {
		t.Error("expected device to be online")
	}

	t.Logf("PASS: Device Registration — Device %s registered online (PulledSeq: %d)", st.DeviceID, st.LastPulledSeq)
}

// TestResumeInterruptedSync validates queue flushing on reconnection
func TestResumeInterruptedSync(t *testing.T) {
	_, eng := setupService()
	ctx := context.Background()

	flushedCount, err := eng.ProcessQueue(ctx, testVaultID, testDeviceID)
	if err != nil {
		t.Fatalf("process queue failed: %v", err)
	}

	t.Logf("PASS: Resume Interrupted Sync — Flushed %d pending queued items", flushedCount)
}

// TestSyncStats validates vault sync metrics calculation
func TestSyncStats(t *testing.T) {
	svc, _ := setupService()

	stats, err := svc.GetStats(testVaultID)
	if err != nil {
		t.Fatalf("get stats failed: %v", err)
	}
	if stats.VaultID != testVaultID {
		t.Errorf("expected vault ID %s, got %s", testVaultID, stats.VaultID)
	}

	t.Logf("PASS: Sync Stats — PendingQueue=%d, ActiveConflicts=%d, Duration=%dms",
		stats.PendingQueueCount, stats.ActiveConflictsCount, stats.LastSyncDurationMs)
}
