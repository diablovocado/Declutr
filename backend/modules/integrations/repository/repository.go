package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/integrations/domain"
)

// IntegrationRepository defines persistence contract for connectors, configs, credentials, jobs, webhooks, and logs
type IntegrationRepository interface {
	ListMarketplace() ([]*domain.ConnectorMarketplaceItem, error)

	SaveConnector(conn *domain.Connector) error
	ListConnectors(vaultID string) ([]*domain.Connector, error)
	GetConnector(connectorID string) (*domain.Connector, error)

	SaveConfig(config *domain.ConnectorConfig) error
	GetConfig(connectorID string) (*domain.ConnectorConfig, error)

	SaveCredentials(creds *domain.ConnectorCredentials) error
	GetCredentials(connectorID string) (*domain.ConnectorCredentials, error)

	SaveSyncJob(job *domain.SyncJob) error
	ListSyncJobs(connectorID string) ([]*domain.SyncJob, error)

	SaveWebhook(payload *domain.WebhookPayload) error

	AppendLog(logItem *domain.ConnectorLog) error
	ListLogs(connectorID string, limit int) ([]*domain.ConnectorLog, error)

	SaveHealth(health *domain.HealthCheckResult) error
	GetHealth(connectorID string) (*domain.HealthCheckResult, error)

	ClearAllData(vaultID string) error
}

// InMemoryIntegrationRepository is a thread-safe in-memory store
type InMemoryIntegrationRepository struct {
	mu          sync.RWMutex
	connectors  map[string]*domain.Connector
	configs     map[string]*domain.ConnectorConfig
	credentials map[string]*domain.ConnectorCredentials
	syncJobs    map[string][]*domain.SyncJob
	webhooks    []*domain.WebhookPayload
	logs        map[string][]*domain.ConnectorLog
	health      map[string]*domain.HealthCheckResult
}

// NewInMemoryIntegrationRepository creates a new in-memory repository
func NewInMemoryIntegrationRepository() *InMemoryIntegrationRepository {
	return &InMemoryIntegrationRepository{
		connectors:  make(map[string]*domain.Connector),
		configs:     make(map[string]*domain.ConnectorConfig),
		credentials: make(map[string]*domain.ConnectorCredentials),
		syncJobs:    make(map[string][]*domain.SyncJob),
		logs:        make(map[string][]*domain.ConnectorLog),
		health:      make(map[string]*domain.HealthCheckResult),
	}
}

func (r *InMemoryIntegrationRepository) ListMarketplace() ([]*domain.ConnectorMarketplaceItem, error) {
	return []*domain.ConnectorMarketplaceItem{
		{TypeKey: domain.TypeGoogleDrive, Name: "Google Drive", Description: "Import PDF, Docs, and media from Google Drive folders.", Category: "STORAGE", Icon: "📁", SupportedAuth: []domain.AuthType{domain.AuthOAuth2, domain.AuthOAuthPKCE}},
		{TypeKey: domain.TypeDropbox, Name: "Dropbox", Description: "Sync files and documents from your Dropbox accounts.", Category: "STORAGE", Icon: "📦", SupportedAuth: []domain.AuthType{domain.AuthOAuth2}},
		{TypeKey: domain.TypeNotion, Name: "Notion Workspace", Description: "Import Notion pages, databases, and structured notes.", Category: "PRODUCTIVITY", Icon: "📝", SupportedAuth: []domain.AuthType{domain.AuthPersonalAccessToken, domain.AuthOAuth2}},
		{TypeKey: domain.TypeGitHub, Name: "GitHub Repositories", Description: "Index code, issues, PRs, and markdown documentation.", Category: "CODE", Icon: "🐙", SupportedAuth: []domain.AuthType{domain.AuthPersonalAccessToken, domain.AuthOAuth2}},
		{TypeKey: domain.TypeS3, Name: "Amazon S3 / R2", Description: "Connect AWS S3 or Cloudflare R2 object storage buckets.", Category: "STORAGE", Icon: "🪣", SupportedAuth: []domain.AuthType{domain.AuthAPIKey, domain.AuthServiceAccount}},
		{TypeKey: domain.TypeWebDAV, Name: "WebDAV / Nextcloud", Description: "Import from personal WebDAV servers and Nextcloud instances.", Category: "STORAGE", Icon: "🌐", SupportedAuth: []domain.AuthType{domain.AuthAPIKey, domain.AuthPersonalAccessToken}},
	}, nil
}

func (r *InMemoryIntegrationRepository) SaveConnector(conn *domain.Connector) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.connectors[conn.ConnectorID] = conn
	return nil
}

func (r *InMemoryIntegrationRepository) ListConnectors(vaultID string) ([]*domain.Connector, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.Connector
	for _, c := range r.connectors {
		if c.VaultID == vaultID {
			list = append(list, c)
		}
	}
	if len(list) == 0 {
		list = defaultSampleConnectors(vaultID)
		for _, c := range list {
			r.connectors[c.ConnectorID] = c
		}
	}
	return list, nil
}

func (r *InMemoryIntegrationRepository) GetConnector(connectorID string) (*domain.Connector, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	c, ok := r.connectors[connectorID]
	if !ok {
		return nil, fmt.Errorf("connector %s not found", connectorID)
	}
	return c, nil
}

func (r *InMemoryIntegrationRepository) SaveConfig(config *domain.ConnectorConfig) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.configs[config.ConnectorID] = config
	return nil
}

func (r *InMemoryIntegrationRepository) GetConfig(connectorID string) (*domain.ConnectorConfig, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	cfg, ok := r.configs[connectorID]
	if !ok {
		return &domain.ConnectorConfig{
			ConfigID:             "cfg-" + connectorID,
			ConnectorID:          connectorID,
			SyncDirection:        domain.DirectionImportOnly,
			AutoSyncIntervalMins: 60,
			SyncFolder:           "/DeclutrImports",
			Settings:             map[string]interface{}{"includeSubfolders": true},
			UpdatedAt:            time.Now(),
		}, nil
	}
	return cfg, nil
}

func (r *InMemoryIntegrationRepository) SaveCredentials(creds *domain.ConnectorCredentials) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.credentials[creds.ConnectorID] = creds
	return nil
}

func (r *InMemoryIntegrationRepository) GetCredentials(connectorID string) (*domain.ConnectorCredentials, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	cr, ok := r.credentials[connectorID]
	if !ok {
		return nil, fmt.Errorf("credentials for %s not found", connectorID)
	}
	return cr, nil
}

func (r *InMemoryIntegrationRepository) SaveSyncJob(job *domain.SyncJob) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.syncJobs[job.ConnectorID] = append(r.syncJobs[job.ConnectorID], job)
	return nil
}

func (r *InMemoryIntegrationRepository) ListSyncJobs(connectorID string) ([]*domain.SyncJob, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.syncJobs[connectorID], nil
}

func (r *InMemoryIntegrationRepository) SaveWebhook(payload *domain.WebhookPayload) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.webhooks = append(r.webhooks, payload)
	return nil
}

func (r *InMemoryIntegrationRepository) AppendLog(logItem *domain.ConnectorLog) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.logs[logItem.ConnectorID] = append(r.logs[logItem.ConnectorID], logItem)
	return nil
}

func (r *InMemoryIntegrationRepository) ListLogs(connectorID string, limit int) ([]*domain.ConnectorLog, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	list := r.logs[connectorID]
	if len(list) == 0 {
		list = defaultSampleLogs(connectorID)
		r.logs[connectorID] = list
	}
	if limit > 0 && len(list) > limit {
		return list[len(list)-limit:], nil
	}
	return list, nil
}

func (r *InMemoryIntegrationRepository) SaveHealth(health *domain.HealthCheckResult) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.health[health.ConnectorID] = health
	return nil
}

func (r *InMemoryIntegrationRepository) GetHealth(connectorID string) (*domain.HealthCheckResult, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	h, ok := r.health[connectorID]
	if !ok {
		return &domain.HealthCheckResult{
			ConnectorID: connectorID,
			Status:      domain.HealthHealthy,
			LatencyMs:   42,
			CheckedAt:   time.Now(),
		}, nil
	}
	return h, nil
}

func (r *InMemoryIntegrationRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for id, c := range r.connectors {
		if c.VaultID == vaultID {
			delete(r.connectors, id)
			delete(r.configs, id)
			delete(r.credentials, id)
			delete(r.syncJobs, id)
			delete(r.logs, id)
			delete(r.health, id)
		}
	}
	return nil
}

// Sample Data Generators
func defaultSampleConnectors(vaultID string) []*domain.Connector {
	now := time.Now()
	return []*domain.Connector{
		{
			ConnectorID: "conn-gdrive-001",
			VaultID:     vaultID,
			TypeKey:     domain.TypeGoogleDrive,
			Name:        "Google Drive (Personal)",
			Category:    "STORAGE",
			Status:      domain.StatusConnected,
			IsEnabled:   true,
			InstalledAt: now.Add(-14 * 24 * time.Hour),
		},
		{
			ConnectorID: "conn-webdav-002",
			VaultID:     vaultID,
			TypeKey:     domain.TypeWebDAV,
			Name:        "Nextcloud Home WebDAV",
			Category:    "STORAGE",
			Status:      domain.StatusConnected,
			IsEnabled:   true,
			InstalledAt: now.Add(-7 * 24 * time.Hour),
		},
	}
}

func defaultSampleLogs(connectorID string) []*domain.ConnectorLog {
	now := time.Now()
	return []*domain.ConnectorLog{
		{
			LogID:       "log-1",
			ConnectorID: connectorID,
			Level:       "INFO",
			Message:     "Connector initialized and OAuth2 tokens validated.",
			CreatedAt:   now.Add(-10 * time.Minute),
		},
		{
			LogID:       "log-2",
			ConnectorID: connectorID,
			Level:       "INFO",
			Message:     "Full import job finished: 12 assets ingested into vault.",
			CreatedAt:   now.Add(-5 * time.Minute),
		},
	}
}
