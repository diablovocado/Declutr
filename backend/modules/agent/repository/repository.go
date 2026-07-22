package repository

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/agent/domain"
)

type AgentRepository interface {
	CreateAgent(ctx context.Context, agent *domain.Agent) error
	GetAgentByID(ctx context.Context, id string) (*domain.Agent, error)
	ListAgentsByUser(ctx context.Context, userID string) ([]domain.Agent, error)
	UpdateAgentStatus(ctx context.Context, id string, status domain.AgentStatus) error

	CreateGoal(ctx context.Context, goal *domain.AgentGoal) error
	ListGoals(ctx context.Context, agentID string) ([]domain.AgentGoal, error)

	SavePlan(ctx context.Context, plan *domain.AgentPlan) error
	GetPlanByID(ctx context.Context, id string) (*domain.AgentPlan, error)
	ListPlans(ctx context.Context, agentID string) ([]domain.AgentPlan, error)
	UpdatePlanStatus(ctx context.Context, planID string, status domain.TaskStatus) error

	AddMemory(ctx context.Context, mem *domain.AgentMemory) error
	ListMemories(ctx context.Context, agentID string) ([]domain.AgentMemory, error)

	AddFeedback(ctx context.Context, fb *domain.AgentFeedback) error
	RecordExecution(ctx context.Context, exec *domain.AgentExecution) error
	ListExecutions(ctx context.Context, agentID string) ([]domain.AgentExecution, error)
}

type InMemoryAgentRepository struct {
	mu         sync.RWMutex
	agents     map[string]*domain.Agent
	goals      map[string]*domain.AgentGoal
	plans      map[string]*domain.AgentPlan
	memories   map[string]*domain.AgentMemory
	feedback   map[string]*domain.AgentFeedback
	executions map[string]*domain.AgentExecution
}

func NewInMemoryAgentRepository() *InMemoryAgentRepository {
	repo := &InMemoryAgentRepository{
		agents:     make(map[string]*domain.Agent),
		goals:      make(map[string]*domain.AgentGoal),
		plans:      make(map[string]*domain.AgentPlan),
		memories:   make(map[string]*domain.AgentMemory),
		feedback:   make(map[string]*domain.AgentFeedback),
		executions: make(map[string]*domain.AgentExecution),
	}

	// Seed default autonomous agents
	seedAgent1 := &domain.Agent{
		ID:            "agt-organization-pro",
		UserID:        "usr-dev-default",
		Name:          "Vault Organizer Agent",
		Type:          domain.TypeOrganization,
		Description:   "Continuously monitors incoming receipts, documents, and tags duplicate assets",
		Status:        domain.StatusAgentActive,
		ExecutionMode: domain.ModeGoalDriven,
		Permissions:   []string{"vault.read", "vault.write", "agent.execute"},
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
	}
	seedAgent2 := &domain.Agent{
		ID:            "agt-travel-manager",
		UserID:        "usr-dev-default",
		Name:          "Travel & Expiration Monitor",
		Type:          domain.TypeTravel,
		Description:   "Monitors expiring passports, IDs, travel bookings, and alerts user",
		Status:        domain.StatusAgentActive,
		ExecutionMode: domain.ModeScheduled,
		Permissions:   []string{"vault.read", "notification.send", "agent.execute"},
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
	}

	repo.agents[seedAgent1.ID] = seedAgent1
	repo.agents[seedAgent2.ID] = seedAgent2

	return repo
}

func (r *InMemoryAgentRepository) CreateAgent(ctx context.Context, agent *domain.Agent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.agents[agent.ID] = agent
	return nil
}

func (r *InMemoryAgentRepository) GetAgentByID(ctx context.Context, id string) (*domain.Agent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	a, ok := r.agents[id]
	if !ok {
		return nil, fmt.Errorf("agent not found: %s", id)
	}
	return a, nil
}

func (r *InMemoryAgentRepository) ListAgentsByUser(ctx context.Context, userID string) ([]domain.Agent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.Agent
	for _, a := range r.agents {
		if a.UserID == userID || userID == "usr-dev-default" {
			result = append(result, *a)
		}
	}
	return result, nil
}

func (r *InMemoryAgentRepository) UpdateAgentStatus(ctx context.Context, id string, status domain.AgentStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	a, ok := r.agents[id]
	if !ok {
		return fmt.Errorf("agent not found: %s", id)
	}
	a.Status = status
	a.UpdatedAt = time.Now().UTC()
	return nil
}

func (r *InMemoryAgentRepository) CreateGoal(ctx context.Context, goal *domain.AgentGoal) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.goals[goal.ID] = goal
	return nil
}

func (r *InMemoryAgentRepository) ListGoals(ctx context.Context, agentID string) ([]domain.AgentGoal, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.AgentGoal
	for _, g := range r.goals {
		if g.AgentID == agentID || agentID == "" {
			result = append(result, *g)
		}
	}
	return result, nil
}

func (r *InMemoryAgentRepository) SavePlan(ctx context.Context, plan *domain.AgentPlan) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.plans[plan.ID] = plan
	return nil
}

func (r *InMemoryAgentRepository) GetPlanByID(ctx context.Context, id string) (*domain.AgentPlan, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.plans[id]
	if !ok {
		return nil, fmt.Errorf("plan not found: %s", id)
	}
	return p, nil
}

func (r *InMemoryAgentRepository) ListPlans(ctx context.Context, agentID string) ([]domain.AgentPlan, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.AgentPlan
	for _, p := range r.plans {
		if p.AgentID == agentID || agentID == "" {
			result = append(result, *p)
		}
	}
	return result, nil
}

func (r *InMemoryAgentRepository) UpdatePlanStatus(ctx context.Context, planID string, status domain.TaskStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	p, ok := r.plans[planID]
	if !ok {
		return fmt.Errorf("plan not found: %s", planID)
	}
	p.Status = status
	p.UpdatedAt = time.Now().UTC()
	return nil
}

func (r *InMemoryAgentRepository) AddMemory(ctx context.Context, mem *domain.AgentMemory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.memories[mem.ID] = mem
	return nil
}

func (r *InMemoryAgentRepository) ListMemories(ctx context.Context, agentID string) ([]domain.AgentMemory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.AgentMemory
	for _, m := range r.memories {
		if m.AgentID == agentID || agentID == "" {
			result = append(result, *m)
		}
	}
	return result, nil
}

func (r *InMemoryAgentRepository) AddFeedback(ctx context.Context, fb *domain.AgentFeedback) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.feedback[fb.ID] = fb
	return nil
}

func (r *InMemoryAgentRepository) RecordExecution(ctx context.Context, exec *domain.AgentExecution) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.executions[exec.ID] = exec
	return nil
}

func (r *InMemoryAgentRepository) ListExecutions(ctx context.Context, agentID string) ([]domain.AgentExecution, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.AgentExecution
	for _, e := range r.executions {
		if e.AgentID == agentID || agentID == "" {
			result = append(result, *e)
		}
	}
	return result, nil
}
