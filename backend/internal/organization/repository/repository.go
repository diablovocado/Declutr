package repository

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/organization/domain"
	"github.com/diablovocado/declutr/shared/observability"
)

// OrganizationRepository defines persistence operations for enterprise tenancy.
type OrganizationRepository interface {
	CreateOrganization(ctx context.Context, org *domain.Organization) error
	GetOrganizationByID(ctx context.Context, orgID string) (*domain.Organization, error)
	ListOrganizationsByUserID(ctx context.Context, userID string) ([]domain.Organization, error)
	UpdateOrganizationSettings(ctx context.Context, org *domain.Organization) error

	CreateWorkspace(ctx context.Context, ws *domain.Workspace) error
	ListWorkspaces(ctx context.Context, orgID string) ([]domain.Workspace, error)

	AddMember(ctx context.Context, member *domain.OrganizationMember) error
	GetMember(ctx context.Context, orgID string, userID string) (*domain.OrganizationMember, error)
	ListMembers(ctx context.Context, orgID string) ([]domain.OrganizationMember, error)
	UpdateMemberStatus(ctx context.Context, orgID string, userID string, status domain.MemberStatus) error

	CreateRole(ctx context.Context, role *domain.OrganizationRole) error
	ListRoles(ctx context.Context, orgID string) ([]domain.OrganizationRole, error)

	CreateGroup(ctx context.Context, group *domain.OrganizationGroup) error
	ListGroups(ctx context.Context, orgID string) ([]domain.OrganizationGroup, error)

	SetPolicy(ctx context.Context, policy *domain.OrganizationPolicy) error
	ListPolicies(ctx context.Context, orgID string) ([]domain.OrganizationPolicy, error)

	SetSSOConfig(ctx context.Context, cfg *domain.SSOConfig) error
	GetSSOConfig(ctx context.Context, orgID string) (*domain.SSOConfig, error)
}

// InMemoryOrganizationRepository provides a thread-safe in-memory store.
type InMemoryOrganizationRepository struct {
	mu            sync.RWMutex
	organizations map[string]*domain.Organization
	workspaces    map[string][]domain.Workspace
	members       map[string][]domain.OrganizationMember // orgID -> members
	roles         map[string][]domain.OrganizationRole   // orgID -> roles
	groups        map[string][]domain.OrganizationGroup  // orgID -> groups
	policies      map[string][]domain.OrganizationPolicy // orgID -> policies
	ssoConfigs    map[string]*domain.SSOConfig           // orgID -> SSOConfig
}

// NewInMemoryOrganizationRepository creates repository instance with default system roles.
func NewInMemoryOrganizationRepository() *InMemoryOrganizationRepository {
	return &InMemoryOrganizationRepository{
		organizations: make(map[string]*domain.Organization),
		workspaces:    make(map[string][]domain.Workspace),
		members:       make(map[string][]domain.OrganizationMember),
		roles:         make(map[string][]domain.OrganizationRole),
		groups:        make(map[string][]domain.OrganizationGroup),
		policies:      make(map[string][]domain.OrganizationPolicy),
		ssoConfigs:    make(map[string]*domain.SSOConfig),
	}
}

func (r *InMemoryOrganizationRepository) CreateOrganization(ctx context.Context, org *domain.Organization) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.organizations[org.ID] = org

	// Initialize default system roles for organization
	defaultRoles := []domain.OrganizationRole{
		{ID: "role-owner-" + org.ID, OrganizationID: org.ID, Name: domain.RoleOwner, Description: "Full organization ownership and administrative access", IsSystemRole: true, Permissions: []string{domain.PermManageOrg, domain.PermManageBilling, domain.PermManageUsers, domain.PermManageVaults, domain.PermManageAI, domain.PermManageWorkflows, domain.PermManageIntegrations, domain.PermManageSecurity, domain.PermManageAudit, domain.PermViewAnalytics}, CreatedAt: time.Now().UTC()},
		{ID: "role-admin-" + org.ID, OrganizationID: org.ID, Name: domain.RoleAdministrator, Description: "Organization administrator", IsSystemRole: true, Permissions: []string{domain.PermManageUsers, domain.PermManageVaults, domain.PermManageAI, domain.PermManageWorkflows, domain.PermManageIntegrations, domain.PermManageSecurity, domain.PermManageAudit, domain.PermViewAnalytics}, CreatedAt: time.Now().UTC()},
		{ID: "role-editor-" + org.ID, OrganizationID: org.ID, Name: domain.RoleEditor, Description: "Content & vault editor", IsSystemRole: true, Permissions: []string{domain.PermManageVaults, domain.PermManageAI, domain.PermManageWorkflows, domain.PermViewAnalytics}, CreatedAt: time.Now().UTC()},
		{ID: "role-viewer-" + org.ID, OrganizationID: org.ID, Name: domain.RoleViewer, Description: "Read-only access to workspaces", IsSystemRole: true, Permissions: []string{domain.PermViewAnalytics}, CreatedAt: time.Now().UTC()},
	}
	r.roles[org.ID] = defaultRoles

	return nil
}

func (r *InMemoryOrganizationRepository) GetOrganizationByID(ctx context.Context, orgID string) (*domain.Organization, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	org, exists := r.organizations[orgID]
	if !exists {
		return nil, fmt.Errorf("organization %s not found", orgID)
	}
	return org, nil
}

func (r *InMemoryOrganizationRepository) ListOrganizationsByUserID(ctx context.Context, userID string) ([]domain.Organization, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []domain.Organization
	for orgID, membersList := range r.members {
		for _, m := range membersList {
			if m.UserID == userID && m.Status == domain.StatusActive {
				if org, ok := r.organizations[orgID]; ok {
					result = append(result, *org)
				}
			}
		}
	}
	return result, nil
}

func (r *InMemoryOrganizationRepository) UpdateOrganizationSettings(ctx context.Context, org *domain.Organization) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.organizations[org.ID] = org
	return nil
}

func (r *InMemoryOrganizationRepository) CreateWorkspace(ctx context.Context, ws *domain.Workspace) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.workspaces[ws.OrganizationID] = append(r.workspaces[ws.OrganizationID], *ws)
	return nil
}

func (r *InMemoryOrganizationRepository) ListWorkspaces(ctx context.Context, orgID string) ([]domain.Workspace, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.workspaces[orgID], nil
}

func (r *InMemoryOrganizationRepository) AddMember(ctx context.Context, member *domain.OrganizationMember) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.members[member.OrganizationID] = append(r.members[member.OrganizationID], *member)
	return nil
}

func (r *InMemoryOrganizationRepository) GetMember(ctx context.Context, orgID string, userID string) (*domain.OrganizationMember, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, m := range r.members[orgID] {
		if m.UserID == userID {
			return &m, nil
		}
	}
	return nil, fmt.Errorf("member %s not found in org %s", userID, orgID)
}

func (r *InMemoryOrganizationRepository) ListMembers(ctx context.Context, orgID string) ([]domain.OrganizationMember, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.members[orgID], nil
}

func (r *InMemoryOrganizationRepository) UpdateMemberStatus(ctx context.Context, orgID string, userID string, status domain.MemberStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	list := r.members[orgID]
	for i, m := range list {
		if m.UserID == userID {
			list[i].Status = status
			r.members[orgID] = list
			return nil
		}
	}
	return fmt.Errorf("member not found")
}

func (r *InMemoryOrganizationRepository) CreateRole(ctx context.Context, role *domain.OrganizationRole) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.roles[role.OrganizationID] = append(r.roles[role.OrganizationID], *role)
	return nil
}

func (r *InMemoryOrganizationRepository) ListRoles(ctx context.Context, orgID string) ([]domain.OrganizationRole, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.roles[orgID], nil
}

func (r *InMemoryOrganizationRepository) CreateGroup(ctx context.Context, group *domain.OrganizationGroup) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.groups[group.OrganizationID] = append(r.groups[group.OrganizationID], *group)
	return nil
}

func (r *InMemoryOrganizationRepository) ListGroups(ctx context.Context, orgID string) ([]domain.OrganizationGroup, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.groups[orgID], nil
}

func (r *InMemoryOrganizationRepository) SetPolicy(ctx context.Context, policy *domain.OrganizationPolicy) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	policies := r.policies[policy.OrganizationID]
	found := false
	for i, p := range policies {
		if p.Type == policy.Type {
			policies[i] = *policy
			found = true
			break
		}
	}
	if !found {
		policies = append(policies, *policy)
	}
	r.policies[policy.OrganizationID] = policies
	return nil
}

func (r *InMemoryOrganizationRepository) ListPolicies(ctx context.Context, orgID string) ([]domain.OrganizationPolicy, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.policies[orgID], nil
}

func (r *InMemoryOrganizationRepository) SetSSOConfig(ctx context.Context, cfg *domain.SSOConfig) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.ssoConfigs[cfg.OrganizationID] = cfg
	return nil
}

func (r *InMemoryOrganizationRepository) GetSSOConfig(ctx context.Context, orgID string) (*domain.SSOConfig, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	cfg, exists := r.ssoConfigs[orgID]
	if !exists {
		return &domain.SSOConfig{
			OrganizationID: orgID,
			ProviderType:   "OIDC",
			IsEnabled:      false,
		}, nil
	}
	return cfg, nil
}
