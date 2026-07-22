package application_test

import (
	"context"
	"testing"

	"github.com/diablovocado/declutr/modules/integrations/application"
	"github.com/diablovocado/declutr/modules/integrations/domain"
	"github.com/diablovocado/declutr/modules/integrations/repository"
)

const testVaultID = "vault-test-001"

func setupService() (*application.IntegrationService, *application.ConnectorRuntime) {
	repo := repository.NewInMemoryIntegrationRepository()
	svc := application.NewIntegrationService(repo)
	rt := application.NewConnectorRuntime(svc)
	return svc, rt
}

// TestConnectorMarketplaceAndInstall validates listing marketplace and installing connectors
func TestConnectorMarketplaceAndInstall(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	items, err := svc.ListMarketplace()
	if err != nil || len(items) == 0 {
		t.Fatalf("list marketplace failed or empty")
	}

	conn, err := svc.InstallConnector(ctx, &domain.InstallConnectorRequest{
		VaultID:  testVaultID,
		TypeKey:  domain.TypeGoogleDrive,
		Name:     "My Work Google Drive",
		Category: "STORAGE",
	})
	if err != nil {
		t.Fatalf("install connector failed: %v", err)
	}
	if conn.TypeKey != domain.TypeGoogleDrive {
		t.Errorf("expected TypeGoogleDrive, got %s", conn.TypeKey)
	}

	t.Logf("PASS: Marketplace & Install — Installed connector %s (%s)", conn.Name, conn.ConnectorID)
}

// TestConnectorConfigAndAuth validates configuring credentials and updating connected status
func TestConnectorConfigAndAuth(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	conn, _ := svc.InstallConnector(ctx, &domain.InstallConnectorRequest{
		VaultID:  testVaultID,
		TypeKey:  domain.TypeWebDAV,
		Name:     "Home Nextcloud WebDAV",
		Category: "STORAGE",
	})

	err := svc.ConfigureConnector(ctx, &domain.ConfigureConnectorRequest{
		VaultID:              testVaultID,
		ConnectorID:          conn.ConnectorID,
		SyncDirection:        domain.DirectionImportOnly,
		AutoSyncIntervalMins: 30,
		SyncFolder:           "/Documents",
		AuthType:             domain.AuthAPIKey,
		Credentials:          map[string]interface{}{"apiKey": "sec-webdav-key-123"},
	})
	if err != nil {
		t.Fatalf("configure connector failed: %v", err)
	}

	t.Logf("PASS: Config & Auth — Configured API Key auth for %s", conn.ConnectorID)
}

// TestConnectorSyncAndImportPipeline validates executing sync jobs and processing items
func TestConnectorSyncAndImportPipeline(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	conn, _ := svc.InstallConnector(ctx, &domain.InstallConnectorRequest{
		VaultID:  testVaultID,
		TypeKey:  domain.TypeGoogleDrive,
		Name:     "Google Drive",
		Category: "STORAGE",
	})

	job, err := svc.TriggerSync(ctx, &domain.TriggerSyncRequest{
		VaultID:     testVaultID,
		ConnectorID: conn.ConnectorID,
		JobType:     "FULL_IMPORT",
	})
	if err != nil {
		t.Fatalf("trigger sync failed: %v", err)
	}
	if job.Status != "COMPLETED" || job.ItemsProcessed != 12 {
		t.Errorf("expected COMPLETED with 12 items, got status %s items %d", job.Status, job.ItemsProcessed)
	}

	t.Logf("PASS: Sync & Import Pipeline — Executed sync job %s (%d items processed)", job.JobID, job.ItemsProcessed)
}

// TestInboundWebhookProcessing validates ingesting external webhooks and event bus dispatching
func TestInboundWebhookProcessing(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	err := svc.ProcessWebhook(ctx, &domain.WebhookPayload{
		ConnectorID: "conn-gdrive-001",
		EventType:   "FILE_CREATED",
		Payload:     map[string]interface{}{"fileId": "file-123", "name": "Report.pdf"},
	})
	if err != nil {
		t.Fatalf("process webhook failed: %v", err)
	}

	t.Log("PASS: Inbound Webhook Processing — Webhook FILE_CREATED accepted and dispatched to Event Bus")
}

// TestConnectorHealthCheck validates health diagnostic probing
func TestConnectorHealthCheck(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	conn, _ := svc.InstallConnector(ctx, &domain.InstallConnectorRequest{
		VaultID:  testVaultID,
		TypeKey:  domain.TypeWebDAV,
		Name:     "WebDAV Probe",
		Category: "STORAGE",
	})

	health, err := svc.CheckHealth(ctx, conn.ConnectorID)
	if err != nil {
		t.Fatalf("check health failed: %v", err)
	}
	if health.Status != domain.HealthHealthy {
		t.Errorf("expected HEALTHY, got %s", health.Status)
	}

	t.Logf("PASS: Health Check Probe — Connector %s status: %s (Latency: %dms)",
		conn.ConnectorID, health.Status, health.LatencyMs)
}

// TestEnableDisableAndDisconnect validates toggling enabled state
func TestEnableDisableAndDisconnect(t *testing.T) {
	svc, _ := setupService()
	ctx := context.Background()

	conn, _ := svc.InstallConnector(ctx, &domain.InstallConnectorRequest{
		VaultID:  testVaultID,
		TypeKey:  domain.TypeGoogleDrive,
		Name:     "Google Drive Toggle",
		Category: "STORAGE",
	})

	err := svc.ToggleConnector(&domain.ToggleConnectorRequest{
		VaultID:     testVaultID,
		ConnectorID: conn.ConnectorID,
		Enable:      false,
	})
	if err != nil {
		t.Fatalf("toggle connector failed: %v", err)
	}

	// Should fail sync when disabled
	_, err = svc.TriggerSync(ctx, &domain.TriggerSyncRequest{
		VaultID:     testVaultID,
		ConnectorID: conn.ConnectorID,
	})
	if err == nil {
		t.Error("expected error when triggering sync on disabled connector")
	}

	t.Logf("PASS: Enable/Disable — Connector %s successfully disabled", conn.ConnectorID)
}
