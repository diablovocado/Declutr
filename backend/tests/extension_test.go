package tests

import (
	"context"
	"testing"
	"time"

	extApp "github.com/diablovocado/declutr/internal/settings/application"
	"github.com/diablovocado/declutr/internal/settings/domain"
	extRepo "github.com/diablovocado/declutr/internal/settings/repository"
)

func TestExtensionInstallationAndLifecycle(t *testing.T) {
	repo := extRepo.NewInMemoryExtensionRepository()
	sandbox := extApp.NewExtensionSandbox(extApp.SandboxConfig{
		MaxExecutionTimeout: 2 * time.Second,
	})
	service := extApp.NewExtensionService(repo, sandbox)
	ctx := context.Background()

	// 1. Install Seeded Extension
	inst, err := service.InstallExtension(ctx, "usr-test-1", "ext-ai-ocr", []string{domain.PermVaultRead})
	if err != nil || inst == nil {
		t.Fatalf("Failed to install extension: %v", err)
	}

	if inst.Status != domain.StatusInstalled {
		t.Errorf("Expected status INSTALLED, got %s", inst.Status)
	}

	// 2. Enable Extension
	err = service.ChangeLifecycleState(ctx, inst.ID, "ENABLE")
	if err != nil {
		t.Errorf("Failed to enable extension: %v", err)
	}

	installs, _ := service.ListUserInstallations(ctx, "usr-test-1")
	if len(installs) != 1 || installs[0].Status != domain.StatusEnabled {
		t.Errorf("Expected 1 enabled installation, got %v", installs)
	}

	// 3. Disable Extension
	_ = service.ChangeLifecycleState(ctx, inst.ID, "DISABLE")
	installs, _ = service.ListUserInstallations(ctx, "usr-test-1")
	if installs[0].Status != domain.StatusDisabled {
		t.Errorf("Expected status DISABLED, got %s", installs[0].Status)
	}
}

func TestSandboxPermissionAndTimeoutEnforcement(t *testing.T) {
	repo := extRepo.NewInMemoryExtensionRepository()
	sandbox := extApp.NewExtensionSandbox(extApp.SandboxConfig{
		MaxExecutionTimeout: 100 * time.Millisecond,
	})
	ctx := context.Background()

	inst := &domain.ExtensionInstallation{
		ID:                  "inst-test",
		ExtensionID:         "ext-ai-ocr",
		UserID:              "usr-test-1",
		Status:              domain.StatusEnabled,
		ApprovedPermissions: []string{domain.PermVaultRead},
	}

	// Test Permission Approved Execution
	res, err := sandbox.ExecuteSandbox(ctx, inst, domain.PermVaultRead, func(c context.Context) (interface{}, error) {
		return "execution_success", nil
	})
	if err != nil || res != "execution_success" {
		t.Errorf("Expected sandbox execution success, got res=%v, err=%v", res, err)
	}

	// Test Permission Violation Interceptor
	_, permErr := sandbox.ExecuteSandbox(ctx, inst, domain.PermVaultWrite, func(c context.Context) (interface{}, error) {
		return "should_not_run", nil
	})
	if permErr == nil {
		t.Error("Expected sandbox permission error for vault.write, got nil")
	}

	// Test Execution Timeout Enforcement
	_, timeoutErr := sandbox.ExecuteSandbox(ctx, inst, domain.PermVaultRead, func(c context.Context) (interface{}, error) {
		time.Sleep(300 * time.Millisecond) // Exceeds 100ms
		return "timeout_test", nil
	})
	if timeoutErr == nil {
		t.Error("Expected sandbox timeout error, got nil")
	}
}

func TestMarketplacePublishAndReviews(t *testing.T) {
	repo := extRepo.NewInMemoryExtensionRepository()
	service := extApp.NewExtensionService(repo, nil)
	ctx := context.Background()

	// 1. Publish Release
	ver, err := service.PublishExtensionVersion(ctx, domain.ExtensionManifest{
		ID:          "ext-custom-theme",
		Name:        "Cyberpunk Dark Theme",
		Version:     "1.0.0",
		Author:      "Theme Crafter",
		Category:    domain.CategoryThemes,
		Type:        domain.TypeTheme,
		Description: "Futuristic dark neon palette theme",
		Permissions: []string{},
	}, "https://cdn.test/theme.js", "First release")

	if err != nil || ver == nil {
		t.Fatalf("Failed to publish extension version: %v", err)
	}

	// 2. Add Review
	review, err := service.AddReview(ctx, "usr-reviewer-1", "John Reviewer", "ext-custom-theme", 5, "Awesome theme!")
	if err != nil || review == nil {
		t.Fatalf("Failed to add review: %v", err)
	}

	// 3. Search Marketplace by Category
	results, err := service.ListMarketplace(ctx, domain.CategoryThemes, "")
	if err != nil || len(results) != 1 {
		t.Errorf("Expected 1 theme extension, got %d", len(results))
	}
}
