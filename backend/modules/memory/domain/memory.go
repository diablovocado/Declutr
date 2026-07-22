package domain

import "time"

// MemoryType represents the lifecycle stage of a memory
type MemoryType string

const (
	MemoryTypeShortTerm  MemoryType = "SHORT_TERM"
	MemoryTypeWorking    MemoryType = "WORKING"
	MemoryTypeLongTerm   MemoryType = "LONG_TERM"
	MemoryTypeArchived   MemoryType = "ARCHIVED"
	MemoryTypeForgotten  MemoryType = "FORGOTTEN"
	MemoryTypePinned     MemoryType = "PINNED"
	MemoryTypeGenerated  MemoryType = "GENERATED"
	MemoryTypeUser       MemoryType = "USER"
	MemoryTypeAI         MemoryType = "AI"
)

// MemoryEventType represents lifecycle events on a memory
type MemoryEventType string

const (
	MemoryEventFormed      MemoryEventType = "FORMED"
	MemoryEventStrengthened MemoryEventType = "STRENGTHENED"
	MemoryEventDecayed     MemoryEventType = "DECAYED"
	MemoryEventPinned      MemoryEventType = "PINNED"
	MemoryEventArchived    MemoryEventType = "ARCHIVED"
	MemoryEventMerged      MemoryEventType = "MERGED"
	MemoryEventAccessed    MemoryEventType = "ACCESSED"
	MemoryEventReset       MemoryEventType = "RESET"
)

// SourceType categorises what contributed to a memory
type SourceType string

const (
	SourceAsset        SourceType = "ASSET"
	SourceEntity       SourceType = "ENTITY"
	SourceRelationship SourceType = "RELATIONSHIP"
	SourceContext      SourceType = "CONTEXT"
	SourcePersona      SourceType = "PERSONA"
)

// Memory is the core persistent knowledge object
type Memory struct {
	MemoryID       string     `json:"memoryId"`
	VaultID        string     `json:"vaultId"`
	Title          string     `json:"title"`
	Summary        string     `json:"summary"`
	MemoryType     MemoryType `json:"memoryType"`
	ImportanceScore float64   `json:"importanceScore"`
	Confidence      float64   `json:"confidence"`
	Recency         float64   `json:"recency"`
	Frequency       int       `json:"frequency"`
	MemoryStrength  float64   `json:"memoryStrength"` // composite [0,1]
	DecayRate       float64   `json:"decayRate"`
	IsPinned        bool      `json:"isPinned"`
	IsArchived      bool      `json:"isArchived"`
	PinReason       string    `json:"pinReason,omitempty"`
	LastAccessedAt  *time.Time `json:"lastAccessedAt,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

// MemorySource tracks which assets/entities/contexts formed this memory
type MemorySource struct {
	SourceID           string     `json:"sourceId"`
	MemoryID           string     `json:"memoryId"`
	SourceType         SourceType `json:"sourceType"`
	SourceRefID        string     `json:"sourceRefId"` // ID of contributing source
	ContributionWeight float64    `json:"contributionWeight"`
	CreatedAt          time.Time  `json:"createdAt"`
}

// MemoryScore captures a point-in-time strength calculation
type MemoryScore struct {
	ScoreID          string    `json:"scoreId"`
	MemoryID         string    `json:"memoryId"`
	Importance       float64   `json:"importance"`
	Recency          float64   `json:"recency"`
	Frequency        int       `json:"frequency"`
	Confidence       float64   `json:"confidence"`
	DecayFactor      float64   `json:"decayFactor"`
	CompositeStrength float64  `json:"compositeStrength"`
	ScoredAt         time.Time `json:"scoredAt"`
}

// MemoryEvent is an immutable lifecycle event log entry
type MemoryEvent struct {
	EventID   string                 `json:"eventId"`
	MemoryID  string                 `json:"memoryId"`
	EventType MemoryEventType        `json:"eventType"`
	EventData map[string]interface{} `json:"eventData"`
	OccurredAt time.Time             `json:"occurredAt"`
}

// MemoryHistory is an immutable state snapshot
type MemoryHistory struct {
	HistoryID      string                 `json:"historyId"`
	MemoryID       string                 `json:"memoryId"`
	VaultID        string                 `json:"vaultId"`
	MemoryType     string                 `json:"memoryType"`
	StrengthSnapshot float64              `json:"strengthSnapshot"`
	SnapshotReason string                 `json:"snapshotReason"`
	SnapshotData   map[string]interface{} `json:"snapshotData"`
	CreatedAt      time.Time              `json:"createdAt"`
}

// MemorySettings holds per-vault memory configuration
type MemorySettings struct {
	SettingsID            string    `json:"settingsId"`
	VaultID               string    `json:"vaultId"`
	MemoryLearningEnabled bool      `json:"memoryLearningEnabled"`
	AutoArchiveThreshold  float64   `json:"autoArchiveThreshold"` // strength < this → ARCHIVED
	AutoForgetThreshold   float64   `json:"autoForgetThreshold"`  // strength < this → FORGOTTEN
	DefaultDecayRate      float64   `json:"defaultDecayRate"`
	MaxWorkingMemories    int       `json:"maxWorkingMemories"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}

// MemoryCluster groups related memories
type MemoryCluster struct {
	ClusterID       string    `json:"clusterId"`
	VaultID         string    `json:"vaultId"`
	ClusterName     string    `json:"clusterName"`
	ClusterType     string    `json:"clusterType"` // TOPIC, ENTITY, CONTEXT, TEMPORAL, PERSONA
	MemberMemoryIDs []string  `json:"memberMemoryIds"`
	CohesionScore   float64   `json:"cohesionScore"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// MemoryDetail is the full enriched view of a single memory
type MemoryDetail struct {
	Memory  *Memory         `json:"memory"`
	Sources []*MemorySource `json:"sources"`
	Scores  []*MemoryScore  `json:"scores"`
	Events  []*MemoryEvent  `json:"events"`
}

// MemoryStats provides vault-level statistics
type MemoryStats struct {
	VaultID        string             `json:"vaultId"`
	TotalMemories  int                `json:"totalMemories"`
	Pinned         int                `json:"pinned"`
	LongTerm       int                `json:"longTerm"`
	Working        int                `json:"working"`
	Archived       int                `json:"archived"`
	Forgotten      int                `json:"forgotten"`
	AvgStrength    float64            `json:"avgStrength"`
	TypeBreakdown  map[string]int     `json:"typeBreakdown"`
}

// MemoryFormationRequest carries the inputs needed to form a new memory
type MemoryFormationRequest struct {
	VaultID     string
	Title       string
	Summary     string
	MemoryType  MemoryType
	Sources     []MemorySourceInput
	Importance  float64
	Confidence  float64
}

// MemorySourceInput represents a single contributing source
type MemorySourceInput struct {
	SourceType SourceType
	SourceRefID string
	Weight     float64
}
