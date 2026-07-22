package application

import (
	"context"
	"fmt"
	"time"

	"github.com/diablovocado/declutr/modules/extension/domain"
	"github.com/diablovocado/declutr/modules/extension/repository"
	"github.com/diablovocado/declutr/shared/observability"
)

// ExtensionService manages extensions, capability registry, marketplace, and lifecycle.
type ExtensionService struct {
	repo    repository.ExtensionRepository
	sandbox *ExtensionSandbox
}

func NewExtensionService(repo repository.ExtensionRepository, sandbox *ExtensionSandbox) *ExtensionService {
	if sandbox == nil {
		sandbox = NewExtensionSandbox(SandboxConfig{})
	}
	return &ExtensionService{
		repo:    repo,
		sandbox: sandbox,
	}
}

func (s *ExtensionService) GetSandbox() *ExtensionSandbox {
	return s.sandbox
}

func (s *ExtensionService) ListMarketplace(ctx context.Context, category string, query string) ([]domain.Extension, error) {
	return s.repo.ListMarketplaceExtensions(ctx, category, query)
}

func (s *ExtensionService) GetExtensionDetails(ctx context.Context, id string) (*domain.Extension, error) {
	return s.repo.GetExtensionByID(ctx, id)
}

func (s *ExtensionService) InstallExtension(ctx context.Context, userID string, extID string, approvedPerms []string) (*domain.ExtensionInstallation, error) {
	ext, err := s.repo.GetExtensionByID(ctx, extID)
	if err != nil {
		return nil, err
	}

	inst := &domain.ExtensionInstallation{
		ID:                  "inst-" + observability.GenerateID(8),
		ExtensionID:         ext.ID,
		UserID:              userID,
		InstalledVersion:    ext.Manifest.Version,
		Status:              domain.StatusInstalled,
		ApprovedPermissions: approvedPerms,
		InstalledAt:         time.Now().UTC(),
		UpdatedAt:           time.Now().UTC(),
	}

	if err := s.repo.InstallExtension(ctx, inst); err != nil {
		return nil, err
	}

	// Increment downloads count
	ext.DownloadsCount++
	_ = s.repo.SaveExtension(ctx, ext)

	return inst, nil
}

func (s *ExtensionService) ListUserInstallations(ctx context.Context, userID string) ([]domain.ExtensionInstallation, error) {
	return s.repo.ListInstallations(ctx, userID)
}

func (s *ExtensionService) ChangeLifecycleState(ctx context.Context, instID string, action string) error {
	var targetStatus domain.InstallationStatus

	switch action {
	case "ENABLE":
		targetStatus = domain.StatusEnabled
	case "DISABLE":
		targetStatus = domain.StatusDisabled
	case "UNINSTALL":
		targetStatus = domain.StatusUninstalled
	default:
		return fmt.Errorf("invalid lifecycle action: %s", action)
	}

	return s.repo.UpdateInstallationStatus(ctx, instID, targetStatus)
}

func (s *ExtensionService) ApprovePermissions(ctx context.Context, instID string, perms []string) error {
	return s.repo.UpdateApprovedPermissions(ctx, instID, perms)
}

func (s *ExtensionService) PublishExtensionVersion(ctx context.Context, manifest domain.ExtensionManifest, bundleURL string, notes string) (*domain.ExtensionVersion, error) {
	if manifest.ID == "" || manifest.Name == "" || manifest.Version == "" {
		return nil, fmt.Errorf("invalid extension manifest attributes")
	}

	ext, err := s.repo.GetExtensionByID(ctx, manifest.ID)
	if err != nil {
		// New extension entry
		ext = &domain.Extension{
			ID:         manifest.ID,
			Slug:       manifest.ID,
			Manifest:   manifest,
			IsVerified: true,
			CreatedAt:  time.Now().UTC(),
		}
	} else {
		ext.Manifest = manifest
		ext.UpdatedAt = time.Now().UTC()
	}
	_ = s.repo.SaveExtension(ctx, ext)

	ver := &domain.ExtensionVersion{
		ID:           "ver-" + observability.GenerateID(8),
		ExtensionID:  manifest.ID,
		Version:      manifest.Version,
		Manifest:     manifest,
		BundleURL:    bundleURL,
		ReleaseNotes: notes,
		PublishedAt:  time.Now().UTC(),
	}

	if err := s.repo.SaveVersion(ctx, ver); err != nil {
		return nil, err
	}
	return ver, nil
}

func (s *ExtensionService) AddReview(ctx context.Context, userID string, userName string, extID string, rating int, comment string) (*domain.ExtensionReview, error) {
	review := &domain.ExtensionReview{
		ID:          "rev-" + observability.GenerateID(8),
		ExtensionID: extID,
		UserID:      userID,
		UserName:    userName,
		Rating:      rating,
		Comment:     comment,
		CreatedAt:   time.Now().UTC(),
	}

	if err := s.repo.AddReview(ctx, review); err != nil {
		return nil, err
	}
	return review, nil
}
