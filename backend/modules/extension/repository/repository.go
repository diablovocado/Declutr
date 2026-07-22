package repository

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/extension/domain"
)

type ExtensionRepository interface {
	SaveExtension(ctx context.Context, ext *domain.Extension) error
	GetExtensionByID(ctx context.Context, id string) (*domain.Extension, error)
	ListMarketplaceExtensions(ctx context.Context, category string, query string) ([]domain.Extension, error)

	SaveVersion(ctx context.Context, ver *domain.ExtensionVersion) error
	ListVersions(ctx context.Context, extID string) ([]domain.ExtensionVersion, error)

	InstallExtension(ctx context.Context, inst *domain.ExtensionInstallation) error
	ListInstallations(ctx context.Context, userID string) ([]domain.ExtensionInstallation, error)
	GetInstallation(ctx context.Context, extID string, userID string) (*domain.ExtensionInstallation, error)
	UpdateInstallationStatus(ctx context.Context, instID string, status domain.InstallationStatus) error
	UpdateApprovedPermissions(ctx context.Context, instID string, perms []string) error

	AddReview(ctx context.Context, review *domain.ExtensionReview) error
	ListReviews(ctx context.Context, extID string) ([]domain.ExtensionReview, error)

	SavePublisher(ctx context.Context, pub *domain.Publisher) error
	GetPublisher(ctx context.Context, id string) (*domain.Publisher, error)
}

type InMemoryExtensionRepository struct {
	mu            sync.RWMutex
	extensions    map[string]*domain.Extension
	versions      map[string][]domain.ExtensionVersion
	installations map[string]*domain.ExtensionInstallation
	reviews       map[string][]domain.ExtensionReview
	publishers    map[string]*domain.Publisher
}

func NewInMemoryExtensionRepository() *InMemoryExtensionRepository {
	repo := &InMemoryExtensionRepository{
		extensions:    make(map[string]*domain.Extension),
		versions:      make(map[string][]domain.ExtensionVersion),
		installations: make(map[string]*domain.ExtensionInstallation),
		reviews:       make(map[string][]domain.ExtensionReview),
		publishers:    make(map[string]*domain.Publisher),
	}

	// Seed Sample Verified Marketplace Extensions
	repo.seedDefaults()
	return repo
}

func (r *InMemoryExtensionRepository) seedDefaults() {
	pub := &domain.Publisher{
		ID:         "pub-declutr-official",
		Name:       "Declutr Official Core Team",
		Email:      "engineering@declutr.dev",
		Website:    "https://declutr.dev",
		IsVerified: true,
		CreatedAt:  time.Now().UTC(),
	}
	r.publishers[pub.ID] = pub

	ext1 := &domain.Extension{
		ID:         "ext-ai-ocr",
		Slug:       "ocr-document-extractor",
		Publisher:  *pub,
		IsVerified: true,
		IsFeatured: true,
		Rating:     4.9,
		Manifest: domain.ExtensionManifest{
			ID:                "ext-ai-ocr",
			Name:              "DeepVision OCR Extractor",
			Version:           "1.2.0",
			Author:            "Declutr Official",
			PublisherID:       pub.ID,
			License:           "MIT",
			Description:       "High-accuracy optical character recognition & structured field extraction for PDF and image scans",
			Category:          domain.CategoryAI,
			Type:              domain.TypeMetadataExtractor,
			Homepage:          "https://declutr.dev/extensions/ocr",
			Capabilities:      []string{"ocr", "text_extraction"},
			Permissions:       []string{domain.PermVaultRead, domain.PermVaultWrite},
			MinDeclutrVersion: "1.0.0",
		},
		DownloadsCount: 14200,
		ReviewsCount:   84,
		CreatedAt:      time.Now().UTC(),
	}

	ext2 := &domain.Extension{
		ID:         "ext-notion-importer",
		Slug:       "notion-workspace-sync",
		Publisher:  *pub,
		IsVerified: true,
		IsFeatured: true,
		Rating:     4.8,
		Manifest: domain.ExtensionManifest{
			ID:                "ext-notion-importer",
			Name:              "Notion Vault Importer",
			Version:           "2.0.1",
			Author:            "Declutr Official",
			PublisherID:       pub.ID,
			License:           "MIT",
			Description:       "Bi-directional sync and page importer for Notion databases into Declutr Vaults",
			Category:          domain.CategoryProductivity,
			Type:              domain.TypeImporter,
			Homepage:          "https://declutr.dev/extensions/notion",
			Capabilities:      []string{"notion_sync", "import"},
			Permissions:       []string{domain.PermVaultWrite, domain.PermSearchQuery},
			MinDeclutrVersion: "1.0.0",
		},
		DownloadsCount: 9800,
		ReviewsCount:   52,
		CreatedAt:      time.Now().UTC(),
	}

	r.extensions[ext1.ID] = ext1
	r.extensions[ext2.ID] = ext2
}

func (r *InMemoryExtensionRepository) SaveExtension(ctx context.Context, ext *domain.Extension) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.extensions[ext.ID] = ext
	return nil
}

func (r *InMemoryExtensionRepository) GetExtensionByID(ctx context.Context, id string) (*domain.Extension, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	ext, ok := r.extensions[id]
	if !ok {
		return nil, fmt.Errorf("extension %s not found", id)
	}
	return ext, nil
}

func (r *InMemoryExtensionRepository) ListMarketplaceExtensions(ctx context.Context, category string, query string) ([]domain.Extension, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []domain.Extension
	for _, ext := range r.extensions {
		if category != "" && ext.Manifest.Category != category {
			continue
		}
		result = append(result, *ext)
	}
	return result, nil
}

func (r *InMemoryExtensionRepository) SaveVersion(ctx context.Context, ver *domain.ExtensionVersion) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.versions[ver.ExtensionID] = append(r.versions[ver.ExtensionID], *ver)
	return nil
}

func (r *InMemoryExtensionRepository) ListVersions(ctx context.Context, extID string) ([]domain.ExtensionVersion, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.versions[extID], nil
}

func (r *InMemoryExtensionRepository) InstallExtension(ctx context.Context, inst *domain.ExtensionInstallation) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.installations[inst.ID] = inst
	return nil
}

func (r *InMemoryExtensionRepository) ListInstallations(ctx context.Context, userID string) ([]domain.ExtensionInstallation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []domain.ExtensionInstallation
	for _, inst := range r.installations {
		if inst.UserID == userID {
			result = append(result, *inst)
		}
	}
	return result, nil
}

func (r *InMemoryExtensionRepository) GetInstallation(ctx context.Context, extID string, userID string) (*domain.ExtensionInstallation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, inst := range r.installations {
		if inst.ExtensionID == extID && inst.UserID == userID {
			return inst, nil
		}
	}
	return nil, fmt.Errorf("installation not found")
}

func (r *InMemoryExtensionRepository) UpdateInstallationStatus(ctx context.Context, instID string, status domain.InstallationStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	inst, ok := r.installations[instID]
	if !ok {
		return fmt.Errorf("installation not found")
	}
	inst.Status = status
	inst.UpdatedAt = time.Now().UTC()
	return nil
}

func (r *InMemoryExtensionRepository) UpdateApprovedPermissions(ctx context.Context, instID string, perms []string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	inst, ok := r.installations[instID]
	if !ok {
		return fmt.Errorf("installation not found")
	}
	inst.ApprovedPermissions = perms
	inst.UpdatedAt = time.Now().UTC()
	return nil
}

func (r *InMemoryExtensionRepository) AddReview(ctx context.Context, review *domain.ExtensionReview) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.reviews[review.ExtensionID] = append(r.reviews[review.ExtensionID], *review)
	return nil
}

func (r *InMemoryExtensionRepository) ListReviews(ctx context.Context, extID string) ([]domain.ExtensionReview, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.reviews[extID], nil
}

func (r *InMemoryExtensionRepository) SavePublisher(ctx context.Context, pub *domain.Publisher) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.publishers[pub.ID] = pub
	return nil
}

func (r *InMemoryExtensionRepository) GetPublisher(ctx context.Context, id string) (*domain.Publisher, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	pub, ok := r.publishers[id]
	if !ok {
		return nil, fmt.Errorf("publisher not found")
	}
	return pub, nil
}
