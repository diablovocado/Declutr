package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/agent/application"
	"github.com/diablovocado/declutr/modules/agent/domain"
)

type AgentAPI struct {
	service *application.AgentService
}

func NewAgentAPI(service *application.AgentService) *AgentAPI {
	return &AgentAPI{service: service}
}

func (a *AgentAPI) ListAgents(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	agents, err := a.service.ListUserAgents(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(agents)
}

func (a *AgentAPI) CreateAgent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name          string               `json:"name"`
		Type          domain.AgentType     `json:"type"`
		Description   string               `json:"description"`
		ExecutionMode domain.ExecutionMode `json:"execution_mode"`
		Permissions   []string             `json:"permissions"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	agent, err := a.service.CreateAgent(r.Context(), userID, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(agent)
}

func (a *AgentAPI) ToggleState(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AgentID string `json:"agent_id"`
		Pause   bool   `json:"pause"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.ToggleAgentState(r.Context(), req.AgentID, req.Pause); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *AgentAPI) CreateGoal(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AgentID     string `json:"agent_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Schedule    string `json:"schedule"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	goal, plan, err := a.service.CreateGoal(r.Context(), userID, req.AgentID, req.Title, req.Description, req.Schedule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := map[string]interface{}{
		"goal": goal,
		"plan": plan,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(resp)
}

func (a *AgentAPI) ListPlans(w http.ResponseWriter, r *http.Request) {
	agentID := r.URL.Query().Get("agent_id")
	plans, err := a.service.ListPlans(r.Context(), agentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(plans)
}

func (a *AgentAPI) ApprovePlan(w http.ResponseWriter, r *http.Request) {
	var req struct {
		PlanID  string `json:"plan_id"`
		Comment string `json:"comment"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.ApprovePlan(r.Context(), req.PlanID, req.Comment); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *AgentAPI) RejectPlan(w http.ResponseWriter, r *http.Request) {
	var req struct {
		PlanID  string `json:"plan_id"`
		Comment string `json:"comment"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.RejectPlan(r.Context(), req.PlanID, req.Comment); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *AgentAPI) ListMemories(w http.ResponseWriter, r *http.Request) {
	agentID := r.URL.Query().Get("agent_id")
	mems, err := a.service.ListMemories(r.Context(), agentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(mems)
}
