package application

import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/diablovocado/declutr/modules/extraction/domain"
	"github.com/diablovocado/declutr/modules/extraction/extractors"
	"github.com/diablovocado/declutr/modules/extraction/repository"
)

type ContentService interface {
	ExtractAndSaveContent(ctx context.Context, assetID, filename, mimeType string, reader io.Reader) (*domain.Document, error)
	GetDocument(ctx context.Context, assetID string) (*domain.Document, error)
	GetVersionHistory(ctx context.Context, documentID string) ([]*domain.DocumentVersion, error)
}

type DefaultContentService struct {
	repo     repository.ContentRepository
	registry *extractors.ExtractorRegistry
}

func NewContentService(repo repository.ContentRepository) *DefaultContentService {
	return &DefaultContentService{
		repo:     repo,
		registry: extractors.NewExtractorRegistry(),
	}
}

func (s *DefaultContentService) ExtractAndSaveContent(ctx context.Context, assetID, filename, mimeType string, reader io.Reader) (*domain.Document, error) {
	extractor := s.registry.GetExtractor(mimeType)
	
	if extractor == nil {
		return nil, errors.New("no content extractor supported for mime type: " + mimeType)
	}

	doc, err := extractor.Extract(ctx, assetID, filename, mimeType, reader)
	
	// Create version record
	version := &domain.DocumentVersion{
		VersionID:        "ver_" + fmt.Sprintf("%d", time.Now().UnixNano()),
		Extractor:        doc.Extractor,
		ExtractorVersion: doc.ExtractorVersion,
		CreatedAt:        time.Now(),
	}

	if err != nil {
		version.Status = "FAILED"
		version.ErrorMessage = err.Error()
		// Save version if we have a document ID, but we might not if extraction failed entirely.
		if doc != nil {
			version.DocumentID = doc.DocumentID
			s.repo.SaveVersion(ctx, version)
		}
		return nil, err
	}

	// Persist successful extraction
	if err := s.repo.SaveDocument(ctx, doc); err != nil {
		return nil, err
	}

	if doc.Sections != nil && len(doc.Sections) > 0 {
		if err := s.repo.SaveSections(ctx, doc.Sections); err != nil {
			return nil, err
		}
	}

	if doc.Blocks != nil && len(doc.Blocks) > 0 {
		if err := s.repo.SaveBlocks(ctx, doc.Blocks); err != nil {
			return nil, err
		}
	}

	version.Status = "SUCCESS"
	version.DocumentID = doc.DocumentID
	if err := s.repo.SaveVersion(ctx, version); err != nil {
		return nil, err
	}

	return doc, nil
}

func (s *DefaultContentService) GetDocument(ctx context.Context, assetID string) (*domain.Document, error) {
	doc, err := s.repo.GetDocument(ctx, assetID)
	if err != nil {
		return nil, err
	}
	if doc == nil {
		return nil, nil // Not found
	}

	blocks, _ := s.repo.GetBlocks(ctx, doc.DocumentID)
	sections, _ := s.repo.GetSections(ctx, doc.DocumentID)

	doc.Blocks = blocks
	doc.Sections = sections

	return doc, nil
}

func (s *DefaultContentService) GetVersionHistory(ctx context.Context, documentID string) ([]*domain.DocumentVersion, error) {
	return s.repo.GetVersionHistory(ctx, documentID)
}
