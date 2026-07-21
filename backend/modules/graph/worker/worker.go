package worker

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/graph/application"
	processingDomain "github.com/diablovocado/declutr/modules/processing/domain"
)

type GraphDiscoveryWorker struct {
	service application.GraphService
}

func NewGraphDiscoveryWorker(service application.GraphService) *GraphDiscoveryWorker {
	return &GraphDiscoveryWorker{
		service: service,
	}
}

func (w *GraphDiscoveryWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypeRelationshipDiscovery {
		log.Printf("Worker ignores non-graph job: %s", job.JobType)
		return nil
	}

	vaultID := "v_123" // Mock vault lookup

	err := w.service.DiscoverAndStoreRelationships(ctx, vaultID, job.AssetID)
	if err != nil {
		log.Printf("Failed to run relationship discovery for asset %s: %v", job.AssetID, err)
		return err
	}

	log.Printf("Successfully completed relationship discovery for asset %s", job.AssetID)
	return nil
}
