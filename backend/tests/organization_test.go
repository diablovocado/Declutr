package tests

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	orgApp "github.com/diablovocado/declutr/modules/organization/application"
	"github.com/diablovocado/declutr/modules/organization/domain"
	orgRepo "github.com/diablovocado/declutr/modules/organization/repository"
	"github.com/diablovocado/declutr/shared/middleware"
)

func TestOrganizationCreationAndMembership(t *testing.T) {
	repo := orgRepo.NewInMemoryOrganizationRepository()
	service := orgApp.NewOrganizationService(repo)
	ctx := context.Background()

	// 1. Create Organization
	org, err := service.CreateOrganization(ctx, "usr-owner-1", domain.CreateOrganizationRequest{
		Name:        "Acme Enterprise",
		Slug:        "acme-enterprise",
		Description: "Acme Corporation Tenant",
		TimeZone:    "America/New_York",
	})
	if err != nil || org == nil {
		t.Fatalf("Failed to create organization: %v", err)
	}

	if org.Name != "Acme Enterprise" || org.Slug != "acme-enterprise" {
		t.Errorf("Org name/slug mismatch: %s / %s", org.Name, org.Slug)
	}

	// 2. Invite Member
	member, err := service.InviteMember(ctx, org.ID, "alice@acme.com", "role-editor-"+org.ID)
	if err != nil || member == nil {
		t.Fatalf("Failed to invite member: %v", err)
	}

	if member.Status != domain.StatusInvited {
		t.Errorf("Expected status INVITED, got %s", member.Status)
	}

	// 3. Update Member Status
	err = service.UpdateMemberStatus(ctx, org.ID, member.UserID, domain.StatusActive)
	if err != nil {
		t.Errorf("Failed to update status to ACTIVE: %v", err)
	}

	members, _ := service.ListMembers(ctx, org.ID)
	if len(members) != 2 { // Owner + Alice
		t.Errorf("Expected 2 members, got %d", len(members))
	}
}

func TestRBACPermissionEvaluation(t *testing.T) {
	repo := orgRepo.NewInMemoryOrganizationRepository()
	service := orgApp.NewOrganizationService(repo)
	ctx := context.Background()

	org, _ := service.CreateOrganization(ctx, "usr-owner-1", domain.CreateOrganizationRequest{
		Name: "Security Test Org",
		Slug: "sec-org",
	})

	// Owner should have full MANAGE_ORGANIZATION permission
	allowed, err := service.EvaluateUserPermission(ctx, org.ID, "usr-owner-1", domain.PermManageOrg)
	if err != nil || !allowed {
		t.Errorf("Expected owner permission allowed=true, got allowed=%v, err=%v", allowed, err)
	}

	// Non-member should fail permission evaluation
	allowedNonMember, _ := service.EvaluateUserPermission(ctx, org.ID, "usr-stranger", domain.PermManageOrg)
	if allowedNonMember {
		t.Error("Expected stranger allowed=false, got true")
	}
}

func TestWorkspaceClassificationAndGroups(t *testing.T) {
	repo := orgRepo.NewInMemoryOrganizationRepository()
	service := orgApp.NewOrganizationService(repo)
	ctx := context.Background()

	org, _ := service.CreateOrganization(ctx, "usr-owner-1", domain.CreateOrganizationRequest{
		Name: "Tech Corp",
		Slug: "tech-corp",
	})

	// Create Department Workspace
	ws, err := service.CreateWorkspace(ctx, org.ID, "Engineering Vault", domain.WorkspaceDepartment, "Engineering")
	if err != nil || ws == nil {
		t.Fatalf("Failed to create workspace: %v", err)
	}

	if ws.Type != domain.WorkspaceDepartment || ws.Department != "Engineering" {
		t.Errorf("Workspace attributes mismatch: %s / %s", ws.Type, ws.Department)
	}

	// Create Team Group
	group, err := service.CreateGroup(ctx, org.ID, "Core Infra Team", "TEAM", []string{"usr-owner-1"})
	if err != nil || group == nil {
		t.Fatalf("Failed to create group: %v", err)
	}

	groups, _ := service.ListGroups(ctx, org.ID)
	if len(groups) != 1 {
		t.Errorf("Expected 1 group, got %d", len(groups))
	}
}

func TestPolicyEngineSetting(t *testing.T) {
	repo := orgRepo.NewInMemoryOrganizationRepository()
	service := orgApp.NewOrganizationService(repo)
	ctx := context.Background()

	org, _ := service.CreateOrganization(ctx, "usr-owner-1", domain.CreateOrganizationRequest{
		Name: "Policy Test Org",
		Slug: "pol-org",
	})

	policy, err := service.SetPolicy(ctx, org.ID, domain.PolicyMFARequirement, true, map[string]interface{}{
		"enforce_all": true,
	})
	if err != nil || policy == nil {
		t.Fatalf("Failed to set policy: %v", err)
	}

	policies, _ := service.ListPolicies(ctx, org.ID)
	if len(policies) != 1 || !policies[0].IsEnabled {
		t.Errorf("Policy setting mismatch: enabled=%v", policies[0].IsEnabled)
	}
}

func TestTenantIsolationMiddleware(t *testing.T) {
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		orgID, ok := middleware.GetOrganizationIDFromContext(r.Context())
		if !ok || orgID != "org-acme-123" {
			t.Errorf("Expected org-acme-123, got %s", orgID)
		}
		w.WriteHeader(http.StatusOK)
	})

	handlerToTest := middleware.TenantMiddleware(nextHandler)

	req := httptest.NewRequest("GET", "/api/v1/context", nil)
	req.Header.Set("X-Organization-ID", "org-acme-123")
	rec := httptest.NewRecorder()

	handlerToTest.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("Expected HTTP 200, got %d", rec.Code)
	}
}
