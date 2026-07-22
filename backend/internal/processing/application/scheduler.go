package application

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/diablovocado/declutr/internal/processing/domain"
	"github.com/diablovocado/declutr/internal/processing/repository"
)

type JobScheduler interface {
	ScheduleJob(ctx context.Context, assetID string, vaultID string, jobType domain.JobType, priority int) (*domain.Job, error)
	CancelJob(ctx context.Context, jobID string) error
}

type RetryManager interface {
	HandleFailure(ctx context.Context, job *domain.Job, reason string) error
	CalculateBackoff(retryCount int) time.Duration
}

type DefaultScheduler struct {
	repo  repository.ProcessingRepository
	queue Queue
}

func NewJobScheduler(repo repository.ProcessingRepository, queue Queue) *DefaultScheduler {
	return &DefaultScheduler{repo: repo, queue: queue}
}

func (s *DefaultScheduler) ScheduleJob(ctx context.Context, assetID string, vaultID string, jobType domain.JobType, priority int) (*domain.Job, error) {
	job := &domain.Job{
		JobID:      "job_" + fmt.Sprintf("%d", time.Now().UnixNano()),
		AssetID:    assetID,
		VaultID:    vaultID,
		JobType:    jobType,
		Status:     domain.StatusQueued,
		Priority:   priority,
		RetryCount: 0,
		MaxRetries: 3,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := s.repo.CreateJob(ctx, job); err != nil {
		return nil, err
	}

	if err := s.queue.Enqueue(ctx, job); err != nil {
		return nil, err
	}

	return job, nil
}

func (s *DefaultScheduler) CancelJob(ctx context.Context, jobID string) error {
	return s.repo.UpdateJobStatus(ctx, jobID, domain.StatusCancelled, "", "Cancelled by user")
}

type DefaultRetryManager struct {
	repo repository.ProcessingRepository
	dlq  DeadLetterQueue
}

func NewRetryManager(repo repository.ProcessingRepository, dlq DeadLetterQueue) *DefaultRetryManager {
	return &DefaultRetryManager{repo: repo, dlq: dlq}
}

func (r *DefaultRetryManager) HandleFailure(ctx context.Context, job *domain.Job, reason string) error {
	if job.RetryCount >= job.MaxRetries {
		// Exhausted retries, mark as failed and send to DLQ
		if err := r.repo.UpdateJobStatus(ctx, job.JobID, domain.StatusFailed, job.WorkerID, reason); err != nil {
			return err
		}
		return r.dlq.SendToDLQ(ctx, job, reason)
	}

	// Increment retry count and set to RETRYING
	newRetryCount := job.RetryCount + 1
	if err := r.repo.UpdateJobRetries(ctx, job.JobID, newRetryCount); err != nil {
		return err
	}
	
	if err := r.repo.UpdateJobStatus(ctx, job.JobID, domain.StatusRetrying, "", reason); err != nil {
		return err
	}
	
	// The job should theoretically be re-enqueued by the scheduler after the backoff period
	// Real implementation would delay the queue visibility
	return nil
}

func (r *DefaultRetryManager) CalculateBackoff(retryCount int) time.Duration {
	// Exponential backoff: 2^retryCount * 5 seconds
	seconds := math.Pow(2, float64(retryCount)) * 5
	return time.Duration(seconds) * time.Second
}
