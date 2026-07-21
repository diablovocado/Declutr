package domain

import (
	"time"
)

type BlockType string

const (
	BlockTypeHeading   BlockType = "heading"
	BlockTypeParagraph BlockType = "paragraph"
	BlockTypeList      BlockType = "list"
	BlockTypeCode      BlockType = "code"
	BlockTypeTable     BlockType = "table"
	BlockTypeCaption   BlockType = "caption"
	BlockTypeLink      BlockType = "link"
)

type Document struct {
	DocumentID           string     `json:"documentId"`
	AssetID              string     `json:"assetId"`
	Extractor            string     `json:"extractor"`
	ExtractorVersion     string     `json:"extractorVersion"`
	Language             string     `json:"language,omitempty"`
	Encoding             string     `json:"encoding,omitempty"`
	WordCount            int        `json:"wordCount"`
	CharCount            int        `json:"charCount"`
	ReadingTimeSeconds   int        `json:"readingTimeSeconds"`
	ContentHash          string     `json:"contentHash,omitempty"`
	ExtractedAt          time.Time  `json:"extractedAt"`
	UpdatedAt            time.Time  `json:"updatedAt"`

	// Nesting
	Sections []Section `json:"sections,omitempty"`
	Blocks   []Block   `json:"blocks,omitempty"`
}

type Section struct {
	SectionID       string    `json:"sectionId"`
	DocumentID      string    `json:"documentId"`
	ParentSectionID string    `json:"parentSectionId,omitempty"`
	Title           string    `json:"title,omitempty"`
	SequenceOrder   int       `json:"sequenceOrder"`
	PageNumber      *int      `json:"pageNumber,omitempty"`
	Blocks          []Block   `json:"blocks,omitempty"`
	SubSections     []Section `json:"subSections,omitempty"`
}

type Block struct {
	BlockID       string                 `json:"blockId"`
	DocumentID    string                 `json:"documentId"`
	SectionID     string                 `json:"sectionId,omitempty"`
	BlockType     BlockType              `json:"blockType"`
	Content       string                 `json:"content"`
	Metadata      map[string]interface{} `json:"metadata,omitempty"`
	SequenceOrder int                    `json:"sequenceOrder"`
}

type DocumentVersion struct {
	VersionID        string    `json:"versionId"`
	DocumentID       string    `json:"documentId"`
	Extractor        string    `json:"extractor"`
	ExtractorVersion string    `json:"extractorVersion"`
	Status           string    `json:"status"` // 'SUCCESS', 'FAILED'
	ErrorMessage     string    `json:"errorMessage,omitempty"`
	CreatedAt        time.Time `json:"createdAt"`
}
