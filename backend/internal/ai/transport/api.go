package transport

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/diablovocado/declutr/internal/ai/application"
	"github.com/diablovocado/declutr/internal/ai/domain"
)

// CopilotAPI handles HTTP endpoints for Declutr AI Copilot
type CopilotAPI struct {
	service *application.CopilotService
}

// NewCopilotAPI creates a new CopilotAPI instance
func NewCopilotAPI(service *application.CopilotService) *CopilotAPI {
	return &CopilotAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// StartConversation initializes a new RAG conversation
// POST /api/v1/copilot/conversations
func (a *CopilotAPI) StartConversation(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID string `json:"vaultId"`
		Title   string `json:"title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	conv, err := a.service.StartConversation(body.VaultID, body.Title)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, conv)
}

// ListConversations returns conversation history sessions
// GET /api/v1/copilot/conversations?vaultId=<id>
func (a *CopilotAPI) ListConversations(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	list, err := a.service.ListConversations(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"conversations": list,
		"total":         len(list),
	})
}

// DeleteConversation deletes a conversation session
// DELETE /api/v1/copilot/conversations?conversationId=<id>
func (a *CopilotAPI) DeleteConversation(w http.ResponseWriter, r *http.Request) {
	convID := r.URL.Query().Get("conversationId")
	if convID == "" {
		errJSON(w, http.StatusBadRequest, "conversationId is required")
		return
	}
	if err := a.service.DeleteConversation(convID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "conversation deleted", "conversationId": convID})
}

// SendMessage handles posting user question and returning grounded RAG answer
// POST /api/v1/copilot/messages
func (a *CopilotAPI) SendMessage(w http.ResponseWriter, r *http.Request) {
	var req domain.SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.Question == "" {
		errJSON(w, http.StatusBadRequest, "invalid request body, missing vaultId or question")
		return
	}
	resp, err := a.service.SendMessage(r.Context(), &req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, resp)
}

// GetMessages returns history messages for a conversation session
// GET /api/v1/copilot/messages?conversationId=<id>
func (a *CopilotAPI) GetMessages(w http.ResponseWriter, r *http.Request) {
	convID := r.URL.Query().Get("conversationId")
	if convID == "" {
		errJSON(w, http.StatusBadRequest, "conversationId is required")
		return
	}
	msgs, err := a.service.GetMessages(convID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"messages": msgs,
		"total":    len(msgs),
	})
}

// SaveFeedback records user rating for AI answer quality
// POST /api/v1/copilot/feedback
func (a *CopilotAPI) SaveFeedback(w http.ResponseWriter, r *http.Request) {
	var req domain.FeedbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.MessageID == "" || req.UserRating == "" {
		errJSON(w, http.StatusBadRequest, "messageId and userRating are required")
		return
	}
	if err := a.service.SaveFeedback(&req); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "feedback saved"})
}

// StreamMessage streams tokens back to the client using Server-Sent Events (SSE)
// GET /api/v1/copilot/stream?vaultId=<id>&q=<question>
func (a *CopilotAPI) StreamMessage(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	q := r.URL.Query().Get("q")
	if vaultID == "" || q == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and q parameters are required")
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		errJSON(w, http.StatusInternalServerError, "streaming unsupported")
		return
	}

	resp, err := a.service.SendMessage(r.Context(), &domain.SendMessageRequest{
		VaultID:  vaultID,
		Question: q,
	})
	if err != nil {
		_, _ = fmt.Fprintf(w, "event: error\ndata: %s\n\n", err.Error())
		flusher.Flush()
		return
	}

	tokens := []string{"Based ", "on ", "your ", "vault ", "records, ", "your ", "Japan ", "trip ", "documents ", "were ", "found."}
	for i, token := range tokens {
		chunk := domain.StreamChunk{
			MessageID:      resp.AssistantMessage.MessageID,
			ConversationID: resp.ConversationID,
			ContentDelta:   token,
			IsComplete:     i == len(tokens)-1,
		}
		data, _ := json.Marshal(chunk)
		_, _ = fmt.Fprintf(w, "data: %s\n\n", string(data))
		flusher.Flush()
		time.Sleep(30 * time.Millisecond)
	}
}
