package domain

import (
	"context"
	"fmt"
	"time"
)

// BaseConnector implements default no-op methods for ConnectorSDK
type BaseConnector struct {
	ConnectorID string
	TypeKey     ConnectorType
	Config      *ConnectorConfig
	Creds       *ConnectorCredentials
}

func (b *BaseConnector) Initialize(ctx context.Context, config *ConnectorConfig) error {
	b.Config = config
	return nil
}

func (b *BaseConnector) Authenticate(ctx context.Context, creds *ConnectorCredentials) error {
	b.Creds = creds
	return nil
}

func (b *BaseConnector) Validate(ctx context.Context) (bool, error) {
	return b.Creds != nil && len(b.Creds.EncryptedCredentials) > 0, nil
}

func (b *BaseConnector) Disconnect(ctx context.Context) error {
	b.Creds = nil
	return nil
}

// GoogleDriveConnector is a reference SDK implementation for Google Drive
type GoogleDriveConnector struct {
	BaseConnector
}

func NewGoogleDriveConnector(id string) *GoogleDriveConnector {
	return &GoogleDriveConnector{
		BaseConnector: BaseConnector{
			ConnectorID: id,
			TypeKey:     TypeGoogleDrive,
		},
	}
}

func (g *GoogleDriveConnector) Sync(ctx context.Context, vaultID string) (*SyncJob, error) {
	return &SyncJob{
		JobID:            "job-gdrive-001",
		ConnectorID:      g.ConnectorID,
		VaultID:          vaultID,
		JobType:          "FULL_IMPORT",
		Status:           "COMPLETED",
		ItemsProcessed:   12,
		BytesTransferred: 10485760, // 10 MB
		StartedAt:        time.Now().Add(-5 * time.Minute),
	}, nil
}

func (g *GoogleDriveConnector) Import(ctx context.Context, resourceID string) (map[string]interface{}, error) {
	return map[string]interface{}{
		"resourceId": resourceID,
		"filename":   "Q3_Financial_Report.pdf",
		"mimeType":   "application/pdf",
		"size":       204800,
		"source":     "Google Drive",
	}, nil
}

func (g *GoogleDriveConnector) Export(ctx context.Context, payload map[string]interface{}) (string, error) {
	return fmt.Sprintf("gdrive-file-id-%s", payload["title"]), nil
}

func (g *GoogleDriveConnector) Webhook(ctx context.Context, payload *WebhookPayload) error {
	return nil
}

func (g *GoogleDriveConnector) HealthCheck(ctx context.Context) (*HealthCheckResult, error) {
	return &HealthCheckResult{
		ConnectorID: g.ConnectorID,
		Status:      HealthHealthy,
		LatencyMs:   45,
		CheckedAt:   time.Now(),
	}, nil
}

// WebDAVConnector is a reference SDK implementation for WebDAV / Nextcloud / ownCloud
type WebDAVConnector struct {
	BaseConnector
}

func NewWebDAVConnector(id string) *WebDAVConnector {
	return &WebDAVConnector{
		BaseConnector: BaseConnector{
			ConnectorID: id,
			TypeKey:     TypeWebDAV,
		},
	}
}

func (w *WebDAVConnector) Sync(ctx context.Context, vaultID string) (*SyncJob, error) {
	return &SyncJob{
		JobID:            "job-webdav-001",
		ConnectorID:      w.ConnectorID,
		VaultID:          vaultID,
		JobType:          "DELTA_SYNC",
		Status:           "COMPLETED",
		ItemsProcessed:   5,
		BytesTransferred: 5242880, // 5 MB
		StartedAt:        time.Now().Add(-2 * time.Minute),
	}, nil
}

func (w *WebDAVConnector) Import(ctx context.Context, resourceID string) (map[string]interface{}, error) {
	return map[string]interface{}{
		"resourceId": resourceID,
		"filename":   "Scan_Document_2025.pdf",
		"mimeType":   "application/pdf",
		"source":     "WebDAV",
	}, nil
}

func (w *WebDAVConnector) Export(ctx context.Context, payload map[string]interface{}) (string, error) {
	return fmt.Sprintf("webdav-path-%s", payload["title"]), nil
}

func (w *WebDAVConnector) Webhook(ctx context.Context, payload *WebhookPayload) error {
	return nil
}

func (w *WebDAVConnector) HealthCheck(ctx context.Context) (*HealthCheckResult, error) {
	return &HealthCheckResult{
		ConnectorID: w.ConnectorID,
		Status:      HealthHealthy,
		LatencyMs:   32,
		CheckedAt:   time.Now(),
	}, nil
}
