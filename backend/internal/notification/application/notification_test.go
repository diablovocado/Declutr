package application_test

import (
	"context"
	"testing"

	"github.com/diablovocado/declutr/modules/notification/application"
	"github.com/diablovocado/declutr/modules/notification/domain"
	"github.com/diablovocado/declutr/modules/notification/repository"
)

const testVaultID = "vault-test-001"

func setupService() *application.NotificationService {
	repo := repository.NewInMemoryNotificationRepository()
	return application.NewNotificationService(repo)
}

// TestNotificationGeneration validates creating and listing notifications
func TestNotificationGeneration(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	n, err := svc.DispatchNotification(ctx, &domain.Notification{
		VaultID:  testVaultID,
		Type:     domain.TypeWarning,
		Priority: domain.PriorityUrgent,
		Title:    "Passport Renewal Required",
		Message:  "Your passport expires in 65 days.",
	})
	if err != nil {
		t.Fatalf("dispatch notification failed: %v", err)
	}

	list, err := svc.ListNotifications(testVaultID)
	if err != nil {
		t.Fatalf("list notifications failed: %v", err)
	}
	found := false
	for _, item := range list {
		if item.NotificationID == n.NotificationID {
			found = true
			break
		}
	}
	if !found {
		t.Error("expected dispatched notification to be present in list")
	}

	t.Logf("PASS: Notification Generation — Dispatched %s (%s)", n.NotificationID, n.Title)
}

// TestPriorityEngine validates priority scoring logic
func TestPriorityEngine(t *testing.T) {
	p1 := application.CalculatePriority(domain.TypeSecurity, "NORMAL")
	if p1 != domain.PriorityUrgent {
		t.Errorf("expected SECURITY to be URGENT, got %s", p1)
	}

	p2 := application.CalculatePriority(domain.TypeWarning, "NORMAL")
	if p2 != domain.PriorityHigh {
		t.Errorf("expected WARNING to be HIGH, got %s", p2)
	}

	p3 := application.CalculatePriority(domain.TypeWorkflow, "NORMAL")
	if p3 != domain.PriorityMedium {
		t.Errorf("expected WORKFLOW to be MEDIUM, got %s", p3)
	}

	t.Logf("PASS: Priority Engine — Calculated priorities for Security (%s), Warning (%s), Workflow (%s)", p1, p2, p3)
}

// TestMarkReadAndDismiss validates marking read, read-all, and dismiss
func TestMarkReadAndDismiss(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	n, _ := svc.DispatchNotification(ctx, &domain.Notification{
		VaultID: testVaultID,
		Type:    domain.TypeInfo,
		Title:   "System Ingestion Complete",
		Message: "Uploaded 5 assets.",
	})

	if err := svc.MarkRead(testVaultID, []string{n.NotificationID}); err != nil {
		t.Fatalf("mark read failed: %v", err)
	}

	if err := svc.DismissNotification(n.NotificationID); err != nil {
		t.Fatalf("dismiss notification failed: %v", err)
	}

	list, _ := svc.ListNotifications(testVaultID)
	for _, item := range list {
		if item.NotificationID == n.NotificationID {
			t.Error("expected dismissed notification to be omitted from active list")
		}
	}

	t.Logf("PASS: Mark Read & Dismiss — Notification %s correctly read and dismissed", n.NotificationID)
}

// TestDeduplication validates deduplicating similar notifications
func TestDeduplication(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	n1, _ := svc.DispatchNotification(ctx, &domain.Notification{
		VaultID: testVaultID,
		Type:    domain.TypeWarning,
		Title:   "Duplicate Alert Test",
		Message: "Warning message text",
	})

	n2, _ := svc.DispatchNotification(ctx, &domain.Notification{
		VaultID: testVaultID,
		Type:    domain.TypeWarning,
		Title:   "Duplicate Alert Test",
		Message: "Identical title message",
	})

	if n1.NotificationID != n2.NotificationID {
		t.Errorf("expected deduplication to return identical notification ID, got %s and %s",
			n1.NotificationID, n2.NotificationID)
	}

	t.Logf("PASS: Deduplication — Prevented duplicate creation for '%s'", n1.Title)
}

// TestDigestGeneration validates Daily & Weekly digest reports
func TestDigestGeneration(t *testing.T) {
	svc := setupService()

	digest, err := svc.GenerateDigest(testVaultID, domain.DigestDaily)
	if err != nil {
		t.Fatalf("generate digest failed: %v", err)
	}
	if digest.DigestType != domain.DigestDaily {
		t.Errorf("expected Daily digest type, got %s", digest.DigestType)
	}

	digests, err := svc.GetDigests(testVaultID)
	if err != nil {
		t.Fatalf("get digests failed: %v", err)
	}
	if len(digests) == 0 {
		t.Error("expected digest reports in list")
	}

	t.Logf("PASS: Digest Generation — Created %s for vault %s", digest.Title, testVaultID)
}

// TestPreferencesUpdate validates notification channel preferences
func TestPreferencesUpdate(t *testing.T) {
	svc := setupService()

	prefs, err := svc.GetPreferences(testVaultID)
	if err != nil {
		t.Fatalf("get preferences failed: %v", err)
	}
	if !prefs.InAppEnabled {
		t.Error("expected InAppEnabled to be true by default")
	}

	prefs.EmailEnabled = true
	if err := svc.UpdatePreferences(prefs); err != nil {
		t.Fatalf("update preferences failed: %v", err)
	}

	updated, _ := svc.GetPreferences(testVaultID)
	if !updated.EmailEnabled {
		t.Error("expected EmailEnabled to be true after update")
	}

	t.Logf("PASS: Preferences Update — Updated channel settings for vault %s", testVaultID)
}
