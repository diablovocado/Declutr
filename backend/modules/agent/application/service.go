package application

import (
	"context"
	"fmt"
	"time"

	"github.com/diablovocado/declutr/modules/agent/domain"
	"github.com/diablovocado/declutr/modules/agent/repository"
	"github.com/diablovocado/declutr/shared/observability"
)

type AgentService struct {
	repo      repository.AgentRepository
	planner   *PlanningEngine
	reasoning *ReasoningEngine
}

func NewAgentService(repo repository.AgentRepository) *AgentService {
	return &AgentService{
		repo:      repo,
		planner:   NewPlanningEngine(),
		reasoning: NewReasoningEngine(),
	}
}

func (s *AgentService) CreateAgent(ctx context.Context, userID string, req struct {
	Name          string               `json:"name"`
	Type          domain.AgentType     `json:"type"`
	Description   string               `json:"description"`
	ExecutionMode domain.ExecutionMode `json:"execution_mode"`
	Permissions   []string             `json:"permissions"`
}) (*domain.Agent, error) {
	agent := &domain.Agent{
		ID:            "agt-" + observability.GenerateID(8),
		UserID:        userID,
		Name:          req.Name,
		Type:          req.Type,
		Description:   req.Description,
		Status:        domain.StatusAgentActive,
		ExecutionMode: req.ExecutionMode,
		Permissions:   req.Permissions,
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
	}

	if err := s.repo.CreateAgent(ctx, agent); err != nil {
		return nil, err
	}
	return agent, nil
}

func (s *AgentService) ListUserAgents(ctx context.Context, userID string) ([]domain.Agent, error) {
	return s.repo.ListAgentsByUser(ctx, userID)
}

func (s *AgentService) ToggleAgentState(ctx context.Context, agentID string, pause bool) error {
	status := domain.StatusAgentActive
	if pause {
		status = domain.StatusAgentPaused
	}
	return s.repo.UpdateAgentStatus(ctx, agentID, status)
}

func (s *AgentService) CreateGoal(ctx context.Context, userID string, agentID string, title string, desc string, sched string) (*domain.AgentGoal, *domain.AgentPlan, error) {
	agent, err := s.repo.GetAgentByID(ctx, agentID)
	if err != nil {
		return nil, nil, err
	}

	goal := &domain.AgentGoal{
		ID:          "gol-" + observability.GenerateID(8),
		AgentID:     agentID,
		UserID:      userID,
		Title:       title,
		Description: desc,
		Schedule:    sched,
		IsActive:    true,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}

	if err := s.repo.CreateGoal(ctx, goal); err != nil {
		return nil, nil, err
	}

	// Decompose Goal into Plan
	plan, err := s.planner.DecomposeGoalToPlan(ctx, agent, goal)
	if err != nil {
		return goal, nil, err
	}

	_ = s.repo.SavePlan(ctx, plan)

	return goal, plan, nil
}

func (s *AgentService) ApprovePlan(ctx context.Context, planID string, comment string) error {
	plan, err := s.repo.GetPlanByID(ctx, planID)
	if err != nil {
		return err
	}

	if err := s.repo.UpdatePlanStatus(ctx, planID, domain.TaskApproved); err != nil {
		return err
	}

	// Add Positive Feedback Learning
	_ = s.repo.AddFeedback(ctx, &domain.AgentFeedback{
		ID:        "fb-" + observability.GenerateID(8),
		PlanID:    planID,
		UserID:    plan.UserID,
		Approved:  true,
		Comment:   comment,
		CreatedAt: time.Now().UTC(),
	})

	// Add Operational Memory
	_ = s.repo.AddMemory(ctx, &domain.AgentMemory{
		ID:        "mem-" + observability.GenerateID(8),
		AgentID:   plan.AgentID,
		Key:       fmt.Sprintf("approved_plan_%s", plan.ID),
		Value:     fmt.Sprintf("User approved plan '%s' with comment '%s'", plan.Title, comment),
		Category:  "SUCCESS",
		CreatedAt: time.Now().UTC(),
	})

	return nil
}

func (s *AgentService) RejectPlan(ctx context.Context, planID string, comment string) error {
	plan, err := s.repo.GetPlanByID(ctx, planID)
	if err != nil {
		return err
	}

	if err := s.repo.UpdatePlanStatus(ctx, planID, domain.TaskRejected); err != nil {
		return err
	}

	// Add Negative Feedback Learning
	_ = s.repo.AddFeedback(ctx, &domain.AgentFeedback{
		ID:        "fb-" + observability.GenerateID(8),
		PlanID:    planID,
		UserID:    plan.UserID,
		Approved:  false,
		Comment:   comment,
		CreatedAt: time.Now().UTC(),
	})

	// Add Memory for Correction
	_ = s.repo.AddMemory(ctx, &domain.AgentMemory{
		ID:        "mem-" + observability.GenerateID(8),
		AgentID:   plan.AgentID,
		Key:       fmt.Sprintf("rejected_plan_%s", plan.ID),
		Value:     fmt.Sprintf("User rejected plan '%s'. Reason: %s", plan.Title, comment),
		Category:  "FEEDBACK",
		CreatedAt: time.Now().UTC(),
	})

	return nil
}

func (s *AgentService) ListPlans(ctx context.Context, agentID string) ([]domain.AgentPlan, error) {
	return s.repo.ListPlans(ctx, agentID)
}

func (s *AgentService) ListMemories(ctx context.Context, agentID string) ([]domain.AgentMemory, error) {
	return s.repo.ListMemories(ctx, agentID)
}
