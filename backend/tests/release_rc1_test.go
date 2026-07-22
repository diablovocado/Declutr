package tests

import (
	"context"
	"testing"
	"time"

	devApp "github.com/diablovocado/declutr/modules/developer/application"
	devDomain "github.com/diablovocado/declutr/modules/developer/domain"
	devRepo "github.com/diablovocado/declutr/modules/developer/repository"

	extApp "github.com/diablovocado/declutr/modules/extension/application"
	extDomain "github.com/diablovocado/declutr/modules/extension/domain"
	extRepo "github.com/diablovocado/declutr/modules/extension/repository"

	orgApp "github.com/diablovocado/declutr/modules/organization/application"
	orgDomain "github.com/diablovocado/declutr/modules/organization/domain"
	orgRepo "github.com/diablovocado/declutr/modules/organization/repository"

	"github.com/diablovocado/declutr/shared/cache"
	"github.com/diablovocado/declutr/shared/middleware"
	"github.com/diablovocado/declutr/shared/observability"
	"github.com/diablovocado/declutr/shared/ratelimit"
	"github.com/diablovocado/declutr/shared/resilience"
)

func TestRC1EndToEndSystemValidation(t *testing.T) {
	ctx := context.Background()

	// 1. Observability & Logging Audit
	logger := observability.InitLogger("rc1-test", nil)
	logger.Info(ctx, "Starting RC1 Master System Integration Test", map[string]interface{}{"version": "1.0.0-rc1"})

	// 2. Cache Abstraction Layer Audit
	cacheMgr := cache.GetCacheManager()
	_ = cacheMgr.Set(ctx, "rc1_key", "rc1_val", 10*time.Second)
	val, ok := cacheMgr.Get(ctx, "rc1_key")
	if !ok || val != "rc1_val" {
		t.Errorf("Cache abstraction layer validation failed: got %v, ok=%v", val, ok)
	}

	// 3. Rate Limiter Audit
	limiter := ratelimit.NewRateLimiter(5, 10, time.Second)
	if !limiter.Allow("rc1_user") {
		t.Error("Rate limiter initial token check failed")
	}

	// 4. Circuit Breaker Resilience Audit
	cb := resilience.NewCircuitBreaker("rc1-cb", 3, 5*time.Second)
	cbErr := cb.Execute(func() error {
		return nil
	})
	if cbErr != nil {
		t.Errorf("Circuit breaker execution failed: %v", cbErr)
	}

	// 5. Multi-Tenant Enterprise Organizations Audit
	oRepo := orgRepo.NewInMemoryOrganizationRepository()
	oService := orgApp.NewOrganizationService(oRepo)
	org, err := oService.CreateOrganization(ctx, "usr-owner-rc1", orgDomain.CreateOrganizationRequest{
		Name: "RC1 Enterprise Corp",
		Slug: "rc1-corp",
	})
	if err != nil || org == nil {
		t.Fatalf("Enterprise Organization creation failed: %v", err)
	}

	// Permission Audit
	allowed, _ := oService.EvaluateUserPermission(ctx, org.ID, "usr-owner-rc1", orgDomain.PermManageOrg)
	if !allowed {
		t.Error("Expected owner permission allowed=true, got false")
	}

	// 6. Developer Platform & Scoped API Key Audit
	dRepo := devRepo.NewInMemoryDeveloperRepository()
	dService := devApp.NewDeveloperService(dRepo)
	apiKey, secret, err := dService.GenerateAPIKey(ctx, "usr-owner-rc1", devDomain.CreateAPIKeyRequest{
		Name:      "RC1 Integration Key",
		Scopes:    []string{devDomain.ScopeVaultRead, devDomain.ScopeSearchQuery},
		ExpiresIn: 365,
	})
	if err != nil || apiKey == nil || secret == "" {
		t.Fatalf("Developer API Key generation failed: %v", err)
	}

	validatedKey, keyOk := dService.ValidateAPIKey(ctx, secret, devDomain.ScopeVaultRead)
	if !keyOk || validatedKey == nil {
		t.Errorf("API Key validation failed for scope vault.read")
	}

	// 7. Extension Platform & Sandbox Quota Audit
	eRepo := extRepo.NewInMemoryExtensionRepository()
	sandbox := extApp.NewExtensionSandbox(extApp.SandboxConfig{MaxExecutionTimeout: 1 * time.Second})
	eService := extApp.NewExtensionService(eRepo, sandbox)

	inst, err := eService.InstallExtension(ctx, "usr-owner-rc1", "ext-ai-ocr", []string{extDomain.PermVaultRead})
	if err != nil || inst == nil {
		t.Fatalf("Extension installation failed: %v", err)
	}

	// Sandbox Execution Check
	res, sbErr := sandbox.ExecuteSandbox(ctx, inst, extDomain.PermVaultRead, func(c context.Context) (interface{}, error) {
		return "rc1_sandbox_pass", nil
	})
	if sbErr != nil || res != "rc1_sandbox_pass" {
		t.Errorf("Extension sandbox execution failed: %v", sbErr)
	}
}

func TestRC1TenantMiddlewareContextPropagation(t *testing.T) {
	orgID := "org-rc1-999"
	ctx := middleware.SetOrganizationIDInContext(context.Background(), orgID)
	retrievedID, ok := middleware.GetOrganizationIDFromContext(ctx)
	if !ok || retrievedID != orgID {
		t.Errorf("Tenant context propagation failed: expected %s, got %s", orgID, retrievedID)
	}
}
