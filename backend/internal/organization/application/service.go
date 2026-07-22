package application

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/diablovocado/declutr/internal/organization/domain"
	"github.com/diablovocado/declutr/internal/organization/repository"
	"github.com/diablovocado/declutr/utils"
)

// OrganizationService manages tenancy, workspaces, membership, roles, and enterprise governance.
type OrganizationService struct {
	repo repository.OrganizationRepository
}

func NewOrganizationService(repo repository.OrganizationRepository) *OrganizationService {
	return &OrganizationService{repo: repo}
}

func (s *OrganizationService) CreateOrganization(ctx context.Context, ownerID string, req domain.CreateOrganizationRequest) (*domain.Organization, error) {
	orgID := "org-" + utils.GenerateID(8)
	now := time.Now().UTC()

	tz := req.TimeZone
	if tz == "" {
		tz = "UTC"
	}
	lang := req.Language
	if lang == "" {
		lang = "en"
	}

	org := &domain.Organization{
		ID:          orgID,
		Name:        req.Name,
		Slug:        req.Slug,
		OwnerID:     ownerID,
		Description: req.Description,
		TimeZone:    tz,
		Language:    lang,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err := s.repo.CreateOrganization(ctx, org); err != nil {
		return nil, err
	}

	// Add Owner member
	ownerMember := &domain.OrganizationMember{
		ID:             "mem-" + utils.GenerateID(8),
		OrganizationID: orgID,
		UserID:         ownerID,
		RoleID:         "role-owner-" + orgID,
		RoleName:       domain.RoleOwner,
		Status:         domain.StatusActive,
		JoinedAt:       now,
		LastActiveAt:   now,
	}
	_ = s.repo.AddMember(ctx, ownerMember)

	// Create Default Organization Workspace
	ws := &domain.Workspace{
		ID:             "ws-" + utils.GenerateID(8),
		OrganizationID: orgID,
		VaultID:        "vault-org-" + orgID,
		Name:           req.Name + " General Workspace",
		Type:           domain.WorkspaceOrganization,
		IsDefault:      true,
		CreatedAt:      now,
	}
	_ = s.repo.CreateWorkspace(ctx, ws)

	return org, nil
}

func (s *OrganizationService) GetOrganization(ctx context.Context, orgID string) (*domain.Organization, error) {
	return s.repo.GetOrganizationByID(ctx, orgID)
}

func (s *OrganizationService) ListUserOrganizations(ctx context.Context, userID string) ([]domain.Organization, error) {
	return s.repo.ListOrganizationsByUserID(ctx, userID)
}

func (s *OrganizationService) UpdateSettings(ctx context.Context, orgID string, org *domain.Organization) error {
	org.ID = orgID
	org.UpdatedAt = time.Now().UTC()
	return s.repo.UpdateOrganizationSettings(ctx, org)
}

func (s *OrganizationService) InviteMember(ctx context.Context, orgID string, email string, roleID string) (*domain.OrganizationMember, error) {
	member := &domain.OrganizationMember{
		ID:             "mem-" + utils.GenerateID(8),
		OrganizationID: orgID,
		UserID:         "usr-" + utils.GenerateID(8),
		Email:          email,
		Name:           strings.Split(email, "@")[0],
		RoleID:         roleID,
		RoleName:       domain.RoleEditor,
		Status:         domain.StatusInvited,
		JoinedAt:       time.Now().UTC(),
		LastActiveAt:   time.Now().UTC(),
	}

	if err := s.repo.AddMember(ctx, member); err != nil {
		return nil, err
	}
	return member, nil
}

func (s *OrganizationService) ListMembers(ctx context.Context, orgID string) ([]domain.OrganizationMember, error) {
	return s.repo.ListMembers(ctx, orgID)
}

func (s *OrganizationService) UpdateMemberStatus(ctx context.Context, orgID string, userID string, status domain.MemberStatus) error {
	return s.repo.UpdateMemberStatus(ctx, orgID, userID, status)
}

func (s *OrganizationService) TransferOwnership(ctx context.Context, orgID string, newOwnerID string) error {
	org, err := s.repo.GetOrganizationByID(ctx, orgID)
	if err != nil {
		return err
	}

	org.OwnerID = newOwnerID
	org.UpdatedAt = time.Now().UTC()

	// Update new owner role
	_ = s.repo.UpdateMemberStatus(ctx, orgID, newOwnerID, domain.StatusActive)
	return s.repo.UpdateOrganizationSettings(ctx, org)
}

func (s *OrganizationService) CreateWorkspace(ctx context.Context, orgID string, name string, wsType domain.WorkspaceType, dept string) (*domain.Workspace, error) {
	ws := &domain.Workspace{
		ID:             "ws-" + utils.GenerateID(8),
		OrganizationID: orgID,
		VaultID:        "vault-" + utils.GenerateID(8),
		Name:           name,
		Type:           wsType,
		Department:     dept,
		IsDefault:      false,
		CreatedAt:      time.Now().UTC(),
	}

	if err := s.repo.CreateWorkspace(ctx, ws); err != nil {
		return nil, err
	}
	return ws, nil
}

func (s *OrganizationService) ListWorkspaces(ctx context.Context, orgID string) ([]domain.Workspace, error) {
	return s.repo.ListWorkspaces(ctx, orgID)
}

func (s *OrganizationService) CreateRole(ctx context.Context, orgID string, name string, desc string, perms []string) (*domain.OrganizationRole, error) {
	role := &domain.OrganizationRole{
		ID:             "role-" + utils.GenerateID(8),
		OrganizationID: orgID,
		Name:           name,
		Description:    desc,
		IsSystemRole:   false,
		Permissions:    perms,
		CreatedAt:      time.Now().UTC(),
	}

	if err := s.repo.CreateRole(ctx, role); err != nil {
		return nil, err
	}
	return role, nil
}

func (s *OrganizationService) ListRoles(ctx context.Context, orgID string) ([]domain.OrganizationRole, error) {
	return s.repo.ListRoles(ctx, orgID)
}

func (s *OrganizationService) CreateGroup(ctx context.Context, orgID string, name string, groupType string, memberUserIDs []string) (*domain.OrganizationGroup, error) {
	group := &domain.OrganizationGroup{
		ID:             "grp-" + utils.GenerateID(8),
		OrganizationID: orgID,
		Name:           name,
		Type:           groupType,
		MemberUserIDs:  memberUserIDs,
		CreatedAt:      time.Now().UTC(),
	}

	if err := s.repo.CreateGroup(ctx, group); err != nil {
		return nil, err
	}
	return group, nil
}

func (s *OrganizationService) ListGroups(ctx context.Context, orgID string) ([]domain.OrganizationGroup, error) {
	return s.repo.ListGroups(ctx, orgID)
}

func (s *OrganizationService) SetPolicy(ctx context.Context, orgID string, policyType domain.PolicyType, enabled bool, rules map[string]interface{}) (*domain.OrganizationPolicy, error) {
	policy := &domain.OrganizationPolicy{
		ID:             "pol-" + utils.GenerateID(8),
		OrganizationID: orgID,
		Type:           policyType,
		IsEnabled:      enabled,
		Rules:          rules,
		UpdatedAt:      time.Now().UTC(),
	}

	if err := s.repo.SetPolicy(ctx, policy); err != nil {
		return nil, err
	}
	return policy, nil
}

func (s *OrganizationService) ListPolicies(ctx context.Context, orgID string) ([]domain.OrganizationPolicy, error) {
	return s.repo.ListPolicies(ctx, orgID)
}

func (s *OrganizationService) ConfigureSSO(ctx context.Context, orgID string, provider string, issuer string, clientID string) (*domain.SSOConfig, error) {
	cfg := &domain.SSOConfig{
		ID:             "sso-" + utils.GenerateID(8),
		OrganizationID: orgID,
		ProviderType:   provider,
		IsEnabled:      true,
		IssuerURL:      issuer,
		ClientID:       clientID,
		UpdatedAt:      time.Now().UTC(),
	}

	if err := s.repo.SetSSOConfig(ctx, cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}

func (s *OrganizationService) GetSSOConfig(ctx context.Context, orgID string) (*domain.SSOConfig, error) {
	return s.repo.GetSSOConfig(ctx, orgID)
}

func (s *OrganizationService) SearchDirectory(ctx context.Context, orgID string, query string) (*domain.OrganizationDirectory, error) {
	members, _ := s.repo.ListMembers(ctx, orgID)
	groups, _ := s.repo.ListGroups(ctx, orgID)
	workspaces, _ := s.repo.ListWorkspaces(ctx, orgID)

	q := strings.ToLower(query)
	var filteredMembers []domain.OrganizationMember
	for _, m := range members {
		if q == "" || strings.Contains(strings.ToLower(m.Name), q) || strings.Contains(strings.ToLower(m.Email), q) {
			filteredMembers = append(filteredMembers, m)
		}
	}

	var filteredGroups []domain.OrganizationGroup
	for _, g := range groups {
		if q == "" || strings.Contains(strings.ToLower(g.Name), q) {
			filteredGroups = append(filteredGroups, g)
		}
	}

	var filteredWS []domain.Workspace
	for _, ws := range workspaces {
		if q == "" || strings.Contains(strings.ToLower(ws.Name), q) {
			filteredWS = append(filteredWS, ws)
		}
	}

	return &domain.OrganizationDirectory{
		Members:    filteredMembers,
		Groups:     filteredGroups,
		Workspaces: filteredWS,
	}, nil
}

// EvaluateUserPermission checks if a user has a specific granular permission in an organization.
func (s *OrganizationService) EvaluateUserPermission(ctx context.Context, orgID string, userID string, permission string) (bool, error) {
	member, err := s.repo.GetMember(ctx, orgID, userID)
	if err != nil {
		return false, fmt.Errorf("user is not a member of organization")
	}

	if member.Status != domain.StatusActive {
		return false, nil
	}

	roles, _ := s.repo.ListRoles(ctx, orgID)
	for _, r := range roles {
		if r.ID == member.RoleID || r.Name == member.RoleName {
			for _, p := range r.Permissions {
				if p == permission || p == domain.PermManageOrg {
					return true, nil
				}
			}
		}
	}
	return false, nil
}
