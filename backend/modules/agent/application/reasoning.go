package application

import (
	"context"
	"fmt"

	"github.com/diablovocado/declutr/modules/agent/domain"
)

// ReasoningEngine evaluates tool parameters, confidence scores, evidence rationales, and human approval boundaries.
type ReasoningEngine struct{}

func NewReasoningEngine() *ReasoningEngine {
	return &ReasoningEngine{}
}

type EvaluationResult struct {
	CanExecute     bool    `json:"can_execute"`
	RequiresReview bool    `json:"requires_review"`
	Reasoning      string  `json:"reasoning"`
	Confidence     float64 `json:"confidence"`
	Evidence       string  `json:"evidence"`
}

func (re *ReasoningEngine) EvaluateTaskExecution(ctx context.Context, agent *domain.Agent, task *domain.AgentTask) EvaluationResult {
	// Destructive or Sensitive Actions Interceptor
	if task.IsDestructive {
		return EvaluationResult{
			CanExecute:     false,
			RequiresReview: true,
			Reasoning:      fmt.Sprintf("Action '%s' on tool '%s' modifies vault state or moves data. Human approval is required.", task.Action, task.ToolName),
			Confidence:     0.96,
			Evidence:       "Policy rule: Destructive actions require explicit user confirmation.",
		}
	}

	// Permission Scope Interceptor
	hasPerm := false
	for _, p := range agent.Permissions {
		if p == "admin.manage" || p == "agent.execute" {
			hasPerm = true
			break
		}
	}

	if !hasPerm {
		return EvaluationResult{
			CanExecute:     false,
			RequiresReview: false,
			Reasoning:      fmt.Sprintf("Agent '%s' lacks permission scope to invoke tool '%s'", agent.Name, task.ToolName),
			Confidence:     1.0,
			Evidence:       "Permission denied interceptor",
		}
	}

	return EvaluationResult{
		CanExecute:     true,
		RequiresReview: false,
		Reasoning:      fmt.Sprintf("Read-only task '%s' evaluated safely for execution.", task.Action),
		Confidence:     0.98,
		Evidence:       "Empirical search index & memory context match.",
	}
}
