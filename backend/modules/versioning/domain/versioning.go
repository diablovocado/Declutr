package domain

import "time"

// ResourceType specifies what resource is versioned
type ResourceType string

const (
	ResourceAsset       ResourceType = "ASSET"
	ResourceMetadata    ResourceType = "METADATA"
	ResourceAIAnalysis  ResourceType = "AI_ANALYSIS"
	ResourceContext     ResourceType = "CONTEXT"
	ResourceRel         ResourceType = "RELATIONSHIP"
	ResourceCollection  ResourceType = "COLLECTION"
	ResourceMemory      ResourceType = "MEMORY"
	ResourceWorkflow    ResourceType = "WORKFLOW"
	ResourcePreferences ResourceType = "PREFERENCES"
)

// ChangeType defines the type of change operation
type ChangeType string

const (
	ChangeCreated          ChangeType = "CREATED"
	ChangeUpdated          ChangeType = "UPDATED"
	ChangeDeleted          ChangeType = "DELETED"
	ChangeMoved            ChangeType = "MOVED"
	ChangeRenamed          ChangeType = "RENAMED"
	ChangeAIRegenerated    ChangeType = "AI_REGENERATED"
	ChangePermChanged      ChangeType = "PERMISSION_CHANGED"
	ChangeWorkflowExecuted ChangeType = "WORKFLOW_EXECUTED"
	ChangeSettingsChanged  ChangeType = "SETTINGS_CHANGED"
)

// SnapshotType defines snapshot storage strategy
type SnapshotType string

const (
	SnapshotFull        SnapshotType = "FULL"
	SnapshotIncremental SnapshotType = "INCREMENTAL"
	SnapshotDelta       SnapshotType = "DELTA"
	SnapshotCompressed  SnapshotType = "COMPRESSED"
	SnapshotImmutable   SnapshotType = "IMMUTABLE"
)

// RestoreStatus represents execution state of a restore job
type RestoreStatus string

const (
	RestorePending    RestoreStatus = "PENDING"
	RestoreInProgress RestoreStatus = "IN_PROGRESS"
	RestoreSuccess    RestoreStatus = "SUCCESS"
	RestoreFailed     RestoreStatus = "FAILED"
)

// ResourceVersion model
type ResourceVersion struct {
	VersionID     string       `json:"versionId"`
	VaultID       string       `json:"vaultId"`
	ResourceType  ResourceType `json:"resourceType"`
	ResourceID    string       `json:"resourceId"`
	VersionNumber int          `json:"versionNumber"`
	ChangeType    ChangeType   `json:"changeType"`
	Summary       string       `json:"summary"`
	Checksum      string       `json:"checksum"`
	StorageRef    string       `json:"storageRef,omitempty"`
	CreatedBy     string       `json:"createdBy"`
	CreatedAt     time.Time    `json:"createdAt"`
}

// VersionSnapshot model
type VersionSnapshot struct {
	SnapshotID   string                 `json:"snapshotId"`
	VersionID    string                 `json:"versionId"`
	ResourceID   string                 `json:"resourceId"`
	SnapshotType SnapshotType           `json:"snapshotType"`
	SnapshotData map[string]interface{} `json:"snapshotData"`
	CreatedAt    time.Time              `json:"createdAt"`
}

// RecycleItem model (Soft Delete Bin)
type RecycleItem struct {
	RecycleID    string     `json:"recycleId"`
	VaultID      string     `json:"vaultId"`
	ResourceType ResourceType `json:"resourceType"`
	ResourceID   string     `json:"resourceId"`
	Title        string     `json:"title"`
	OriginalPath string     `json:"originalPath,omitempty"`
	DeletedBy    string     `json:"deletedBy"`
	DeletedAt    time.Time  `json:"deletedAt"`
	ExpiresAt    *time.Time `json:"expiresAt,omitempty"`
	IsRestored   bool       `json:"isRestored"`
	RestoredAt   *time.Time `json:"restoredAt,omitempty"`
}

// VersionDiff comparison payload
type VersionDiff struct {
	DiffID          string                 `json:"diffId"`
	SourceVersionID string                 `json:"sourceVersionId"`
	TargetVersionID string                 `json:"targetVersionId"`
	AddedFields     map[string]interface{} `json:"addedFields"`
	RemovedFields   map[string]interface{} `json:"removedFields"`
	ModifiedFields  map[string]interface{} `json:"modifiedFields"`
	ComputedAt      time.Time              `json:"computedAt"`
}

// VersioningStats metrics
type VersioningStats struct {
	VaultID           string  `json:"vaultId"`
	TotalVersions     int     `json:"totalVersions"`
	TotalSnapshots    int     `json:"totalSnapshots"`
	RecycleBinCount   int     `json:"recycleBinCount"`
	TotalRestores     int     `json:"totalRestores"`
	StorageSavedBytes int64   `json:"storageSavedBytes"`
}

// CreateSnapshotRequest payload
type CreateSnapshotRequest struct {
	VaultID      string                 `json:"vaultId"`
	ResourceType ResourceType           `json:"resourceType"`
	ResourceID   string                 `json:"resourceId"`
	ChangeType   ChangeType             `json:"changeType"`
	Summary      string                 `json:"summary"`
	SnapshotData map[string]interface{} `json:"snapshotData"`
}

// CompareVersionsRequest payload
type CompareVersionsRequest struct {
	SourceVersionID string `json:"sourceVersionId"`
	TargetVersionID string `json:"targetVersionId"`
}

// RestoreVersionRequest payload
type RestoreVersionRequest struct {
	VaultID    string `json:"vaultId"`
	ResourceID string `json:"resourceId"`
	VersionID  string `json:"versionId"`
}
