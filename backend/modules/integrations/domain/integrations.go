package domain

import (
	"context"
	"time"
)

// ConnectorType defines external integration classification
type ConnectorType string

const (
	TypeGoogleDrive ConnectorType = "GOOGLE_DRIVE"
	TypeDropbox     ConnectorType = "DROPBOX"
	TypeOneDrive    ConnectorType = "ONEDRIVE"
	TypeGooglePhotos ConnectorType = "GOOGLE_PHOTOS"
	TypeGoogleCalendar ConnectorType = "GOOGLE_CALENDAR"
	TypeGmail       ConnectorType = "GMAIL"
	TypeOutlook     ConnectorType = "OUTLOOK"
	TypeNotion      ConnectorType = "NOTION"
	TypeSlack       ConnectorType = "SLACK"
	TypeGitHub      ConnectorType = "GITHUB"
	TypeGitLab      ConnectorType = "GITLAB"
	TypeBox         ConnectorType = "BOX"
	TypeS3          ConnectorType = "S3"
	TypeWebDAV      ConnectorType = "WEBDAV"
	TypeCustom      ConnectorType = "CUSTOM"
)

// AuthType defines supported authentication modes
type AuthType string

const (
	AuthOAuth2               AuthType = "OAUTH2"
	AuthOAuthPKCE            AuthType = "OAUTH_PKCE"
	AuthAPIKey               AuthType = "API_KEY"
	AuthPersonalAccessToken AuthType = "PERSONAL_ACCESS_TOKEN"
	AuthServiceAccount       AuthType = "SERVICE_ACCOUNT"
)

// ConnectorStatus defines connection health state
type ConnectorStatus string

const (
	StatusConfigured   ConnectorStatus = "CONFIGURED"
	StatusConnected    ConnectorStatus = "CONNECTED"
	StatusDisconnected ConnectorStatus = "DISCONNECTED"
	StatusError        ConnectorStatus = "ERROR"
)

// HealthStatus defines probing health result
type HealthStatus string

const (
	HealthHealthy   HealthStatus = "HEALTHY"
	HealthDegraded  HealthStatus = "DEGRADED"
	HealthUnhealthy HealthStatus = "UNHEALTHY"
)

// SyncDirection defines data flow orientation
type SyncDirection string

const (
	DirectionImportOnly    SyncDirection = "IMPORT_ONLY"
	DirectionExportOnly    SyncDirection = "EXPORT_ONLY"
	DirectionBidirectional SyncDirection = "BIDIRECTIONAL"
)

// Connector model
type Connector struct {
	ConnectorID string          `json:"connectorId"`
	VaultID     string          `json:"vaultId"`
	TypeKey     ConnectorType   `json:"typeKey"`
	Name        string          `json:"name"`
	Category    string          `json:"category"`
	Status      ConnectorStatus `json:"status"`
	IsEnabled   bool            `json:"isEnabled"`
	InstalledAt time.Time       `json:"installedAt"`
}

// ConnectorConfig model
type ConnectorConfig struct {
	ConfigID             string                 `json:"configId"`
	ConnectorID          string                 `json:"connectorId"`
	SyncDirection        SyncDirection          `json:"syncDirection"`
	AutoSyncIntervalMins int                    `json:"autoSyncIntervalMins"`
	SyncFolder           string                 `json:"syncFolder"`
	Settings             map[string]interface{} `json:"settings"`
	UpdatedAt            time.Time              `json:"updatedAt"`
}

// ConnectorCredentials model
type ConnectorCredentials struct {
	CredID               string                 `json:"credId"`
	ConnectorID          string                 `json:"connectorId"`
	AuthType             AuthType               `json:"authType"`
	EncryptedCredentials map[string]interface{} `json:"encryptedCredentials"`
	ExpiresAt            *time.Time             `json:"expiresAt,omitempty"`
}

// SyncJob model
type SyncJob struct {
	JobID            string     `json:"jobId"`
	ConnectorID      string     `json:"connectorId"`
	VaultID          string     `json:"vaultId"`
	JobType          string     `json:"jobType"` // FULL_IMPORT, DELTA_SYNC, EXPORT
	Status           string     `json:"status"`  // PENDING, RUNNING, COMPLETED, FAILED
	ItemsProcessed   int        `json:"itemsProcessed"`
	BytesTransferred int64      `json:"bytesTransferred"`
	StartedAt        time.Time  `json:"startedAt"`
	CompletedAt      *time.Time `json:"completedAt,omitempty"`
}

// WebhookPayload model
type WebhookPayload struct {
	WebhookID   string                 `json:"webhookId"`
	ConnectorID string                 `json:"connectorId"`
	EventType   string                 `json:"eventType"`
	Payload     map[string]interface{} `json:"payload"`
	ProcessedAt time.Time              `json:"processedAt"`
}

// ConnectorLog model
type ConnectorLog struct {
	LogID       string                 `json:"logId"`
	ConnectorID string                 `json:"connectorId"`
	Level       string                 `json:"level"` // INFO, WARN, ERROR
	Message     string                 `json:"message"`
	Details     map[string]interface{} `json:"details,omitempty"`
	CreatedAt   time.Time              `json:"createdAt"`
}

// HealthCheckResult model
type HealthCheckResult struct {
	ConnectorID string       `json:"connectorId"`
	Status      HealthStatus `json:"status"`
	LatencyMs   int64        `json:"latencyMs"`
	CheckedAt   time.Time    `json:"checkedAt"`
	ErrorMsg    string       `json:"errorMsg,omitempty"`
}

// ConnectorMarketplaceItem metadata for available connectors
type ConnectorMarketplaceItem struct {
	TypeKey     ConnectorType `json:"typeKey"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Category    string        `json:"category"`
	Icon        string        `json:"icon"`
	SupportedAuth []AuthType   `json:"supportedAuth"`
}

// ConnectorSDK defines the unified contract every external integration connector must implement
type ConnectorSDK interface {
	Initialize(ctx context.Context, config *ConnectorConfig) error
	Authenticate(ctx context.Context, creds *ConnectorCredentials) error
	Validate(ctx context.Context) (bool, error)
	Sync(ctx context.Context, vaultID string) (*SyncJob, error)
	Import(ctx context.Context, resourceID string) (map[string]interface{}, error)
	Export(ctx context.Context, payload map[string]interface{}) (string, error)
	Webhook(ctx context.Context, payload *WebhookPayload) error
	HealthCheck(ctx context.Context) (*HealthCheckResult, error)
	Disconnect(ctx context.Context) error
}

// Request DTOs

type InstallConnectorRequest struct {
	VaultID  string        `json:"vaultId"`
	TypeKey  ConnectorType `json:"typeKey"`
	Name     string        `json:"name"`
	Category string        `json:"category"`
}

type ConfigureConnectorRequest struct {
	VaultID              string                 `json:"vaultId"`
	ConnectorID          string                 `json:"connectorId"`
	SyncDirection        SyncDirection          `json:"syncDirection"`
	AutoSyncIntervalMins int                    `json:"autoSyncIntervalMins"`
	SyncFolder           string                 `json:"syncFolder"`
	AuthType             AuthType               `json:"authType"`
	Credentials          map[string]interface{} `json:"credentials"`
	Settings             map[string]interface{} `json:"settings"`
}

type ToggleConnectorRequest struct {
	VaultID     string `json:"vaultId"`
	ConnectorID string `json:"connectorId"`
	Enable      bool   `json:"enable"`
}

type TriggerSyncRequest struct {
	VaultID     string `json:"vaultId"`
	ConnectorID string `json:"connectorId"`
	JobType     string `json:"jobType"`
}
