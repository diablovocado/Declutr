package domain

import (
	"time"
)

// MemberStatus defines organizational member states.
type MemberStatus string

const (
	StatusActive      MemberStatus = "ACTIVE"
	StatusInvited     MemberStatus = "INVITED"
	StatusSuspended   MemberStatus = "SUSPENDED"
	StatusDeactivated MemberStatus = "DEACTIVATED"
)

// WorkspaceType defines workspace classifications.
type WorkspaceType string

const (
	WorkspacePersonal     WorkspaceType = "PERSONAL"
	WorkspaceOrganization WorkspaceType = "ORGANIZATION"
	WorkspaceDepartment   WorkspaceType = "DEPARTMENT"
	WorkspaceShared       WorkspaceType = "SHARED"
	WorkspaceArchived     WorkspaceType = "ARCHIVED"
)

// Default Role Names
const (
	RoleOwner         = "OWNER"
	RoleAdministrator = "ADMINISTRATOR"
	RoleManager       = "MANAGER"
	RoleEditor        = "EDITOR"
	RoleContributor   = "CONTRIBUTOR"
	RoleViewer        = "VIEWER"
	RoleGuest         = "GUEST"
)

// Granular Permission Constants
const (
	PermManageOrg          = "MANAGE_ORGANIZATION"
	PermManageBilling      = "MANAGE_BILLING"
	PermManageUsers        = "MANAGE_USERS"
	PermManageVaults       = "MANAGE_VAULTS"
	PermManageAI           = "MANAGE_AI"
	PermManageWorkflows    = "MANAGE_WORKFLOWS"
	PermManageIntegrations = "MANAGE_INTEGRATIONS"
	PermManageSecurity     = "MANAGE_SECURITY"
	PermManageAudit        = "MANAGE_AUDIT"
	PermViewAnalytics      = "VIEW_ANALYTICS"
)

// PolicyType defines organization governance policies.
type PolicyType string

const (
	PolicyPassword           PolicyType = "PASSWORD_POLICY"
	PolicySessionTimeout     PolicyType = "SESSION_TIMEOUT"
	PolicyMFARequirement     PolicyType = "MFA_REQUIREMENT"
	PolicySharingRestriction PolicyType = "SHARING_RESTRICTION"
	PolicyRetention          PolicyType = "RETENTION_POLICY"
	PolicyAIUsage            PolicyType = "AI_USAGE_POLICY"
	PolicyWorkflowRestriction PolicyType = "WORKFLOW_RESTRICTION"
)

// Organization represents an enterprise tenant entity.
type Organization struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Slug        string                 `json:"slug"`
	OwnerID     string                 `json:"owner_id"`
	LogoURL     string                 `json:"logo_url,omitempty"`
	Description string                 `json:"description,omitempty"`
	Domains     []string               `json:"domains,omitempty"`
	TimeZone    string                 `json:"time_zone"`
	Language    string                 `json:"language"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
}

// Workspace represents a vault / workspace within an organization.
type Workspace struct {
	ID             string        `json:"id"`
	OrganizationID string        `json:"organization_id,omitempty"` // empty for personal workspace
	VaultID        string        `json:"vault_id"`
	Name           string        `json:"name"`
	Type           WorkspaceType `json:"type"`
	Department     string        `json:"department,omitempty"`
	IsDefault      bool          `json:"is_default"`
	CreatedAt      time.Time     `json:"created_at"`
}

// OrganizationMember connects users to an organization with a role.
type OrganizationMember struct {
	ID             string       `json:"id"`
	OrganizationID string       `json:"organization_id"`
	UserID         string       `json:"user_id"`
	Email          string       `json:"email"`
	Name           string       `json:"name"`
	RoleID         string       `json:"role_id"`
	RoleName       string       `json:"role_name"`
	Status         MemberStatus `json:"status"`
	JoinedAt       time.Time    `json:"joined_at"`
	LastActiveAt   time.Time    `json:"last_active_at"`
}

// OrganizationRole defines RBAC roles and permission associations.
type OrganizationRole struct {
	ID             string   `json:"id"`
	OrganizationID string   `json:"organization_id"`
	Name           string   `json:"name"`
	Description    string   `json:"description"`
	IsSystemRole   bool     `json:"is_system_role"`
	Permissions    []string `json:"permissions"`
	CreatedAt      time.Time `json:"created_at"`
}

// OrganizationGroup represents a team or department group.
type OrganizationGroup struct {
	ID             string   `json:"id"`
	OrganizationID string   `json:"organization_id"`
	Name           string   `json:"name"`
	Type           string   `json:"type"` // TEAM, DEPARTMENT, DYNAMIC
	Description    string   `json:"description,omitempty"`
	RoleIDs        []string `json:"role_ids,omitempty"`
	MemberUserIDs  []string `json:"member_user_ids,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
}

// OrganizationPolicy defines governance and security policies.
type OrganizationPolicy struct {
	ID             string                 `json:"id"`
	OrganizationID string                 `json:"organization_id"`
	Type           PolicyType             `json:"type"`
	IsEnabled      bool                   `json:"is_enabled"`
	Rules          map[string]interface{} `json:"rules"`
	UpdatedAt      time.Time              `json:"updated_at"`
}

// SSOConfig defines Single Sign-On framework abstractions.
type SSOConfig struct {
	ID             string    `json:"id"`
	OrganizationID string    `json:"organization_id"`
	ProviderType   string    `json:"provider_type"` // SAML, OIDC, AZURE_AD, GOOGLE_WORKSPACE, OKTA
	IsEnabled      bool      `json:"is_enabled"`
	IssuerURL      string    `json:"issuer_url"`
	ClientID       string    `json:"client_id"`
	MetadataURL    string    `json:"metadata_url,omitempty"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// CreateOrganizationRequest payload.
type CreateOrganizationRequest struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description,omitempty"`
	TimeZone    string `json:"time_zone,omitempty"`
	Language    string `json:"language,omitempty"`
}

// InviteMemberRequest payload.
type InviteMemberRequest struct {
	OrganizationID string `json:"organization_id"`
	Email          string `json:"email"`
	RoleID         string `json:"role_id"`
}

// OrganizationDirectory represents enterprise search directory results.
type OrganizationDirectory struct {
	Members    []OrganizationMember `json:"members"`
	Groups     []OrganizationGroup  `json:"groups"`
	Workspaces []Workspace          `json:"workspaces"`
}
