package tests

import (
	"context"
	"testing"

	agentApp "github.com/diablovocado/declutr/modules/agent/application"
	agentDomain "github.com/diablovocado/declutr/modules/agent/domain"
	agentRepo "github.com/diablovocado/declutr/modules/agent/repository"
)

func TestAutonomousAgentGoalAndPlanDecomposition(t *testing.T) {
	repo := agentRepo.NewInMemoryAgentRepository()
	service := agentApp.NewAgentService(repo)
	ctx := context.Background()

	// 1. Create Organization Agent
	agent, err := service.CreateAgent(ctx, "usr-test-1", struct {
		Name          string                   `json:"name"`
		Type          agentDomain.AgentType    `json:"type"`
		Description   string                   `json:"description"`
		ExecutionMode agentDomain.ExecutionMode `json:"execution_mode"`
		Permissions   []string                 `json:"permissions"`
	}{
		Name:          "Tax Receipt Assistant",
		Type:          agentDomain.TypeOrganization,
		Description:   "Organizes tax documents and receipts",
		ExecutionMode: agentDomain.ModeGoalDriven,
		Permissions:   []string{"vault.read", "vault.write", "agent.execute"},
	})

	if err != nil || agent == nil {
		t.Fatalf("Failed to create agent: %v", err)
	}

	// 2. Set Persistent Goal
	goal, plan, err := service.CreateGoal(ctx, "usr-test-1", agent.ID, "Organize 2026 Tax Documents", "Detect receipt assets and group into Tax 2026 collection", "CONTINUOUS")
	if err != nil || goal == nil || plan == nil {
		t.Fatalf("Failed to create goal & generate plan: %v", err)
	}

	if !plan.RequiresReview {
		t.Error("Expected plan to require human review due to destructive action")
	}

	if len(plan.Tasks) < 3 {
		t.Errorf("Expected at least 3 tasks in plan, got %d", len(plan.Tasks))
	}

	// 3. Human Approval Flow
	err = service.ApprovePlan(ctx, plan.ID, "Approved by QA test")
	if err != nil {
		t.Fatalf("Failed to approve plan: %v", err)
	}

	plans, _ := service.ListPlans(ctx, agent.ID)
	if len(plans) != 1 || plans[0].Status != agentDomain.TaskApproved {
		t.Errorf("Expected plan status APPROVED, got %v", plans)
	}

	// 4. Memory Persistence Check
	mems, _ := service.ListMemories(ctx, agent.ID)
	if len(mems) < 1 {
		t.Errorf("Expected operational memory item created, got %d memories", len(mems))
	}
}

func TestReasoningEngineHumanApprovalInterceptor(t *testing.T) {
	reasoning := agentApp.NewReasoningEngine()
	ctx := context.Background()

	agent := &agentDomain.Agent{
		ID:          "agt-test",
		Name:        "Test Agent",
		Permissions: []string{"vault.read", "agent.execute"},
	}

	destructiveTask := &agentDomain.AgentTask{
		ID:            "tsk-1",
		ToolName:      "WORKFLOW_ENGINE",
		Action:        "delete_asset",
		IsDestructive: true,
	}

	eval := reasoning.EvaluateTaskExecution(ctx, agent, destructiveTask)
	if eval.CanExecute {
		t.Error("Expected destructive task CanExecute=false without human approval")
	}
	if !eval.RequiresReview {
		t.Error("Expected destructive task RequiresReview=true")
	}
}
