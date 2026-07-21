package repository

import (
	"context"

	"github.com/diablovocado/declutr/modules/processing/domain"
)

type ProcessingRepository interface {
	// Jobs
	CreateJob(ctx context.Context, job *domain.Job) error
	GetJob(ctx context.Context, jobID string) (*domain.Job, error)
	UpdateJobStatus(ctx context.Context, jobID string, status domain.JobStatus, workerID string, failureReason string) error
	UpdateJobRetries(ctx context.Context, jobID string, retryCount int) error
	ListJobs(ctx context.Context, limit int, offset int) ([]*domain.Job, error)
	GetJobsByStatus(ctx context.Context, status domain.JobStatus) ([]*domain.Job, error)
	
	// Workers
	RegisterWorker(ctx context.Context, worker *domain.Worker) error
	UpdateWorkerHeartbeat(ctx context.Context, workerID string) error
	UpdateWorkerStatus(ctx context.Context, workerID string, status domain.WorkerStatus) error
	GetActiveWorkers(ctx context.Context) ([]*domain.Worker, error)
	
	// Events
	RecordEvent(ctx context.Context, event *domain.Event) error
	GetEventsForJob(ctx context.Context, jobID string) ([]*domain.Event, error)
	
	// Attempts
	RecordAttempt(ctx context.Context, attempt *domain.JobAttempt) error
}
