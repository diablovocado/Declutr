package domain

import "time"

type ContextStatus string

const (
	StatusActive     ContextStatus = "ACTIVE"
	StatusArchived   ContextStatus = "ARCHIVED"
	StatusMerged     ContextStatus = "MERGED"
	StatusUnreviewed ContextStatus = "UNREVIEWED"
)

type Context struct {
	ContextID       string                 `json:"contextId"`
	VaultID         string                 `json:"vaultId"`
	Name            string                 `json:"name"`
	Type            string                 `json:"type"` // Travel, Financial, Medical, Legal, Project, Life Activity, etc.
	Summary         string                 `json:"summary"`
	Status          ContextStatus          `json:"status"`
	ConfidenceScore float64                `json:"confidenceScore"`
	Metadata        map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt       time.Time              `json:"createdAt"`
	UpdatedAt       time.Time              `json:"updatedAt"`
}

type ContextAsset struct {
	ID              string    `json:"id"`
	ContextID       string    `json:"contextId"`
	AssetID         string    `json:"assetId"`
	ConfidenceScore float64   `json:"confidenceScore"`
	Evidence        string    `json:"evidence"`
	Reasoning       string    `json:"reasoning"`
	PromptVersion   string    `json:"promptVersion"`
	AddedAt         time.Time `json:"addedAt"`
}

type ContextEvent struct {
	EventID         string     `json:"eventId"`
	ContextID       string     `json:"contextId"`
	EventType       string     `json:"eventType"` // Trip, Meeting, Purchase, Hospital Visit, Flight, Conference, Contract Signing, Birthday, Anniversary, Interview
	EventName       string     `json:"eventName"`
	EventDate       *time.Time `json:"eventDate,omitempty"`
	Location        string     `json:"location,omitempty"`
	ConfidenceScore float64    `json:"confidenceScore"`
	Evidence        string     `json:"evidence"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type IntentType struct {
	IntentTypeID string    `json:"intentTypeId"`
	Name         string    `json:"name"` // Travel, Finance, Health, Legal, Identity, Education, Business, Shopping, Personal, Entertainment, Research, Knowledge
	Description  string    `json:"description"`
	Category     string    `json:"category"`
	CreatedAt    time.Time `json:"createdAt"`
}

type IntentPrediction struct {
	PredictionID    string    `json:"predictionId"`
	AssetID         string    `json:"assetId"`
	VaultID         string    `json:"vaultId"`
	IntentTypeName  string    `json:"intentTypeName"`
	ConfidenceScore float64   `json:"confidenceScore"`
	Evidence        string    `json:"evidence"`
	Reasoning       string    `json:"reasoning"`
	PromptVersion   string    `json:"promptVersion"`
	CreatedAt       time.Time `json:"createdAt"`
}

type ContextVersion struct {
	VersionID      string                 `json:"versionId"`
	ContextID      string                 `json:"contextId"`
	VersionNumber  int                    `json:"versionNumber"`
	PromptVersion  string                 `json:"promptVersion"`
	ModelName      string                 `json:"modelName"`
	ChangesSummary string                 `json:"changesSummary"`
	TokenUsage     map[string]interface{} `json:"tokenUsage,omitempty"`
	LatencyMs      int                    `json:"latencyMs"`
	CreatedAt      time.Time              `json:"createdAt"`
}

type ContextStats struct {
	TotalContexts     int            `json:"totalContexts"`
	ActiveContexts    int            `json:"activeContexts"`
	TotalEvents       int            `json:"totalEvents"`
	IntentBreakdown   map[string]int `json:"intentBreakdown"`
	AverageConfidence float64        `json:"averageConfidence"`
}

type ContextDetail struct {
	Context           *Context            `json:"context"`
	Assets            []*ContextAsset     `json:"assets"`
	Events            []*ContextEvent     `json:"events"`
	RecentPredictions []*IntentPrediction `json:"recentPredictions,omitempty"`
	Versions          []*ContextVersion   `json:"versions,omitempty"`
}
