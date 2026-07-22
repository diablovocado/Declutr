package application

import (
	"context"
	"fmt"
	"time"

	"github.com/diablovocado/declutr/modules/processing/domain"
	"github.com/diablovocado/declutr/modules/processing/repository"
)

type ProcessingEngine interface {
	Start(ctx context.Context) error
	Stop(ctx context.Context) error
	ProcessAsset(ctx context.Context, assetID string, vaultID string) error
}

type DefaultProcessingEngine struct {
	repo         repository.ProcessingRepository
	queue        Queue
	scheduler    JobScheduler
	workerManager WorkerManager
	retryManager  RetryManager
	dispatchChan chan *domain.Job
	stopChan     chan struct{}
}

func NewProcessingEngine(
	repo repository.ProcessingRepository,
	queue Queue,
	scheduler JobScheduler,
	workerManager WorkerManager,
	retryManager RetryManager,
) *DefaultProcessingEngine {
	return &DefaultProcessingEngine{
		repo:          repo,
		queue:         queue,
		scheduler:     scheduler,
		workerManager: workerManager,
		retryManager:  retryManager,
		dispatchChan:  make(chan *domain.Job, 100),
		stopChan:      make(chan struct{}),
	}
}

func (e *DefaultProcessingEngine) Start(ctx context.Context) error {
	go e.runDispatcher(ctx)
	return nil
}

func (e *DefaultProcessingEngine) Stop(ctx context.Context) error {
	close(e.stopChan)
	return nil
}

func (e *DefaultProcessingEngine) ProcessAsset(ctx context.Context, assetID string, vaultID string) error {
	// 1. Dispatch Metadata Extraction
	_, err := e.scheduler.ScheduleJob(ctx, assetID, vaultID, domain.TypeMetadataExtraction, 1)
	if err != nil {
		return err
	}

	// In a real system, the completion of Metadata would trigger Thumbnail, OCR, etc.
	// For this orchestration layer, we simply enqueue the first step.
	
	e.repo.RecordEvent(ctx, &domain.Event{
		EventID:   "evt_" + fmt.Sprintf("%d", time.Now().UnixNano()),
		AssetID:   assetID,
		EventType: domain.EventAssetUploaded,
		CreatedAt: time.Now(),
	})

	return nil
}

func (e *DefaultProcessingEngine) runDispatcher(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-e.stopChan:
			return
		case <-ticker.C:
			e.pollAndDispatch(ctx)
		}
	}
}

func (e *DefaultProcessingEngine) pollAndDispatch(ctx context.Context) {
	// Attempt to dequeue jobs that workers can process
	// For simplicity, we assume we just dequeue the next available job
	jobTypes := []domain.JobType{
		domain.TypeMetadataExtraction, 
		domain.TypeOCR,
		domain.TypeEntityExtraction,
		domain.TypeRelationship,
		domain.TypeContextDetection,
		domain.TypeIntentAnalysis,
		domain.TypeEmbeddingGen,
	}

	job, err := e.queue.Dequeue(ctx, jobTypes)
	if err != nil || job == nil {
		return
	}

	// Find worker
	worker, err := e.workerManager.GetAvailableWorkerForJob(ctx, job.JobType)
	if err != nil || worker == nil {
		// Reject and requeue
		e.queue.Reject(ctx, job.JobID, true)
		return
	}

	// Mark worker busy, update job status
	e.workerManager.MarkWorkerBusy(ctx, worker.WorkerID)
	e.repo.UpdateJobStatus(ctx, job.JobID, domain.StatusRunning, worker.WorkerID, "")
	
	e.repo.RecordEvent(ctx, &domain.Event{
		EventID:   "evt_" + fmt.Sprintf("%d", time.Now().UnixNano()),
		JobID:     job.JobID,
		AssetID:   job.AssetID,
		EventType: domain.EventProcessingStarted,
		CreatedAt: time.Now(),
	})

	// Dispatch to worker (simulated)
	// After worker completes, it would Acknowledge the job and MarkWorkerIdle
}
