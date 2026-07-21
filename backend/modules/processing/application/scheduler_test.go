package application

import (
	"context"
	"testing"
	"time"

	"github.com/diablovocado/declutr/modules/processing/domain"
)

// Mock DeadLetterQueue
type MockDLQ struct {
	jobs []*domain.Job
}

func (m *MockDLQ) SendToDLQ(ctx context.Context, job *domain.Job, reason string) error {
	m.jobs = append(m.jobs, job)
	return nil
}

func (m *MockDLQ) ListDLQ(ctx context.Context, limit int, offset int) ([]*domain.Job, error) {
	return m.jobs, nil
}

func (m *MockDLQ) ReplayFromDLQ(ctx context.Context, jobID string) error {
	return nil
}

// Mock Repository
type MockRepo struct {
	jobs map[string]*domain.Job
}

func (m *MockRepo) CreateJob(ctx context.Context, job *domain.Job) error {
	m.jobs[job.JobID] = job
	return nil
}

func (m *MockRepo) GetJob(ctx context.Context, jobID string) (*domain.Job, error) {
	return m.jobs[jobID], nil
}

func (m *MockRepo) UpdateJobStatus(ctx context.Context, jobID string, status domain.JobStatus, workerID string, reason string) error {
	if job, ok := m.jobs[jobID]; ok {
		job.Status = status
		job.FailureReason = reason
	}
	return nil
}

func (m *MockRepo) UpdateJobRetries(ctx context.Context, jobID string, retries int) error {
	if job, ok := m.jobs[jobID]; ok {
		job.RetryCount = retries
	}
	return nil
}

func (m *MockRepo) ListJobs(ctx context.Context, limit int, offset int) ([]*domain.Job, error) {
	return nil, nil
}
func (m *MockRepo) GetJobsByStatus(ctx context.Context, status domain.JobStatus) ([]*domain.Job, error) { return nil, nil }
func (m *MockRepo) RegisterWorker(ctx context.Context, worker *domain.Worker) error { return nil }
func (m *MockRepo) UpdateWorkerHeartbeat(ctx context.Context, workerID string) error { return nil }
func (m *MockRepo) UpdateWorkerStatus(ctx context.Context, workerID string, status domain.WorkerStatus) error { return nil }
func (m *MockRepo) GetActiveWorkers(ctx context.Context) ([]*domain.Worker, error) { return nil, nil }
func (m *MockRepo) RecordEvent(ctx context.Context, event *domain.Event) error { return nil }
func (m *MockRepo) GetEventsForJob(ctx context.Context, jobID string) ([]*domain.Event, error) { return nil, nil }
func (m *MockRepo) RecordAttempt(ctx context.Context, attempt *domain.JobAttempt) error { return nil }

func TestRetryManager_HandleFailure(t *testing.T) {
	repo := &MockRepo{jobs: make(map[string]*domain.Job)}
	dlq := &MockDLQ{}
	retryManager := NewRetryManager(repo, dlq)

	job := &domain.Job{
		JobID:      "job_test_1",
		RetryCount: 0,
		MaxRetries: 3,
		Status:     domain.StatusRunning,
	}
	repo.jobs[job.JobID] = job

	// 1st Failure
	retryManager.HandleFailure(context.Background(), job, "Connection timeout")
	if job.RetryCount != 1 {
		t.Errorf("Expected retry count 1, got %d", job.RetryCount)
	}
	if job.Status != domain.StatusRetrying {
		t.Errorf("Expected status RETRYING, got %s", job.Status)
	}

	// Calculate backoff
	backoff := retryManager.CalculateBackoff(1)
	expectedBackoff := 10 * time.Second // 2^1 * 5s = 10s
	if backoff != expectedBackoff {
		t.Errorf("Expected backoff %v, got %v", expectedBackoff, backoff)
	}

	// 2nd Failure
	retryManager.HandleFailure(context.Background(), job, "Connection timeout")
	if job.RetryCount != 2 {
		t.Errorf("Expected retry count 2, got %d", job.RetryCount)
	}

	// 3rd Failure (Reaches max retries)
	retryManager.HandleFailure(context.Background(), job, "Connection timeout")
	
	// 4th Failure (Should go to DLQ)
	retryManager.HandleFailure(context.Background(), job, "Fatal error")

	if job.Status != domain.StatusFailed {
		t.Errorf("Expected status FAILED, got %s", job.Status)
	}

	if len(dlq.jobs) != 1 {
		t.Errorf("Expected job to be sent to DLQ")
	}
}
