package worker

import (
	"context"
	"log"
	"strings"

	"github.com/diablovocado/declutr/modules/extraction/application"
	processingDomain "github.com/diablovocado/declutr/modules/processing/domain"
)

type ContentExtractionWorker struct {
	service application.ContentService
}

func NewContentExtractionWorker(service application.ContentService) *ContentExtractionWorker {
	return &ContentExtractionWorker{
		service: service,
	}
}

func (w *ContentExtractionWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypeContentExtraction {
		log.Printf("Worker ignores non-extraction job: %s", job.JobType)
		return nil
	}

	// 1. Fetch asset record from DB to get filename and mime-type
	// For stub, using dummy values
	filename := "notes.md"
	mimeType := "text/markdown"

	// 2. Open stream to asset in blob storage
	var reader = strings.NewReader("# Project Notes\n\n- Task A\n- Task B")

	// 3. Extract and save content
	_, err := w.service.ExtractAndSaveContent(
		ctx,
		job.AssetID,
		filename,
		mimeType,
		reader,
	)

	if err != nil {
		log.Printf("Failed to extract content for asset %s: %v", job.AssetID, err)
		return err
	}

	log.Printf("Successfully extracted normalized content for asset %s", job.AssetID)
	return nil
}
