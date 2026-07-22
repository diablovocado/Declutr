package application

import (
	"context"
	"fmt"
	"time"

	"github.com/diablovocado/declutr/modules/processing/domain"
	"github.com/diablovocado/declutr/modules/processing/repository"
)

type WorkerManager interface {
	RegisterWorker(ctx context.Context, capabilities []domain.JobType) (*domain.Worker, error)
	DeregisterWorker(ctx context.Context, workerID string) error
	Heartbeat(ctx context.Context, workerID string) error
	GetAvailableWorkerForJob(ctx context.Context, jobType domain.JobType) (*domain.Worker, error)
	MarkWorkerBusy(ctx context.Context, workerID string) error
	MarkWorkerIdle(ctx context.Context, workerID string) error
}

type DefaultWorkerManager struct {
	repo repository.ProcessingRepository
}

func NewWorkerManager(repo repository.ProcessingRepository) *DefaultWorkerManager {
	return &DefaultWorkerManager{repo: repo}
}

func (w *DefaultWorkerManager) RegisterWorker(ctx context.Context, capabilities []domain.JobType) (*domain.Worker, error) {
	worker := &domain.Worker{
		WorkerID:      "wrk_" + fmt.Sprintf("%d", time.Now().UnixNano()),
		NodeID:        "node-local",
		Capabilities:  capabilities,
		Status:        domain.WorkerStatusIdle,
		LastHeartbeat: time.Now(),
		CreatedAt:     time.Now(),
	}
	if err := w.repo.RegisterWorker(ctx, worker); err != nil {
		return nil, err
	}
	return worker, nil
}

func (w *DefaultWorkerManager) DeregisterWorker(ctx context.Context, workerID string) error {
	return w.repo.UpdateWorkerStatus(ctx, workerID, domain.WorkerStatusOffline)
}

func (w *DefaultWorkerManager) Heartbeat(ctx context.Context, workerID string) error {
	return w.repo.UpdateWorkerHeartbeat(ctx, workerID)
}

func (w *DefaultWorkerManager) GetAvailableWorkerForJob(ctx context.Context, jobType domain.JobType) (*domain.Worker, error) {
	workers, err := w.repo.GetActiveWorkers(ctx)
	if err != nil {
		return nil, err
	}

	for _, worker := range workers {
		if worker.Status == domain.WorkerStatusIdle {
			for _, cap := range worker.Capabilities {
				if cap == jobType {
					return worker, nil
				}
			}
		}
	}
	return nil, nil // No worker available
}

func (w *DefaultWorkerManager) MarkWorkerBusy(ctx context.Context, workerID string) error {
	return w.repo.UpdateWorkerStatus(ctx, workerID, domain.WorkerStatusBusy)
}

func (w *DefaultWorkerManager) MarkWorkerIdle(ctx context.Context, workerID string) error {
	return w.repo.UpdateWorkerStatus(ctx, workerID, domain.WorkerStatusIdle)
}
