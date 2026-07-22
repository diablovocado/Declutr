package domain

import "time"

// TimelineEventType categorises events on the chronological timeline
type TimelineEventType string

const (
	EventLife         TimelineEventType = "LIFE"
	EventProject      TimelineEventType = "PROJECT"
	EventTravel       TimelineEventType = "TRAVEL"
	EventMedical      TimelineEventType = "MEDICAL"
	EventEducation    TimelineEventType = "EDUCATION"
	EventFinancial    TimelineEventType = "FINANCIAL"
	EventLegal        TimelineEventType = "LEGAL"
	EventPurchase     TimelineEventType = "PURCHASE"
	EventSubscription TimelineEventType = "SUBSCRIPTION"
	EventCustom       TimelineEventType = "CUSTOM"
)

// InsightType categorises proactive automated knowledge insights
type InsightType string

const (
	InsightExpirationWarning InsightType = "EXPIRATION_WARNING"
	InsightRecurringExpense  InsightType = "RECURRING_EXPENSE"
	InsightFrequentPlace     InsightType = "FREQUENT_PLACE"
	InsightImportantDoc      InsightType = "IMPORTANT_DOC"
	InsightMissingDoc        InsightType = "MISSING_DOC"
	InsightInactiveProject   InsightType = "INACTIVE_PROJECT"
	InsightTrendingInterest  InsightType = "TRENDING_INTEREST"
	InsightKnowledgeGrowth   InsightType = "KNOWLEDGE_GROWTH"
	InsightRepeatedPattern   InsightType = "REPEATED_PATTERN"
)

// MilestoneType categorises major detected milestone events
type MilestoneType string

const (
	MilestonePassportExp  MilestoneType = "PASSPORT_EXPIRATION"
	MilestoneVisaComp     MilestoneType = "VISA_COMPLETED"
	MilestoneTaxFiled     MilestoneType = "TAX_FILED"
	MilestoneAdmissionComp MilestoneType = "ADMISSION_COMPLETED"
	MilestoneMedicalComp  MilestoneType = "MEDICAL_COMPLETED"
	MilestoneProjectMs    MilestoneType = "PROJECT_MILESTONE"
	MilestoneTravelComp   MilestoneType = "TRAVEL_COMPLETED"
)

// MilestoneStatus represents the status of a milestone
type MilestoneStatus string

const (
	StatusPending   MilestoneStatus = "PENDING"
	StatusUpcoming  MilestoneStatus = "UPCOMING"
	StatusCompleted MilestoneStatus = "COMPLETED"
	StatusExpired   MilestoneStatus = "EXPIRED"
)

// TimelineEvent represents a single event on the chronological timeline
type TimelineEvent struct {
	EventID         string            `json:"eventId"`
	VaultID         string            `json:"vaultId"`
	EventType       TimelineEventType `json:"eventType"`
	Title           string            `json:"title"`
	Summary         string            `json:"summary"`
	EventTimestamp  time.Time         `json:"eventTimestamp"`
	Importance      float64           `json:"importance"`
	Confidence      float64           `json:"confidence"`
	RelatedAssets   []string          `json:"relatedAssets,omitempty"`
	RelatedEntities []string          `json:"relatedEntities,omitempty"`
	RelatedContexts []string          `json:"relatedContexts,omitempty"`
	GeneratedBy     string            `json:"generatedBy"`
	CreatedAt       time.Time         `json:"createdAt"`
	UpdatedAt       time.Time         `json:"updatedAt"`
}

// TimelineGroup represents a sequence of related timeline events
type TimelineGroup struct {
	GroupID    string     `json:"groupId"`
	VaultID    string     `json:"vaultId"`
	GroupName  string     `json:"groupName"`
	GroupType  string     `json:"groupType"`
	EventIDs   []string   `json:"eventIds"`
	StartDate  *time.Time `json:"startDate,omitempty"`
	EndDate    *time.Time `json:"endDate,omitempty"`
	CreatedAt  time.Time  `json:"createdAt"`
}

// KnowledgeInsight represents a proactive insight with full explainability
type KnowledgeInsight struct {
	InsightID       string      `json:"insightId"`
	VaultID         string      `json:"vaultId"`
	InsightType     InsightType `json:"insightType"`
	Title           string      `json:"title"`
	Summary         string      `json:"summary"`
	WhyGenerated    string      `json:"whyGenerated"`
	Evidence        []string    `json:"evidence"`
	RelatedAssets   []string    `json:"relatedAssets,omitempty"`
	RelatedEntities []string    `json:"relatedEntities,omitempty"`
	Importance      float64     `json:"importance"`
	Confidence      float64     `json:"confidence"`
	IsDismissed     bool        `json:"isDismissed"`
	CreatedAt       time.Time   `json:"createdAt"`
	UpdatedAt       time.Time   `json:"updatedAt"`
}

// InsightHistoryItem tracks actions taken on insights
type InsightHistoryItem struct {
	HistoryID   string    `json:"historyId"`
	VaultID     string    `json:"vaultId"`
	InsightID   string    `json:"insightId"`
	ActionTaken string    `json:"actionTaken"` // GENERATED, DISMISSED, ACTIONED
	CreatedAt   time.Time `json:"createdAt"`
}

// InsightPreferences holds user preferences for proactive insights
type InsightPreferences struct {
	PreferenceID  string   `json:"preferenceId"`
	VaultID       string   `json:"vaultId"`
	EnabledTypes  []string `json:"enabledTypes"`
	MinConfidence float64  `json:"minConfidence"`
	AutoRefresh   bool     `json:"autoRefresh"`
	CreatedAt     time.Time`json:"createdAt"`
	UpdatedAt     time.Time`json:"updatedAt"`
}

// Milestone represents a detected major milestone
type Milestone struct {
	MilestoneID    string          `json:"milestoneId"`
	VaultID        string          `json:"vaultId"`
	MilestoneType  MilestoneType   `json:"milestoneType"`
	Title          string          `json:"title"`
	Status         MilestoneStatus `json:"status"`
	DueDate        *time.Time      `json:"dueDate,omitempty"`
	RelatedAssetID string          `json:"relatedAssetId,omitempty"`
	Importance     float64         `json:"importance"`
	CreatedAt      time.Time       `json:"createdAt"`
}

// TimelineFilter options for querying the timeline
type TimelineFilter struct {
	EventType TimelineEventType `json:"eventType,omitempty"`
	DateFrom  *time.Time        `json:"dateFrom,omitempty"`
	DateTo    *time.Time        `json:"dateTo,omitempty"`
	ContextID string            `json:"contextId,omitempty"`
}

// InsightStats holds vault-level insight metrics
type InsightStats struct {
	VaultID            string         `json:"vaultId"`
	TotalTimelineEvents int           `json:"totalTimelineEvents"`
	TotalActiveInsights int           `json:"totalActiveInsights"`
	TotalMilestones     int           `json:"totalMilestones"`
	UpcomingExpirations int           `json:"upcomingExpirations"`
	TypeBreakdown      map[string]int `json:"typeBreakdown"`
}
