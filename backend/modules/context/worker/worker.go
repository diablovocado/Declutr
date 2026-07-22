package worker

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/context/application"
	processingDomain "github.com/diablovocado/declutr/modules/processing/domain"
)

type ContextWorker struct {
	service application.ContextService
}

func NewContextWorker(service application.ContextService) *ContextWorker {
	return &ContextWorker{service: service}
}

func (w *ContextWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypeContextDetection && job.JobType != processingDomain.TypeIntentAnalysis {
		log.Printf("ContextWorker ignoring non-context job type: %s", job.JobType)
		return nil
	}

	vaultID := job.VaultID
	if vaultID == "" {
		vaultID = "v_default"
	}

	log.Printf("Starting Context & Intent Engine processing for asset %s in vault %s", job.AssetID, vaultID)

	err := w.service.PredictIntentAndContext(ctx, vaultID, job.AssetID)
	if err != nil {
		log.Printf("Failed to process context & intent for asset %s: %v", job.AssetID, err)
		return err
	}

	log.Printf("Successfully completed Context & Intent Engine processing for asset %s", job.AssetID)
	return nil
}
