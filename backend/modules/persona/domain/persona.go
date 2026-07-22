package domain

import "time"

// SignalType represents the kind of user behaviour being tracked
type SignalType string

const (
	SignalAssetOpen           SignalType = "ASSET_OPEN"
	SignalSearch              SignalType = "SEARCH"
	SignalPin                 SignalType = "PIN"
	SignalUpload              SignalType = "UPLOAD"
	SignalEdit                SignalType = "EDIT"
	SignalContextSwitch       SignalType = "CONTEXT_SWITCH"
	SignalRelationshipExplore SignalType = "RELATIONSHIP_EXPLORE"
	SignalCollectionUse       SignalType = "COLLECTION_USE"
	SignalTimeOfDay           SignalType = "TIME_OF_DAY"
	SignalSearchRefinement    SignalType = "SEARCH_REFINEMENT"
	SignalDashboardUsage      SignalType = "DASHBOARD_USAGE"
	SignalFavourite           SignalType = "FAVOURITE"
)

// RecommendationType categorises the kind of recommendation
type RecommendationType string

const (
	RecommendContinueProject   RecommendationType = "CONTINUE_PROJECT"
	RecommendResumeReading     RecommendationType = "RESUME_READING"
	RecommendRelatedDocument   RecommendationType = "RELATED_DOCUMENT"
	RecommendSuggestedContext  RecommendationType = "SUGGESTED_CONTEXT"
	RecommendSuggestedCollection RecommendationType = "SUGGESTED_COLLECTION"
	RecommendSuggestedArchive  RecommendationType = "SUGGESTED_ARCHIVE"
	RecommendSuggestedRelationship RecommendationType = "SUGGESTED_RELATIONSHIP"
)

// ScoreTrend represents whether a dimension is growing or shrinking in relevance
type ScoreTrend string

const (
	TrendRising  ScoreTrend = "RISING"
	TrendFalling ScoreTrend = "FALLING"
	TrendStable  ScoreTrend = "STABLE"
)

// PersonaProfile is the root dynamic persona model per vault
type PersonaProfile struct {
	ProfileID      string                 `json:"profileId"`
	VaultID        string                 `json:"vaultId"`
	PersonaType    string                 `json:"personaType"` // Traveller, Developer, Researcher, Student, Entrepreneur, etc.
	ConfidenceScore float64               `json:"confidenceScore"`
	Attributes     map[string]interface{} `json:"attributes"`     // dynamic scored dimension map
	KnowledgeModel *PersonaKnowledgeModel `json:"knowledgeModel"` // frequent entities, interests, locations
	CreatedAt      time.Time              `json:"createdAt"`
	UpdatedAt      time.Time              `json:"updatedAt"`
}

// PersonaKnowledgeModel contains inferred personal knowledge about the user
type PersonaKnowledgeModel struct {
	FrequentEntities    []string `json:"frequentEntities"`
	FavouriteLocations  []string `json:"favouriteLocations"`
	RecurringProjects   []string `json:"recurringProjects"`
	LongTermInterests   []string `json:"longTermInterests"`
	ActiveContexts      []string `json:"activeContexts"`
	RecurringContacts   []string `json:"recurringContacts"`
	CommonWorkflows     []string `json:"commonWorkflows"`
	FrequentVaultAreas  []string `json:"frequentVaultAreas"`
}

// PersonaSignal is a single raw behaviour event
type PersonaSignal struct {
	SignalID    string     `json:"signalId"`
	VaultID    string     `json:"vaultId"`
	SignalType  SignalType `json:"signalType"`
	AssetID    string     `json:"assetId,omitempty"`
	Value      string     `json:"value,omitempty"` // e.g. search term, context name, file type
	Weight     float64    `json:"weight"`
	Source     string     `json:"source"`
	IsDisabled bool       `json:"isDisabled"`
	RecordedAt time.Time  `json:"recordedAt"`
}

// PersonaScore represents a scored dimension with full decay tracking
type PersonaScore struct {
	ScoreID    string     `json:"scoreId"`
	VaultID    string     `json:"vaultId"`
	Dimension  string     `json:"dimension"` // e.g. "Travel", "Software Development"
	Importance float64    `json:"importance"`
	Recency    float64    `json:"recency"`
	Frequency  int        `json:"frequency"`
	Confidence float64    `json:"confidence"`
	DecayRate  float64    `json:"decayRate"`
	Trend      ScoreTrend `json:"trend"`
	LastSeenAt *time.Time `json:"lastSeenAt,omitempty"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

// PersonaInterest represents an inferred long-term topic of interest
type PersonaInterest struct {
	InterestID       string     `json:"interestId"`
	VaultID          string     `json:"vaultId"`
	Topic            string     `json:"topic"`
	EntityType       string     `json:"entityType,omitempty"` // Person, Location, Organization, Topic
	FrequencyScore   float64    `json:"frequencyScore"`
	PersonalRelevance float64   `json:"personalRelevance"`
	LastSeenAt       *time.Time `json:"lastSeenAt,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
}

// PersonaRecommendation is a single explainable recommendation
type PersonaRecommendation struct {
	RecommendationID    string             `json:"recommendationId"`
	VaultID             string             `json:"vaultId"`
	RecommendationType  RecommendationType `json:"recommendationType"`
	Title               string             `json:"title"`
	Reason              string             `json:"reason"`               // why this recommendation exists
	Confidence          float64            `json:"confidence"`
	Evidence            []string           `json:"evidence"`             // supporting evidence text
	RelatedAssetIDs     []string           `json:"relatedAssetIds"`
	ContributingSignals []string           `json:"contributingSignals"` // which signals contributed
	IsDismissed         bool               `json:"isDismissed"`
	CreatedAt           time.Time          `json:"createdAt"`
}

// PersonaSettings represents the user's privacy controls
type PersonaSettings struct {
	SettingsID          string     `json:"settingsId"`
	VaultID             string     `json:"vaultId"`
	LearningPaused      bool       `json:"learningPaused"`
	DisabledSignalTypes []string   `json:"disabledSignalTypes"`
	AllowExport         bool       `json:"allowExport"`
	DataRetentionDays   *int       `json:"dataRetentionDays,omitempty"` // nil = keep forever
	CreatedAt           time.Time  `json:"createdAt"`
	UpdatedAt           time.Time  `json:"updatedAt"`
}

// PersonaHistory is an immutable audit snapshot
type PersonaHistory struct {
	SnapshotID    string                 `json:"snapshotId"`
	VaultID       string                 `json:"vaultId"`
	PersonaType   string                 `json:"personaType"`
	SnapshotData  map[string]interface{} `json:"snapshotData"`
	SnapshotReason string                `json:"snapshotReason"`
	CreatedAt     time.Time              `json:"createdAt"`
}

// PersonaExport is the full exportable data bundle
type PersonaExport struct {
	VaultID         string                   `json:"vaultId"`
	ExportedAt      time.Time                `json:"exportedAt"`
	Profile         *PersonaProfile          `json:"profile"`
	Signals         []*PersonaSignal         `json:"signals"`
	Scores          []*PersonaScore          `json:"scores"`
	Interests       []*PersonaInterest       `json:"interests"`
	Recommendations []*PersonaRecommendation `json:"recommendations"`
	Settings        *PersonaSettings         `json:"settings"`
	History         []*PersonaHistory        `json:"history"`
}
