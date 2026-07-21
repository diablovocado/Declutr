package application

import (
	"context"

	"github.com/diablovocado/declutr/modules/processing/domain"
)

// Queue abstracts the underlying message broker (Redis, RabbitMQ, PostgreSQL Queue, In-Memory)
type Queue interface {
	Enqueue(ctx context.Context, job *domain.Job) error
	Dequeue(ctx context.Context, jobTypes []domain.JobType) (*domain.Job, error)
	Acknowledge(ctx context.Context, jobID string) error
	Reject(ctx context.Context, jobID string, requeue bool) error
	GetQueueDepth(ctx context.Context, jobType domain.JobType) (int, error)
}

// DeadLetterQueue handles jobs that have exhausted all retry attempts
type DeadLetterQueue interface {
	SendToDLQ(ctx context.Context, job *domain.Job, reason string) error
	ListDLQ(ctx context.Context, limit int, offset int) ([]*domain.Job, error)
	ReplayFromDLQ(ctx context.Context, jobID string) error
}
