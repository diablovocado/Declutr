export type BlockType = 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'caption' | 'link';

export interface ContentBlock {
  blockId: string;
  documentId: string;
  sectionId?: string;
  blockType: BlockType;
  content: string;
  metadata?: Record<string, any>;
  sequenceOrder: number;
}

export interface ContentSection {
  sectionId: string;
  documentId: string;
  parentSectionId?: string;
  title?: string;
  sequenceOrder: number;
  pageNumber?: number;
  blocks?: ContentBlock[];
  subSections?: ContentSection[];
}

export interface ExtractedDocument {
  documentId: string;
  assetId: string;
  extractor: string;
  extractorVersion: string;
  language?: string;
  encoding?: string;
  wordCount: number;
  charCount: number;
  readingTimeSeconds: number;
  contentHash: string;
  extractedAt: string;
  updatedAt: string;
  sections?: ContentSection[];
  blocks?: ContentBlock[];
}

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  extractor: string;
  extractorVersion: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
}

export const ContentService = {
  async getExtractedContent(assetId: string): Promise<ExtractedDocument> {
    // Mock for UI dev
    return {
      documentId: "doc_12345678",
      assetId,
      extractor: "TextExtractor",
      extractorVersion: "1.0.0",
      language: "en",
      encoding: "UTF-8",
      wordCount: 15,
      charCount: 92,
      readingTimeSeconds: 5,
      contentHash: "a1b2c3d4e5...",
      extractedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [
        {
          blockId: "blk_1",
          documentId: "doc_12345678",
          blockType: "heading",
          content: "Project Alpha Requirements",
          sequenceOrder: 0
        },
        {
          blockId: "blk_2",
          documentId: "doc_12345678",
          blockType: "paragraph",
          content: "This document outlines the core technical requirements for the Alpha project.",
          sequenceOrder: 1
        },
        {
          blockId: "blk_3",
          documentId: "doc_12345678",
          blockType: "list",
          content: "- Must be fast\n- Must be secure",
          sequenceOrder: 2
        }
      ]
    };
  },

  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    return [
      {
        versionId: "ver_1",
        documentId,
        extractor: "TextExtractor",
        extractorVersion: "1.0.0",
        status: 'SUCCESS',
        createdAt: new Date().toISOString()
      }
    ];
  },

  async refreshContent(assetId: string): Promise<void> {
    console.log("Triggered content refresh for", assetId);
  }
};
