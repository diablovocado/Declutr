package domain

import "time"

// QueueStatus defines the lifecycle status of a sync queue item
type QueueStatus string

const (
	QueueQueued     QueueStatus = "QUEUED"
	QueueUploading  QueueStatus = "UPLOADING"
	QueueDownloading QueueStatus = "DOWNLOADING"
	QueueRetry      QueueStatus = "RETRY"
	QueuePaused     QueueStatus = "PAUSED"
	QueueCompleted  QueueStatus = "COMPLETED"
	QueueFailed     QueueStatus = "FAILED"
	QueueCancelled  QueueStatus = "CANCELLED"
)

// SyncChangeType specifies local mutation operation
type SyncChangeType string

const (
	SyncCreate           SyncChangeType = "CREATE"
	SyncUpdate           SyncChangeType = "UPDATE"
	SyncDelete           SyncChangeType = "DELETE"
	SyncMove             SyncChangeType = "MOVE"
	SyncRename           SyncChangeType = "RENAME"
	SyncPermissionChange SyncChangeType = "PERMISSION_CHANGE"
)

// ConflictStrategy specifies conflict resolution strategy
type ConflictStrategy string

const (
	StrategyLastWriteWins   ConflictStrategy = "LAST_WRITE_WINS"
	StrategyFieldLevelMerge ConflictStrategy = "FIELD_LEVEL_MERGE"
	StrategyVersionBased    ConflictStrategy = "VERSION_BASED_MERGE"
	StrategyManual          ConflictStrategy = "MANUAL_RESOLUTION"
)

// ConflictStatus defines resolution status
type ConflictStatus string

const (
	ConflictUnresolved     ConflictStatus = "UNRESOLVED"
	ConflictResolvedLocal  ConflictStatus = "RESOLVED_LOCAL"
	ConflictResolvedRemote ConflictStatus = "RESOLVED_REMOTE"
	ConflictResolvedMerge  ConflictStatus = "RESOLVED_MERGE"
)

// SessionType defines sync stream classification
type SessionType string

const (
	SessionPush     SessionType = "PUSH"
	SessionPull     SessionType = "PULL"
	SessionFullSync SessionType = "FULL_SYNC"
)

// SyncQueueItem model
type SyncQueueItem struct {
	QueueID      string                 `json:"queueId"`
	VaultID      string                 `json:"vaultId"`
	DeviceID     string                 `json:"deviceId"`
	ResourceType string                 `json:"resourceType"`
	ResourceID   string                 `json:"resourceId"`
	ChangeType   SyncChangeType         `json:"changeType"`
	Status       QueueStatus            `json:"status"`
	Payload      map[string]interface{} `json:"payload"`
	RetryCount   int                    `json:"retryCount"`
	ErrorMsg     string                 `json:"errorMsg,omitempty"`
	QueuedAt     time.Time              `json:"queuedAt"`
	UpdatedAt    time.Time              `json:"updatedAt"`
}

// SyncEvent model (sequence log)
type SyncEvent struct {
	EventID      string                 `json:"eventId"`
	VaultID      string                 `json:"vaultId"`
	DeviceID     string                 `json:"deviceId"`
	SequenceNum  int64                  `json:"sequenceNum"`
	ResourceType string                 `json:"resourceType"`
	ResourceID   string                 `json:"resourceId"`
	ChangeType   SyncChangeType         `json:"changeType"`
	Payload      map[string]interface{} `json:"payload"`
	Checksum     string                 `json:"checksum"`
	CreatedAt    time.Time              `json:"createdAt"`
}

// SyncConflict model
type SyncConflict struct {
	ConflictID      string                 `json:"conflictId"`
	VaultID         string                 `json:"vaultId"`
	DeviceID        string                 `json:"deviceId"`
	ResourceType    string                 `json:"resourceType"`
	ResourceID      string                 `json:"resourceId"`
	LocalPayload    map[string]interface{} `json:"localPayload"`
	RemotePayload   map[string]interface{} `json:"remotePayload"`
	Strategy        ConflictStrategy       `json:"strategy"`
	Status          ConflictStatus         `json:"status"`
	ResolvedPayload map[string]interface{} `json:"resolvedPayload,omitempty"`
	DetectedAt      time.Time              `json:"detectedAt"`
	ResolvedAt      *time.Time             `json:"resolvedAt,omitempty"`
}

// DeviceState model
type DeviceState struct {
	StateID       string    `json:"stateId"`
	VaultID       string    `json:"vaultId"`
	DeviceID      string    `json:"deviceId"`
	LastPushedSeq int64     `json:"lastPushedSeq"`
	LastPulledSeq int64     `json:"lastPulledSeq"`
	LastSyncAt    time.Time `json:"lastSyncAt"`
	IsOnline      bool      `json:"isOnline"`
}

// SyncStats model
type SyncStats struct {
	VaultID             string    `json:"vaultId"`
	TotalSyncedEvents   int64     `json:"totalSyncedEvents"`
	PendingQueueCount   int       `json:"pendingQueueCount"`
	ActiveConflictsCount int       `json:"activeConflictsCount"`
	LastSyncDurationMs  int64     `json:"lastSyncDurationMs"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// DTO Requests

type PushChangesRequest struct {
	VaultID  string           `json:"vaultId"`
	DeviceID string           `json:"deviceId"`
	Events   []*SyncQueueItem `json:"events"`
}

type PullChangesRequest struct {
	VaultID     string `json:"vaultId"`
	DeviceID    string `json:"deviceId"`
	SinceSeqNum int64  `json:"sinceSeqNum"`
	Limit       int    `json:"limit"`
}

type ResolveConflictRequest struct {
	VaultID         string                 `json:"vaultId"`
	ConflictID      string                 `json:"conflictId"`
	Resolution      ConflictStatus         `json:"resolution"` // RESOLVED_LOCAL, RESOLVED_REMOTE, RESOLVED_MERGE
	ResolvedPayload map[string]interface{} `json:"resolvedPayload,omitempty"`
}

type RegisterDeviceRequest struct {
	VaultID  string `json:"vaultId"`
	DeviceID string `json:"deviceId"`
	IsOnline bool   `json:"isOnline"`
}
