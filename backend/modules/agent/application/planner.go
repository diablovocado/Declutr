package application

import (
	"context"
	"fmt"

	"github.com/diablovocado/declutr/modules/agent/domain"
	"github.com/diablovocado/declutr/shared/observability"
)

// PlanningEngine converts persistent goals into executable multi-step plans.
type PlanningEngine struct{}

func NewPlanningEngine() *PlanningEngine {
	return &PlanningEngine{}
}

func (pe *PlanningEngine) DecomposeGoalToPlan(ctx context.Context, agent *domain.Agent, goal *domain.AgentGoal) (*domain.AgentPlan, error) {
	planID := "plan-" + observability.GenerateID(8)

	plan := &domain.AgentPlan{
		ID:             planID,
		GoalID:         goal.ID,
		AgentID:        agent.ID,
		UserID:         goal.UserID,
		Title:          fmt.Sprintf("Execution Plan for Goal: %s", goal.Title),
		Explanation:    fmt.Sprintf("Agent %s will analyze vault contents, extract metadata, and execute workflow rules for '%s'", agent.Name, goal.Title),
		Reasoning:      "Based on current vault state, 2 preparatory steps and 1 execution step are required.",
		Confidence:     0.94,
		Status:         domain.TaskPending,
		RequiresReview: false,
		Tasks:          []domain.AgentTask{},
	}

	// Decompose tasks based on Agent Type
	switch agent.Type {
	case domain.TypeOrganization, domain.TypeDocument:
		plan.Tasks = []domain.AgentTask{
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 1,
				ToolName:      "HYBRID_SEARCH",
				Action:        "query_vault",
				Parameters:    map[string]interface{}{"query": goal.Title, "limit": 20},
				IsDestructive: false,
				Status:        domain.TaskPending,
			},
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 2,
				ToolName:      "MEMORY_ENGINE",
				Action:        "retrieve_preferences",
				Parameters:    map[string]interface{}{"category": "ORGANIZATION_PREF"},
				IsDestructive: false,
				Status:        domain.TaskPending,
			},
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 3,
				ToolName:      "WORKFLOW_ENGINE",
				Action:        "organize_matching_assets",
				Parameters:    map[string]interface{}{"target_collection": goal.Title},
				IsDestructive: true, // Requires human approval to move/tag data
				Status:        domain.TaskAwaitingApproval,
			},
		}
		plan.RequiresReview = true

	case domain.TypeFinancial, domain.TypeTravel:
		plan.Tasks = []domain.AgentTask{
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 1,
				ToolName:      "HYBRID_SEARCH",
				Action:        "scan_expiring_documents",
				Parameters:    map[string]interface{}{"filter_type": "EXPIRATION_DATE"},
				IsDestructive: false,
				Status:        domain.TaskPending,
			},
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 2,
				ToolName:      "NOTIFICATION_CENTER",
				Action:        "send_alert",
				Parameters:    map[string]interface{}{"title": "Document Notice", "priority": "HIGH"},
				IsDestructive: false,
				Status:        domain.TaskPending,
			},
		}

	default:
		plan.Tasks = []domain.AgentTask{
			{
				ID:            "tsk-" + observability.GenerateID(6),
				PlanID:        planID,
				SequenceIndex: 1,
				ToolName:      "HYBRID_SEARCH",
				Action:        "search",
				Parameters:    map[string]interface{}{"query": goal.Title},
				IsDestructive: false,
				Status:        domain.TaskPending,
			},
		}
	}

	return plan, nil
}
