package worker

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/persona/application"
	processingDomain "github.com/diablovocado/declutr/modules/processing/domain"
)

// PersonaWorker processes persona learning jobs from the pipeline
type PersonaWorker struct {
	engine *application.PersonaEngine
	service *application.PersonaService
}

// NewPersonaWorker creates a new PersonaWorker
func NewPersonaWorker(engine *application.PersonaEngine, service *application.PersonaService) *PersonaWorker {
	return &PersonaWorker{engine: engine, service: service}
}

// ProcessJob handles PERSONA_LEARNING jobs.
// It also seeds a behaviour signal representing the asset interaction before running the engine.
func (w *PersonaWorker) ProcessJob(ctx context.Context, job *processingDomain.Job) error {
	if job.JobType != processingDomain.TypePersonaLearning {
		log.Printf("[PersonaWorker] Ignoring non-persona job type: %s", job.JobType)
		return nil
	}

	vaultID := job.VaultID
	if vaultID == "" {
		vaultID = "v_default"
	}

	log.Printf("[PersonaWorker] Processing persona learning for asset %s in vault %s", job.AssetID, vaultID)

	// Seed an ASSET_OPEN signal to represent this processing event
	if job.AssetID != "" {
		_ = w.service.RecordSignal(vaultID, "ASSET_OPEN", job.AssetID, "processing_pipeline", 0.8)
	}

	// Run incremental engine update
	if err := w.engine.ProcessVault(vaultID); err != nil {
		log.Printf("[PersonaWorker] Persona learning failed for vault %s: %v", vaultID, err)
		return err
	}

	log.Printf("[PersonaWorker] Persona learning complete for vault %s", vaultID)
	return nil
}
