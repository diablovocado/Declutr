package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/organization/application"
	"github.com/diablovocado/declutr/modules/organization/domain"
	"github.com/diablovocado/declutr/shared/middleware"
)

// OrganizationAPI handles HTTP REST endpoints for multi-tenant enterprise administration.
type OrganizationAPI struct {
	service *application.OrganizationService
}

func NewOrganizationAPI(service *application.OrganizationService) *OrganizationAPI {
	return &OrganizationAPI{service: service}
}

func (a *OrganizationAPI) CreateOrganization(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateOrganizationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-owner-default"
	}

	org, err := a.service.CreateOrganization(r.Context(), userID, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(org)
}

func (a *OrganizationAPI) ListOrganizations(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-owner-default"
	}

	orgs, err := a.service.ListUserOrganizations(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(orgs)
}

func (a *OrganizationAPI) ManageSettings(w http.ResponseWriter, r *http.Request) {
	orgID, _ := middleware.GetOrganizationIDFromContext(r.Context())
	if orgID == "" {
		orgID = r.URL.Query().Get("organization_id")
	}

	if r.Method == http.MethodPut {
		var org domain.Organization
		if err := json.NewDecoder(r.Body).Decode(&org); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := a.service.UpdateSettings(r.Context(), orgID, &org); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}

	org, err := a.service.GetOrganization(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(org)
}

func (a *OrganizationAPI) InviteMember(w http.ResponseWriter, r *http.Request) {
	var req domain.InviteMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	member, err := a.service.InviteMember(r.Context(), req.OrganizationID, req.Email, req.RoleID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(member)
}

func (a *OrganizationAPI) ListMembers(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	members, err := a.service.ListMembers(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(members)
}

func (a *OrganizationAPI) UpdateMemberStatus(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrganizationID string              `json:"organization_id"`
		UserID         string              `json:"user_id"`
		Status         domain.MemberStatus `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.UpdateMemberStatus(r.Context(), req.OrganizationID, req.UserID, req.Status); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (a *OrganizationAPI) TransferOwnership(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrganizationID string `json:"organization_id"`
		NewOwnerID     string `json:"new_owner_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.TransferOwnership(r.Context(), req.OrganizationID, req.NewOwnerID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (a *OrganizationAPI) ManageRoles(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	if r.Method == http.MethodPost {
		var req struct {
			OrganizationID string   `json:"organization_id"`
			Name           string   `json:"name"`
			Description    string   `json:"description"`
			Permissions    []string `json:"permissions"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		role, err := a.service.CreateRole(r.Context(), req.OrganizationID, req.Name, req.Description, req.Permissions)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(role)
		return
	}

	roles, err := a.service.ListRoles(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(roles)
}

func (a *OrganizationAPI) ManageGroups(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	if r.Method == http.MethodPost {
		var req struct {
			OrganizationID string   `json:"organization_id"`
			Name           string   `json:"name"`
			Type           string   `json:"type"`
			MemberUserIDs  []string `json:"member_user_ids"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		group, err := a.service.CreateGroup(r.Context(), req.OrganizationID, req.Name, req.Type, req.MemberUserIDs)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(group)
		return
	}

	groups, err := a.service.ListGroups(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(groups)
}

func (a *OrganizationAPI) ManageWorkspaces(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	if r.Method == http.MethodPost {
		var req struct {
			OrganizationID string               `json:"organization_id"`
			Name           string               `json:"name"`
			Type           domain.WorkspaceType `json:"type"`
			Department     string               `json:"department"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ws, err := a.service.CreateWorkspace(r.Context(), req.OrganizationID, req.Name, req.Type, req.Department)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(ws)
		return
	}

	workspaces, err := a.service.ListWorkspaces(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(workspaces)
}

func (a *OrganizationAPI) ManagePolicies(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	if r.Method == http.MethodPut || r.Method == http.MethodPost {
		var req struct {
			OrganizationID string                 `json:"organization_id"`
			Type           domain.PolicyType      `json:"type"`
			IsEnabled      bool                   `json:"is_enabled"`
			Rules          map[string]interface{} `json:"rules"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		pol, err := a.service.SetPolicy(r.Context(), req.OrganizationID, req.Type, req.IsEnabled, req.Rules)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(pol)
		return
	}

	policies, err := a.service.ListPolicies(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(policies)
}

func (a *OrganizationAPI) ManageSSO(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	if r.Method == http.MethodPost {
		var req struct {
			OrganizationID string `json:"organization_id"`
			ProviderType   string `json:"provider_type"`
			IssuerURL      string `json:"issuer_url"`
			ClientID       string `json:"client_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		cfg, err := a.service.ConfigureSSO(r.Context(), req.OrganizationID, req.ProviderType, req.IssuerURL, req.ClientID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(cfg)
		return
	}

	cfg, err := a.service.GetSSOConfig(r.Context(), orgID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(cfg)
}

func (a *OrganizationAPI) GetDirectory(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("organization_id")
	q := r.URL.Query().Get("q")

	dir, err := a.service.SearchDirectory(r.Context(), orgID, q)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(dir)
}
