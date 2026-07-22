package application_test

import (
	"context"
	"testing"

	"github.com/diablovocado/declutr/modules/copilot/application"
	"github.com/diablovocado/declutr/modules/copilot/domain"
	"github.com/diablovocado/declutr/modules/copilot/repository"
)

const testVaultID = "vault-test-001"

func setupService() *application.CopilotService {
	repo := repository.NewInMemoryCopilotRepository()
	return application.NewCopilotService(repo, nil)
}

// TestIntentParser validates query intent classification
func TestIntentParser(t *testing.T) {
	tests := []struct {
		question string
		expected domain.IntentCategory
	}{
		{"Summarize my tax documents", domain.IntentSummary},
		{"When does my passport expire?", domain.IntentTimelineQuery},
		{"Recall my cardiology visit with Dr. Sharma", domain.IntentMemoryRecall},
		{"Who was involved in the startup meeting?", domain.IntentEntityExplore},
		{"What is my passport number?", domain.IntentGeneralQA},
	}

	for _, tt := range tests {
		got := application.ParseIntent(tt.question)
		if got != tt.expected {
			t.Errorf("question %q: expected intent %s, got %s", tt.question, tt.expected, got)
		}
	}

	t.Logf("PASS: Intent Parser — All %d test cases correctly classified", len(tests))
}

// TestGroundedRAGAnswer validates grounded answer generation and citation building
func TestGroundedRAGAnswer(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	req := &domain.SendMessageRequest{
		VaultID:  testVaultID,
		Question: "When does my passport expire?",
	}

	resp, err := svc.SendMessage(ctx, req)
	if err != nil {
		t.Fatalf("send message failed: %v", err)
	}
	if resp.AssistantMessage == nil {
		t.Fatal("expected assistant message response")
	}
	if len(resp.Citations) == 0 {
		t.Fatal("expected grounded citations in response")
	}
	if resp.AssistantMessage.Confidence < 0.8 {
		t.Errorf("expected confidence >= 0.8, got %.2f", resp.AssistantMessage.Confidence)
	}

	t.Logf("PASS: Grounded RAG Answer — Response: %q | Confidence: %.2f | Citations: %d",
		resp.AssistantMessage.Content, resp.AssistantMessage.Confidence, len(resp.Citations))
}

// TestMultiTurnConversation validates context carry-over across turns
func TestMultiTurnConversation(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	// Turn 1
	resp1, err := svc.SendMessage(ctx, &domain.SendMessageRequest{
		VaultID:  testVaultID,
		Question: "What thesis chapter did I work on?",
	})
	if err != nil {
		t.Fatalf("turn 1 failed: %v", err)
	}

	// Turn 2 in same conversation
	resp2, err := svc.SendMessage(ctx, &domain.SendMessageRequest{
		ConversationID: resp1.ConversationID,
		VaultID:        testVaultID,
		Question:       "What benchmarks were evaluated?",
	})
	if err != nil {
		t.Fatalf("turn 2 failed: %v", err)
	}

	msgs, err := svc.GetMessages(resp1.ConversationID)
	if err != nil {
		t.Fatalf("get messages failed: %v", err)
	}
	if len(msgs) < 4 {
		t.Errorf("expected at least 4 messages (2 turns), got %d", len(msgs))
	}

	t.Logf("PASS: Multi-Turn Conversation — Conversation %s has %d messages across turns",
		resp2.ConversationID, len(msgs))
}

// TestHallucinationPrevention verifies returning explicit uncertainty rationale when vault evidence is missing
func TestHallucinationPrevention(t *testing.T) {
	// Directly test RAG synthesis logic for non-existent vault topic
	answer, conf, reasoning := application.SynthesizeGroundedAnswer("What is my secret crypto password?", []domain.Citation{})

	if conf != 0.0 {
		t.Errorf("expected 0.0 confidence when evidence is absent, got %.2f", conf)
	}
	if reasoning == "" {
		t.Error("expected explanation rationale when evidence is absent")
	}

	t.Logf("PASS: Hallucination Prevention — Answer: %q | Confidence: %.2f | Rationale: %q",
		answer, conf, reasoning)
}

// TestConversationHistory validates listing active conversations and deleting a session
func TestConversationHistory(t *testing.T) {
	svc := setupService()

	conv, err := svc.StartConversation(testVaultID, "Test Session")
	if err != nil {
		t.Fatalf("start conversation failed: %v", err)
	}

	list, err := svc.ListConversations(testVaultID)
	if err != nil {
		t.Fatalf("list conversations failed: %v", err)
	}
	if len(list) == 0 {
		t.Fatal("expected conversation list")
	}

	if err := svc.DeleteConversation(conv.ConversationID); err != nil {
		t.Fatalf("delete conversation failed: %v", err)
	}

	t.Logf("PASS: Conversation History — Session created and deleted successfully")
}

// TestFeedbackAndStats validates saving user feedback ratings
func TestFeedbackAndStats(t *testing.T) {
	svc := setupService()

	err := svc.SaveFeedback(&domain.FeedbackRequest{
		MessageID:  "msg-asst-1",
		UserRating: "UPVOTE",
		Comment:    "Accurate grounded passport expiration date",
	})
	if err != nil {
		t.Fatalf("save feedback failed: %v", err)
	}

	t.Logf("PASS: Feedback & Ratings — Feedback saved successfully")
}
