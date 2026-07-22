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
	"github.com/diablovocado/declutr/shared/observability"
	"github.com/diablovocado/declutr/shared/ratelimit"
	"github.com/diablovocado/declutr/shared/resilience"
)

func TestGAProductionSmokeTest(t *testing.T) {
	ctx := context.Background()

	// 1. Observability Audit
	logger := observability.InitLogger("ga-test", nil)
	logger.Info(ctx, "Starting GA v1.0.0 Production Integration Smoke Test", map[string]interface{}{"status": "GA_LAUNCH", "version": "1.0.0"})

	// 2. Cache Verification
	cMgr := cache.GetCacheManager()
	_ = cMgr.Set(ctx, "ga_status", "PRODUCTION_READY", 1*time.Minute)
	val, ok := cMgr.Get(ctx, "ga_status")
	if !ok || val != "PRODUCTION_READY" {
		t.Errorf("Cache layer failed GA check: got %v, ok=%v", val, ok)
	}

	// 3. Circuit Breaker & Resilience Verification
	cb := resilience.NewCircuitBreaker("ga-cb", 5, 10*time.Second)
	cbErr := cb.Execute(func() error { return nil })
	if cbErr != nil {
		t.Errorf("Circuit breaker failed GA check: %v", cbErr)
	}

	// 4. Rate Limiter Token Bucket Check
	rl := ratelimit.NewRateLimiter(10, 20, time.Second)
	if !rl.Allow("ga_user") {
		t.Error("Rate limiter failed GA check")
	}

	// 5. Enterprise Multi-Tenancy Verification
	oRepo := orgRepo.NewInMemoryOrganizationRepository()
	oSvc := orgApp.NewOrganizationService(oRepo)
	org, err := oSvc.CreateOrganization(ctx, "usr-ga-admin", orgDomain.CreateOrganizationRequest{
		Name: "GA Enterprise Corp",
		Slug: "ga-corp",
	})
	if err != nil || org == nil {
		t.Fatalf("Organization creation failed in GA test: %v", err)
	}

	// 6. Developer Platform Key Verification
	dRepo := devRepo.NewInMemoryDeveloperRepository()
	dSvc := devApp.NewDeveloperService(dRepo)
	apiKey, secret, err := dSvc.GenerateAPIKey(ctx, "usr-ga-admin", devDomain.CreateAPIKeyRequest{
		Name:      "GA Production Key",
		Scopes:    []string{devDomain.ScopeVaultRead, devDomain.ScopeVaultWrite},
		ExpiresIn: 365,
	})
	if err != nil || apiKey == nil || secret == "" {
		t.Fatalf("API Key generation failed in GA test: %v", err)
	}

	// 7. Extension Sandbox Verification
	eRepo := extRepo.NewInMemoryExtensionRepository()
	sandbox := extApp.NewExtensionSandbox(extApp.SandboxConfig{MaxExecutionTimeout: 2 * time.Second})
	eSvc := extApp.NewExtensionService(eRepo, sandbox)

	inst, err := eSvc.InstallExtension(ctx, "usr-ga-admin", "ext-ai-ocr", []string{extDomain.PermVaultRead})
	if err != nil || inst == nil {
		t.Fatalf("Extension install failed in GA test: %v", err)
	}

	res, sbErr := sandbox.ExecuteSandbox(ctx, inst, extDomain.PermVaultRead, func(c context.Context) (interface{}, error) {
		return "ga_sandbox_success", nil
	})
	if sbErr != nil || res != "ga_sandbox_success" {
		t.Errorf("Sandbox execution failed in GA test: %v", sbErr)
	}
}
