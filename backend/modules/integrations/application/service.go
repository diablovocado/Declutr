package application

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/integrations/domain"
	"github.com/diablovocado/declutr/modules/integrations/repository"
)

// IntegrationService manages connector installation, configuration, credentials, execution jobs, and marketplace
type IntegrationService struct {
	repo repository.IntegrationRepository
}

// NewIntegrationService creates a new IntegrationService instance
func NewIntegrationService(repo repository.IntegrationRepository) *IntegrationService {
	return &IntegrationService{repo: repo}
}

// ListMarketplace returns available integrations in the marketplace
func (s *IntegrationService) ListMarketplace() ([]*domain.ConnectorMarketplaceItem, error) {
	return s.repo.ListMarketplace()
}

// ListConnectors returns installed connectors for a vault
func (s *IntegrationService) ListConnectors(vaultID string) ([]*domain.Connector, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("integrations: vaultId is required")
	}
	return s.repo.ListConnectors(vaultID)
}

// InstallConnector installs a new connector instance from marketplace
func (s *IntegrationService) InstallConnector(ctx context.Context, req *domain.InstallConnectorRequest) (*domain.Connector, error) {
	if req.VaultID == "" || req.TypeKey == "" {
		return nil, fmt.Errorf("integrations: vaultId and typeKey are required")
	}

	connID := "conn-" + uuid.New().String()[:8]
	conn := &domain.Connector{
		ConnectorID: connID,
		VaultID:     req.VaultID,
		TypeKey:     req.TypeKey,
		Name:        req.Name,
		Category:    req.Category,
		Status:      domain.StatusConfigured,
		IsEnabled:   true,
		InstalledAt: time.Now(),
	}

	if err := s.repo.SaveConnector(conn); err != nil {
		return nil, err
	}

	_ = s.repo.AppendLog(&domain.ConnectorLog{
		LogID:       "log-" + uuid.New().String()[:8],
		ConnectorID: connID,
		Level:       "INFO",
		Message:     fmt.Sprintf("Connector %s (%s) installed successfully.", req.Name, req.TypeKey),
		CreatedAt:   time.Now(),
	})

	log.Printf("[IntegrationService] Installed connector %s (%s) for vault %s", req.Name, req.TypeKey, req.VaultID)
	return conn, nil
}

// ConfigureConnector sets configuration options and authentication credentials
func (s *IntegrationService) ConfigureConnector(ctx context.Context, req *domain.ConfigureConnectorRequest) error {
	if req.ConnectorID == "" {
		return fmt.Errorf("integrations: connectorId is required")
	}

	conn, err := s.repo.GetConnector(req.ConnectorID)
	if err != nil {
		return err
	}

	cfg := &domain.ConnectorConfig{
		ConfigID:             "cfg-" + req.ConnectorID,
		ConnectorID:          req.ConnectorID,
		SyncDirection:        req.SyncDirection,
		AutoSyncIntervalMins: req.AutoSyncIntervalMins,
		SyncFolder:           req.SyncFolder,
		Settings:             req.Settings,
		UpdatedAt:            time.Now(),
	}
	if err := s.repo.SaveConfig(cfg); err != nil {
		return err
	}

	if len(req.Credentials) > 0 {
		creds := &domain.ConnectorCredentials{
			CredID:               "cred-" + req.ConnectorID,
			ConnectorID:          req.ConnectorID,
			AuthType:             req.AuthType,
			EncryptedCredentials: req.Credentials,
		}
		if err := s.repo.SaveCredentials(creds); err != nil {
			return err
		}
		conn.Status = domain.StatusConnected
		_ = s.repo.SaveConnector(conn)
	}

	_ = s.repo.AppendLog(&domain.ConnectorLog{
		LogID:       "log-" + uuid.New().String()[:8],
		ConnectorID: req.ConnectorID,
		Level:       "INFO",
		Message:     "Configuration and credentials updated.",
		CreatedAt:   time.Now(),
	})

	return nil
}

// ToggleConnector enables or disables an installed connector
func (s *IntegrationService) ToggleConnector(req *domain.ToggleConnectorRequest) error {
	if req.ConnectorID == "" {
		return fmt.Errorf("integrations: connectorId is required")
	}
	conn, err := s.repo.GetConnector(req.ConnectorID)
	if err != nil {
		return err
	}
	conn.IsEnabled = req.Enable
	return s.repo.SaveConnector(conn)
}

// TriggerSync initiates a manual sync or import job using SDK instance
func (s *IntegrationService) TriggerSync(ctx context.Context, req *domain.TriggerSyncRequest) (*domain.SyncJob, error) {
	if req.ConnectorID == "" || req.VaultID == "" {
		return nil, fmt.Errorf("integrations: connectorId and vaultId are required")
	}

	conn, err := s.repo.GetConnector(req.ConnectorID)
	if err != nil || !conn.IsEnabled {
		return nil, fmt.Errorf("connector unavailable or disabled")
	}

	var sdk domain.ConnectorSDK
	if conn.TypeKey == domain.TypeWebDAV {
		sdk = domain.NewWebDAVConnector(conn.ConnectorID)
	} else {
		sdk = domain.NewGoogleDriveConnector(conn.ConnectorID)
	}

	job, err := sdk.Sync(ctx, req.VaultID)
	if err != nil {
		return nil, err
	}
	_ = s.repo.SaveSyncJob(job)

	_ = s.repo.AppendLog(&domain.ConnectorLog{
		LogID:       "log-" + uuid.New().String()[:8],
		ConnectorID: req.ConnectorID,
		Level:       "INFO",
		Message:     fmt.Sprintf("Sync job %s executed: %d items processed.", job.JobID, job.ItemsProcessed),
		CreatedAt:   time.Now(),
	})

	return job, nil
}

// ProcessWebhook handles inbound webhook payload
func (s *IntegrationService) ProcessWebhook(ctx context.Context, payload *domain.WebhookPayload) error {
	if payload.ConnectorID == "" {
		return fmt.Errorf("integrations: connectorId is required")
	}
	payload.WebhookID = "wh-" + uuid.New().String()[:8]
	payload.ProcessedAt = time.Now()
	if err := s.repo.SaveWebhook(payload); err != nil {
		return err
	}
	log.Printf("[EventBus] Published Event ConnectorWebhookReceived for %s (%s)", payload.ConnectorID, payload.EventType)
	return nil
}

// CheckHealth probes health diagnostic of connector SDK instance
func (s *IntegrationService) CheckHealth(ctx context.Context, connectorID string) (*domain.HealthCheckResult, error) {
	if connectorID == "" {
		return nil, fmt.Errorf("integrations: connectorId is required")
	}
	conn, err := s.repo.GetConnector(connectorID)
	if err != nil {
		return nil, err
	}

	var sdk domain.ConnectorSDK
	if conn.TypeKey == domain.TypeWebDAV {
		sdk = domain.NewWebDAVConnector(conn.ConnectorID)
	} else {
		sdk = domain.NewGoogleDriveConnector(conn.ConnectorID)
	}

	result, err := sdk.HealthCheck(ctx)
	if err != nil {
		result = &domain.HealthCheckResult{
			ConnectorID: connectorID,
			Status:      domain.HealthUnhealthy,
			LatencyMs:   999,
			CheckedAt:   time.Now(),
			ErrorMsg:    err.Error(),
		}
	}
	_ = s.repo.SaveHealth(result)
	return result, nil
}

// GetLogs returns execution log items
func (s *IntegrationService) GetLogs(connectorID string, limit int) ([]*domain.ConnectorLog, error) {
	if connectorID == "" {
		return nil, fmt.Errorf("integrations: connectorId is required")
	}
	return s.repo.ListLogs(connectorID, limit)
}
