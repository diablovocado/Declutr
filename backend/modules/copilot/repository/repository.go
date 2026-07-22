package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/copilot/domain"
)

// CopilotRepository defines persistence methods for RAG conversations and messages
type CopilotRepository interface {
	CreateConversation(conv *domain.Conversation) error
	GetConversation(convID string) (*domain.Conversation, error)
	ListConversations(vaultID string) ([]*domain.Conversation, error)
	DeleteConversation(convID string) error

	AddMessage(msg *domain.Message) error
	GetMessages(convID string) ([]*domain.Message, error)

	SaveContextSnapshot(convID string, ragCtx *domain.RAGContext) error
	SaveFeedback(req *domain.FeedbackRequest) error

	ClearAllData(vaultID string) error
}

// InMemoryCopilotRepository is a thread-safe in-memory store
type InMemoryCopilotRepository struct {
	mu            sync.RWMutex
	conversations map[string]*domain.Conversation // convID -> conv
	messages      map[string][]*domain.Message    // convID -> messages
	snapshots     map[string]*domain.RAGContext   // convID -> RAG snapshot
	feedback      map[string]*domain.FeedbackRequest
}

// NewInMemoryCopilotRepository creates a new in-memory copilot repository
func NewInMemoryCopilotRepository() *InMemoryCopilotRepository {
	return &InMemoryCopilotRepository{
		conversations: make(map[string]*domain.Conversation),
		messages:      make(map[string][]*domain.Message),
		snapshots:     make(map[string]*domain.RAGContext),
		feedback:      make(map[string]*domain.FeedbackRequest),
	}
}

func (r *InMemoryCopilotRepository) CreateConversation(conv *domain.Conversation) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	conv.UpdatedAt = time.Now()
	r.conversations[conv.ConversationID] = conv
	return nil
}

func (r *InMemoryCopilotRepository) GetConversation(convID string) (*domain.Conversation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	conv, ok := r.conversations[convID]
	if !ok {
		return nil, fmt.Errorf("conversation %s not found", convID)
	}
	return conv, nil
}

func (r *InMemoryCopilotRepository) ListConversations(vaultID string) ([]*domain.Conversation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var list []*domain.Conversation
	for _, c := range r.conversations {
		if c.VaultID == vaultID {
			list = append(list, c)
		}
	}
	if len(list) == 0 {
		list = defaultSampleConversations(vaultID)
		for _, c := range list {
			r.conversations[c.ConversationID] = c
		}
	}
	return list, nil
}

func (r *InMemoryCopilotRepository) DeleteConversation(convID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.conversations, convID)
	delete(r.messages, convID)
	delete(r.snapshots, convID)
	return nil
}

func (r *InMemoryCopilotRepository) AddMessage(msg *domain.Message) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.messages[msg.ConversationID] = append(r.messages[msg.ConversationID], msg)
	if conv, ok := r.conversations[msg.ConversationID]; ok {
		conv.MessageCount++
		conv.LastMessageAt = time.Now()
		conv.UpdatedAt = time.Now()
	}
	return nil
}

func (r *InMemoryCopilotRepository) GetMessages(convID string) ([]*domain.Message, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	msgs, ok := r.messages[convID]
	if !ok || len(msgs) == 0 {
		msgs = defaultSampleMessages(convID)
		r.messages[convID] = msgs
	}
	return msgs, nil
}

func (r *InMemoryCopilotRepository) SaveContextSnapshot(convID string, ragCtx *domain.RAGContext) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.snapshots[convID] = ragCtx
	return nil
}

func (r *InMemoryCopilotRepository) SaveFeedback(req *domain.FeedbackRequest) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.feedback[req.MessageID] = req
	return nil
}

func (r *InMemoryCopilotRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for id, c := range r.conversations {
		if c.VaultID == vaultID {
			delete(r.conversations, id)
			delete(r.messages, id)
			delete(r.snapshots, id)
		}
	}
	return nil
}

// Default Sample Data
func defaultSampleConversations(vaultID string) []*domain.Conversation {
	now := time.Now()
	return []*domain.Conversation{
		{
			ConversationID: "conv-japan-001",
			VaultID:        vaultID,
			Title:          "Japan Trip & Passport Inquiries",
			Summary:        "Discussion about passport validity, flight details, and Japanese entry visa requirements.",
			Status:         "ACTIVE",
			MessageCount:   2,
			LastMessageAt:  now.Add(-10 * time.Minute),
			CreatedAt:      now.Add(-30 * time.Minute),
			UpdatedAt:      now,
		},
	}
}

func defaultSampleMessages(convID string) []*domain.Message {
	now := time.Now()
	return []*domain.Message{
		{
			MessageID:      "msg-user-1",
			ConversationID: convID,
			VaultID:        "vault-demo",
			Role:           domain.RoleUser,
			Content:        "What documents are related to my Japan trip and when does my passport expire?",
			TokensUsed:     18,
			CreatedAt:      now.Add(-5 * time.Minute),
		},
		{
			MessageID:      "msg-asst-1",
			ConversationID: convID,
			VaultID:        "vault-demo",
			Role:           domain.RoleAssistant,
			Content:        "Based on your vault records, your document **'Japanese Visa & Passport Scan'** (PDF) contains your passport photo page and entry visa for Tokyo. Your US Passport is valid for 90-day tourist entry and **expires on September 25, 2025** (in 65 days).",
			TokensUsed:     142,
			Confidence:     0.96,
			ReasoningOverview: "Grounded via exact entity match (Tokyo, Japan, Passport) and semantic vector search over document asset-passport-001.",
			Citations: []domain.Citation{
				{
					CitationID:      "cit-001",
					AssetID:         "asset-passport-001",
					Title:           "Japanese Visa & Passport Scan",
					Summary:         "Passport photo page and Japanese entry visa for Tokyo vacation 2025.",
					AssetType:       "PDF",
					Snippet:         "Passport number A987654321, issued by US Department of State. Expiration Date: 2025-09-25.",
					Confidence:      0.98,
					MatchedEntities: []string{"Tokyo", "Japan", "Passport"},
					MatchedContexts: []string{"Japan Vacation"},
				},
			},
			CreatedAt: now.Add(-4 * time.Minute),
		},
	}
}
