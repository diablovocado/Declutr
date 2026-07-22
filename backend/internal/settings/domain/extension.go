package domain

import (
	"time"
)

// Extension Types (20 Supported Types)
const (
	TypeUIPanel             = "UI_PANEL"
	TypeDashboardWidget     = "DASHBOARD_WIDGET"
	TypeSettingsPage        = "SETTINGS_PAGE"
	TypeCommand             = "COMMAND"
	TypeSearchProvider      = "SEARCH_PROVIDER"
	TypeMetadataExtractor   = "METADATA_EXTRACTOR"
	TypeAIProvider          = "AI_PROVIDER"
	TypeEmbeddingProvider   = "EMBEDDING_PROVIDER"
	TypeWorkflowAction      = "WORKFLOW_ACTION"
	TypeWorkflowTrigger     = "WORKFLOW_TRIGGER"
	TypeNotificationProvider = "NOTIFICATION_PROVIDER"
	TypeImporter            = "IMPORTER"
	TypeExporter            = "EXPORTER"
	TypeStorageProvider     = "STORAGE_PROVIDER"
	TypeAuthProvider        = "AUTH_PROVIDER"
	TypeConnectorProvider   = "CONNECTOR_PROVIDER"
	TypeFilePreviewer       = "FILE_PREVIEWER"
	TypeTheme               = "THEME"
	TypeLanguagePack        = "LANGUAGE_PACK"
	TypeCLIExtension        = "CLI_EXTENSION"
)

// Categories
const (
	CategoryAI             = "AI"
	CategoryProductivity   = "Productivity"
	CategoryDocuments      = "Documents"
	CategoryAutomation     = "Automation"
	CategoryStorage        = "Storage"
	CategorySecurity       = "Security"
	CategoryDeveloperTools = "Developer Tools"
	CategoryThemes         = "Themes"
	CategoryUtilities      = "Utilities"
	CategoryCollaboration  = "Collaboration"
)

// Lifecycle States
type InstallationStatus string

const (
	StatusInstalled   InstallationStatus = "INSTALLED"
	StatusEnabled     InstallationStatus = "ENABLED"
	StatusDisabled    InstallationStatus = "DISABLED"
	StatusError       InstallationStatus = "ERROR"
	StatusUninstalled InstallationStatus = "UNINSTALLED"
)

// Permissions Scope
const (
	PermVaultRead        = "vault.read"
	PermVaultWrite       = "vault.write"
	PermWorkflowExecute  = "workflow.execute"
	PermAIGenerate       = "ai.generate"
	PermSearchQuery      = "search.query"
	PermNotificationSend = "notification.send"
	PermStorageRead      = "storage.read"
	PermStorageWrite     = "storage.write"
	PermAdminManage      = "admin.manage"
)

// ExtensionManifest defines the manifest specification.
type ExtensionManifest struct {
	ID                   string            `json:"id"`
	Name                 string            `json:"name"`
	Version              string            `json:"version"`
	Author               string            `json:"author"`
	PublisherID          string            `json:"publisher_id"`
	License              string            `json:"license"`
	Description          string            `json:"description"`
	Category             string            `json:"category"`
	Type                 string            `json:"type"`
	Homepage             string            `json:"homepage"`
	Repository           string            `json:"repository"`
	Capabilities         []string          `json:"capabilities"`
	Permissions          []string          `json:"permissions"`
	Dependencies         map[string]string `json:"dependencies"`
	MinDeclutrVersion    string            `json:"min_declutr_version"`
	MaxDeclutrVersion    string            `json:"max_declutr_version"`
	DigitalSignature     string            `json:"digital_signature"`
}

// Extension represents a published marketplace item.
type Extension struct {
	ID               string            `json:"id"`
	Slug             string            `json:"slug"`
	Manifest         ExtensionManifest `json:"manifest"`
	Publisher        Publisher         `json:"publisher"`
	IsVerified       bool              `json:"is_verified"`
	IsFeatured       bool              `json:"is_featured"`
	DownloadsCount   int               `json:"downloads_count"`
	Rating           float64           `json:"rating"`
	ReviewsCount     int               `json:"reviews_count"`
	CreatedAt        time.Time         `json:"created_at"`
	UpdatedAt        time.Time         `json:"updated_at"`
}

// ExtensionVersion represents a specific published release.
type ExtensionVersion struct {
	ID           string            `json:"id"`
	ExtensionID  string            `json:"extension_id"`
	Version      string            `json:"version"`
	Manifest     ExtensionManifest `json:"manifest"`
	BundleURL    string            `json:"bundle_url"`
	ReleaseNotes string            `json:"release_notes"`
	PublishedAt  time.Time         `json:"published_at"`
}

// ExtensionInstallation tracks an installed extension for a user or org.
type ExtensionInstallation struct {
	ID                  string             `json:"id"`
	ExtensionID         string             `json:"extension_id"`
	UserID              string             `json:"user_id"`
	OrganizationID      string             `json:"organization_id,omitempty"`
	InstalledVersion    string             `json:"installed_version"`
	Status              InstallationStatus `json:"status"`
	ApprovedPermissions []string           `json:"approved_permissions"`
	InstalledAt         time.Time          `json:"installed_at"`
	UpdatedAt           time.Time          `json:"updated_at"`
}

// ExtensionReview represents a user rating & review.
type ExtensionReview struct {
	ID          string    `json:"id"`
	ExtensionID string    `json:"extension_id"`
	UserID      string    `json:"user_id"`
	UserName    string    `json:"user_name"`
	Rating      int       `json:"rating"` // 1-5
	Comment     string    `json:"comment"`
	CreatedAt   time.Time `json:"created_at"`
}

// Publisher represents a verified publisher entity.
type Publisher struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Website     string    `json:"website"`
	IsVerified  bool      `json:"is_verified"`
	CreatedAt   time.Time `json:"created_at"`
}

// ExtensionStats represents operational metrics for an extension.
type ExtensionStats struct {
	ExtensionID  string `json:"extension_id"`
	InstallsCount int   `json:"installs_count"`
	ActiveUsers   int   `json:"active_users"`
	CrashesCount  int   `json:"crashes_count"`
	AvgLatencyMs  int   `json:"avg_latency_ms"`
}
