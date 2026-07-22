package worker

import (
	"context"
	"log"

	processingDomain "github.com/diablovocado/declutr/internal/processing/domain"
)

type AIAnalysisService interface {
	AnalyzeDocument(ctx context.Context, documentID, assetID, extractedText string) (interface{}, error)
}

type AIAnalysisWorker struct {
	service AIAnalysisService
}

func NewAIAnalysisWorker(service AIAnalysisService) *AIAnalysisWorker {
	return &AIAnalysisWorker{
		service: service,
	}
}

func (w *AIAnalysisWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypeAIAnalysis {
		log.Printf("Worker ignores non-ai job: %s", job.JobType)
		return nil
	}

	// 1. Fetch normalized document text from Extraction Engine (stubbed)
	documentID := "doc_12345"
	extractedText := "This document outlines the Alpha project requirements, including security and performance constraints."

	// 2. Run AI Analysis
	_, err := w.service.AnalyzeDocument(
		ctx,
		documentID,
		job.AssetID,
		extractedText,
	)

	if err != nil {
		log.Printf("Failed to run AI analysis for asset %s: %v", job.AssetID, err)
		return err
	}

	log.Printf("Successfully completed AI analysis for asset %s", job.AssetID)
	return nil
}
