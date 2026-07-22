package worker

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/memory/application"
	"github.com/diablovocado/declutr/modules/memory/domain"
	processingDomain "github.com/diablovocado/declutr/modules/processing/domain"
)

// MemoryWorker processes MEMORY_FORMATION jobs from the pipeline.
// The Memory Engine sits at the top of the pipeline:
//
//	Context Engine → Persona Engine → Memory Formation → Knowledge Memory
type MemoryWorker struct {
	engine  *application.MemoryEngine
	service *application.MemoryService
}

// NewMemoryWorker creates a new MemoryWorker
func NewMemoryWorker(engine *application.MemoryEngine, service *application.MemoryService) *MemoryWorker {
	return &MemoryWorker{engine: engine, service: service}
}

// ProcessJob handles MEMORY_FORMATION jobs.
// It forms a new memory from the asset that just completed the full pipeline.
func (w *MemoryWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypeMemoryFormation {
		log.Printf("[MemoryWorker] Ignoring non-memory job type: %s", job.JobType)
		return nil
	}

	vaultID := job.VaultID
	if vaultID == "" {
		vaultID = "v_default"
	}

	log.Printf("[MemoryWorker] Forming memory for asset %s in vault %s", job.AssetID, vaultID)

	// Form a new working memory from this asset having completed the pipeline
	if job.AssetID != "" {
		req := &domain.MemoryFormationRequest{
			VaultID:    vaultID,
			Title:      "Asset Processed: " + job.AssetID,
			Summary:    "Memory formed after full pipeline completion (metadata → entities → relationships → context → persona)",
			MemoryType: domain.MemoryTypeWorking,
			Sources: []domain.MemorySourceInput{
				{SourceType: domain.SourceAsset, SourceRefID: job.AssetID, Weight: 1.0},
			},
			Importance: 0.6,
			Confidence: 0.75,
		}
		if _, err := w.service.FormMemory(req); err != nil {
			log.Printf("[MemoryWorker] Memory formation failed for asset %s: %v", job.AssetID, err)
			return err
		}
	}

	// Run the incremental vault cycle (decay + consolidation)
	if err := w.engine.ProcessVault(vaultID); err != nil {
		log.Printf("[MemoryWorker] Engine cycle failed for vault %s: %v", vaultID, err)
		return err
	}

	log.Printf("[MemoryWorker] Memory cycle complete for vault %s", vaultID)
	return nil
}
