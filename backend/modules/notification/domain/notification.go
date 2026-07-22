package domain

import "time"

// NotificationType specifies notification categories
type NotificationType string

const (
	TypeInfo           NotificationType = "INFORMATION"
	TypeSuccess        NotificationType = "SUCCESS"
	TypeWarning        NotificationType = "WARNING"
	TypeCritical       NotificationType = "CRITICAL"
	TypeReminder       NotificationType = "REMINDER"
	TypeRecommendation NotificationType = "RECOMMENDATION"
	TypeAIInsight      NotificationType = "AI_INSIGHT"
	TypeWorkflow       NotificationType = "WORKFLOW"
	TypeSecurity       NotificationType = "SECURITY"
	TypeSystem         NotificationType = "SYSTEM"
)

// PriorityLevel defines urgency levels
type PriorityLevel string

const (
	PriorityLow    PriorityLevel = "LOW"
	PriorityMedium PriorityLevel = "MEDIUM"
	PriorityHigh   PriorityLevel = "HIGH"
	PriorityUrgent PriorityLevel = "URGENT"
)

// ActionType specifies user action options
type ActionType string

const (
	ActionNone        ActionType = "NONE"
	ActionOpenAsset   ActionType = "OPEN_ASSET"
	ActionViewContext ActionType = "VIEW_CONTEXT"
	ActionRunWorkflow ActionType = "RUN_WORKFLOW"
	ActionRetryJob    ActionType = "RETRY_JOB"
	ActionDismiss     ActionType = "DISMISS"
	ActionPin         ActionType = "PIN"
	ActionArchive     ActionType = "ARCHIVE"
	ActionSnooze      ActionType = "SNOOZE"
)

// ChannelType defines delivery channels
type ChannelType string

const (
	ChannelInApp   ChannelType = "IN_APP"
	ChannelEmail   ChannelType = "EMAIL"
	ChannelPush    ChannelType = "PUSH"
	ChannelDesktop ChannelType = "DESKTOP"
)

// DigestType defines digest frequencies
type DigestType string

const (
	DigestDaily   DigestType = "DAILY"
	DigestWeekly  DigestType = "WEEKLY"
	DigestMonthly DigestType = "MONTHLY"
)

// Notification model
type Notification struct {
	NotificationID  string                 `json:"notificationId"`
	VaultID         string                 `json:"vaultId"`
	Type            NotificationType       `json:"type"`
	Priority        PriorityLevel          `json:"priority"`
	Title           string                 `json:"title"`
	Message         string                 `json:"message"`
	Summary         string                 `json:"summary,omitempty"`
	RelatedAssets   []string               `json:"relatedAssets,omitempty"`
	RelatedContext  map[string]interface{} `json:"relatedContext,omitempty"`
	RelatedWorkflow map[string]interface{} `json:"relatedWorkflow,omitempty"`
	ActionType      ActionType             `json:"actionType"`
	IsRead          bool                   `json:"isRead"`
	ReadAt          *time.Time             `json:"readAt,omitempty"`
	IsDismissed     bool                   `json:"isDismissed"`
	DismissedAt     *time.Time             `json:"dismissedAt,omitempty"`
	ExpiresAt       *time.Time             `json:"expiresAt,omitempty"`
	CreatedAt       time.Time              `json:"createdAt"`
}

// NotificationPreferences model
type NotificationPreferences struct {
	PreferenceID    string             `json:"preferenceId"`
	VaultID         string             `json:"vaultId"`
	EnabledTypes    []NotificationType `json:"enabledTypes"`
	InAppEnabled    bool               `json:"inAppEnabled"`
	EmailEnabled    bool               `json:"emailEnabled"`
	PushEnabled     bool               `json:"pushEnabled"`
	DesktopEnabled  bool               `json:"desktopEnabled"`
	DigestFrequency DigestType         `json:"digestFrequency"`
	CreatedAt       time.Time          `json:"createdAt"`
	UpdatedAt       time.Time          `json:"updatedAt"`
}

// DigestReport model
type DigestReport struct {
	DigestID    string                 `json:"digestId"`
	VaultID     string                 `json:"vaultId"`
	DigestType  DigestType             `json:"digestType"`
	Title       string                 `json:"title"`
	Summary     string                 `json:"summary"`
	ContentData map[string]interface{} `json:"contentData"`
	GeneratedAt time.Time              `json:"generatedAt"`
}

// NotificationStats model
type NotificationStats struct {
	VaultID            string  `json:"vaultId"`
	TotalNotifications int     `json:"totalNotifications"`
	UnreadCount        int     `json:"unreadCount"`
	UrgentCount        int     `json:"urgentCount"`
	ReadRate           float64 `json:"readRate"`
}

// MarkReadRequest payload
type MarkReadRequest struct {
	VaultID         string   `json:"vaultId"`
	NotificationIDs []string `json:"notificationIds,omitempty"` // empty = mark all read
}

// ActionRequest payload
type ActionRequest struct {
	NotificationID string     `json:"notificationId"`
	ActionType     ActionType `json:"actionType"`
}
