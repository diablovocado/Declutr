package domain

import "time"

// MessageRole represents the author of a message
type MessageRole string

const (
	RoleUser      MessageRole = "USER"
	RoleAssistant MessageRole = "ASSISTANT"
	RoleSystem    MessageRole = "SYSTEM"
)

// IntentCategory represents classified user question intent
type IntentCategory string

const (
	IntentSummary      IntentCategory = "SUMMARY"
	IntentTimelineQuery IntentCategory = "TIMELINE_QUERY"
	IntentMemoryRecall IntentCategory = "MEMORY_RECALL"
	IntentEntityExplore IntentCategory = "ENTITY_EXPLORE"
	IntentGeneralQA    IntentCategory = "GENERAL_QA"
)

// Citation represents a grounded source citation linked to a vault asset
type Citation struct {
	CitationID      string   `json:"citationId"`
	AssetID         string   `json:"assetId"`
	Title           string   `json:"title"`
	Summary         string   `json:"summary"`
	AssetType       string   `json:"assetType"`
	Snippet         string   `json:"snippet"`
	Confidence      float64  `json:"confidence"`
	MatchedEntities []string `json:"matchedEntities,omitempty"`
	MatchedContexts []string `json:"matchedContexts,omitempty"`
}

// Message represents a message in a RAG conversation
type Message struct {
	MessageID         string      `json:"messageId"`
	ConversationID    string      `json:"conversationId"`
	VaultID           string      `json:"vaultId"`
	Role              MessageRole `json:"role"`
	Content           string      `json:"content"`
	TokensUsed        int         `json:"tokensUsed"`
	Citations         []Citation  `json:"citations,omitempty"`
	Confidence        float64     `json:"confidence"`
	ReasoningOverview string      `json:"reasoningOverview,omitempty"`
	CreatedAt         time.Time   `json:"createdAt"`
}

// Conversation represents a multi-turn session
type Conversation struct {
	ConversationID string    `json:"conversationId"`
	VaultID        string    `json:"vaultId"`
	Title          string    `json:"title"`
	Summary        string    `json:"summary"`
	Status         string    `json:"status"` // ACTIVE, ARCHIVED
	MessageCount   int       `json:"messageCount"`
	LastMessageAt  time.Time `json:"lastMessageAt"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// RAGContext snapshot passed into LLM prompt builder
type RAGContext struct {
	QueryText          string     `json:"queryText"`
	Intent             IntentCategory `json:"intent"`
	RetrievedAssets    []Citation `json:"retrievedAssets"`
	RetrievedEntities  []string   `json:"retrievedEntities"`
	RetrievedMemories  []string   `json:"retrievedMemories"`
	RetrievedTimeline  []string   `json:"retrievedTimeline"`
	RetrievedContexts  []string   `json:"retrievedContexts"`
}

// SendMessageRequest payload for posting user message
type SendMessageRequest struct {
	ConversationID string `json:"conversationId,omitempty"`
	VaultID        string `json:"vaultId"`
	Question       string `json:"question"`
}

// SendMessageResponse payload returned to client
type SendMessageResponse struct {
	ConversationID   string     `json:"conversationId"`
	UserMessage      *Message   `json:"userMessage"`
	AssistantMessage *Message   `json:"assistantMessage"`
	Citations        []Citation `json:"citations"`
	Intent           string     `json:"intent"`
	LatencyMs        int64      `json:"latencyMs"`
}

// FeedbackRequest payload for rating responses
type FeedbackRequest struct {
	MessageID  string `json:"messageId"`
	UserRating string `json:"userRating"` // UPVOTE, DOWNVOTE
	Comment    string `json:"comment,omitempty"`
}

// StreamChunk used for SSE streaming responses
type StreamChunk struct {
	MessageID      string `json:"messageId"`
	ConversationID string `json:"conversationId"`
	ContentDelta   string `json:"contentDelta"`
	IsComplete     bool   `json:"isComplete"`
}
