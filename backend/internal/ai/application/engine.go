package application

import (
	"context"
	"fmt"
	"log"

	"github.com/diablovocado/declutr/internal/ai/domain"
)

// GroundedRAGEngine orchestrates the full RAG pipeline (Retrieval + Grounded Prompting + Streaming + Citations)
type GroundedRAGEngine struct {
	service *CopilotService
}

// NewGroundedRAGEngine creates a new GroundedRAGEngine
func NewGroundedRAGEngine(service *CopilotService) *GroundedRAGEngine {
	return &GroundedRAGEngine{service: service}
}

// AnswerQuestion executes a grounded RAG query for a user question
func (e *GroundedRAGEngine) AnswerQuestion(ctx context.Context, req *domain.SendMessageRequest) (*domain.SendMessageResponse, error) {
	log.Printf("[GroundedRAGEngine] Executing RAG query: %q for vault: %s", req.Question, req.VaultID)

	resp, err := e.service.SendMessage(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("grounded RAG engine failed: %w", err)
	}

	log.Printf("[GroundedRAGEngine] Answer generated in %dms (Intent: %s, Citations: %d, Confidence: %.2f)",
		resp.LatencyMs, resp.Intent, len(resp.Citations), resp.AssistantMessage.Confidence)

	return resp, nil
}
