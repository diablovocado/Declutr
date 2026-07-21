package extractors

import (
	"bufio"
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"strings"
	"time"

	"github.com/diablovocado/declutr/modules/extraction/domain"
)

type ContentExtractor interface {
	Supports(mimeType string) bool
	Extract(ctx context.Context, assetID, filename, mimeType string, reader io.Reader) (*domain.Document, error)
}

type ExtractorRegistry struct {
	extractors []ContentExtractor
}

func NewExtractorRegistry() *ExtractorRegistry {
	return &ExtractorRegistry{
		extractors: []ContentExtractor{
			&TextExtractor{},
			&StubDocumentExtractor{}, // For PDF, DOCX
		},
	}
}

func (r *ExtractorRegistry) GetExtractor(mimeType string) ContentExtractor {
	for _, ext := range r.extractors {
		if ext.Supports(mimeType) {
			return ext
		}
	}
	return nil // No support
}

// TextExtractor handles txt, md, csv, json
type TextExtractor struct{}

func (e *TextExtractor) Supports(mimeType string) bool {
	return strings.HasPrefix(mimeType, "text/") || mimeType == "application/json"
}

func (e *TextExtractor) Extract(ctx context.Context, assetID, filename, mimeType string, reader io.Reader) (*domain.Document, error) {
	scanner := bufio.NewScanner(reader)
	var blocks []domain.Block
	var fullText bytes.Buffer

	charCount := 0
	wordCount := 0
	seq := 0

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)
		
		if trimmed == "" {
			continue
		}

		fullText.WriteString(line + "\n")
		charCount += len(line)
		words := strings.Fields(line)
		wordCount += len(words)

		bType := domain.BlockTypeParagraph
		if strings.HasPrefix(trimmed, "#") {
			bType = domain.BlockTypeHeading
		} else if strings.HasPrefix(trimmed, "- ") || strings.HasPrefix(trimmed, "* ") {
			bType = domain.BlockTypeList
		}

		blocks = append(blocks, domain.Block{
			BlockID:       "blk_" + generateHash(line)[:12], // Dummy ID generator for now
			BlockType:     bType,
			Content:       trimmed,
			SequenceOrder: seq,
		})
		seq++
	}

	hashStr := generateHash(fullText.String())

	doc := &domain.Document{
		DocumentID:         "doc_" + hashStr[:12],
		AssetID:            assetID,
		Extractor:          "TextExtractor",
		ExtractorVersion:   "1.0.0",
		Language:           "en", // basic stub
		Encoding:           "UTF-8",
		WordCount:          wordCount,
		CharCount:          charCount,
		ReadingTimeSeconds: (wordCount / 200) * 60, // avg 200 wpm
		ContentHash:        hashStr,
		ExtractedAt:        time.Now(),
		UpdatedAt:          time.Now(),
		Blocks:             blocks,
	}

	return doc, nil
}

// StubDocumentExtractor for PDFs and Office docs
type StubDocumentExtractor struct{}

func (e *StubDocumentExtractor) Supports(mimeType string) bool {
	return mimeType == "application/pdf" || 
		strings.Contains(mimeType, "officedocument.wordprocessingml") ||
		strings.Contains(mimeType, "officedocument.presentationml")
}

func (e *StubDocumentExtractor) Extract(ctx context.Context, assetID, filename, mimeType string, reader io.Reader) (*domain.Document, error) {
	// Stub parsing since CGO libraries aren't linked
	blocks := []domain.Block{
		{
			BlockID:       "blk_stub_heading",
			BlockType:     domain.BlockTypeHeading,
			Content:       "Stub: Extracted Document Heading",
			SequenceOrder: 0,
		},
		{
			BlockID:       "blk_stub_p",
			BlockType:     domain.BlockTypeParagraph,
			Content:       "This is a stub extraction for complex formats. C-libraries needed for deep extraction.",
			SequenceOrder: 1,
		},
	}

	doc := &domain.Document{
		DocumentID:         "doc_stub_" + assetID[:8],
		AssetID:            assetID,
		Extractor:          "StubDocumentExtractor",
		ExtractorVersion:   "0.1.0",
		WordCount:          18,
		CharCount:          95,
		ReadingTimeSeconds: 5,
		ContentHash:        generateHash("stub"),
		ExtractedAt:        time.Now(),
		UpdatedAt:          time.Now(),
		Blocks:             blocks,
	}

	return doc, nil
}

func generateHash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}
