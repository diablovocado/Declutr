package application

import (
	"context"

	"github.com/diablovocado/declutr/modules/processing/domain"
	"github.com/diablovocado/declutr/modules/processing/repository"
)

type ProcessingService interface {
	ListJobs(ctx context.Context, limit int, offset int) ([]*domain.Job, error)
	GetJob(ctx context.Context, jobID string) (*domain.Job, error)
	CancelJob(ctx context.Context, jobID string) error
	RetryJob(ctx context.Context, jobID string) error
	GetStatistics(ctx context.Context) (map[string]interface{}, error)
}

type DefaultProcessingService struct {
	repo      repository.ProcessingRepository
	scheduler JobScheduler
}

func NewProcessingService(repo repository.ProcessingRepository, scheduler JobScheduler) *DefaultProcessingService {
	return &DefaultProcessingService{repo: repo, scheduler: scheduler}
}

func (s *DefaultProcessingService) ListJobs(ctx context.Context, limit int, offset int) ([]*domain.Job, error) {
	return s.repo.ListJobs(ctx, limit, offset)
}

func (s *DefaultProcessingService) GetJob(ctx context.Context, jobID string) (*domain.Job, error) {
	return s.repo.GetJob(ctx, jobID)
}

func (s *DefaultProcessingService) CancelJob(ctx context.Context, jobID string) error {
	return s.scheduler.CancelJob(ctx, jobID)
}

func (s *DefaultProcessingService) RetryJob(ctx context.Context, jobID string) error {
	job, err := s.repo.GetJob(ctx, jobID)
	if err != nil {
		return err
	}
	// Re-schedule manually or adjust retries
	return s.repo.UpdateJobStatus(ctx, job.JobID, domain.StatusQueued, "", "")
}

func (s *DefaultProcessingService) GetStatistics(ctx context.Context) (map[string]interface{}, error) {
	// Dummy stats for orchestration layer
	return map[string]interface{}{
		"queuedJobs":   5,
		"runningJobs":  2,
		"failedJobs":   0,
		"activeWorkers": 3,
	}, nil
}
