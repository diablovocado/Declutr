package supervisor

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/shared/observability"
)

// WorkerState describes worker execution state.
type WorkerState string

const (
	StateStopped WorkerState = "STOPPED"
	StateRunning WorkerState = "RUNNING"
	StateFailed  WorkerState = "FAILED"
	StateRestart WorkerState = "RESTARTING"
)

// WorkerInfo contains status information about a worker.
type WorkerInfo struct {
	ID          string      `json:"id"`
	Name        string      `json:"name"`
	Type        string      `json:"type"` // QUEUE, WORKFLOW, SYNC, AI, CONNECTOR
	State       WorkerState `json:"state"`
	RestartCount int        `json:"restart_count"`
	LastError   string      `json:"last_error,omitempty"`
	LastActive  time.Time   `json:"last_active"`
	StartedAt   time.Time   `json:"started_at"`
}

// WorkerFunc represents the work routine for a worker.
type WorkerFunc func(ctx context.Context) error

// Supervisor manages worker lifecycle and safe restarts.
type Supervisor struct {
	mu         sync.RWMutex
	workers    map[string]*WorkerInfo
	workerFunc map[string]WorkerFunc
	cancelFunc map[string]context.CancelFunc
	logger     *observability.Logger
}

var globalSupervisor = NewSupervisor()

// NewSupervisor creates a supervisor instance.
func NewSupervisor() *Supervisor {
	return &Supervisor{
		workers:    make(map[string]*WorkerInfo),
		workerFunc: make(map[string]WorkerFunc),
		cancelFunc: make(map[string]context.CancelFunc),
		logger:     observability.GetLogger(),
	}
}

// GetSupervisor returns global supervisor instance.
func GetSupervisor() *Supervisor {
	return globalSupervisor
}

// RegisterWorker registers a background worker under supervisor.
func (s *Supervisor) RegisterWorker(id string, name string, wType string, fn WorkerFunc) {
	s.mu.Lock()
	defer s.mu.Unlock()

	info := &WorkerInfo{
		ID:         id,
		Name:       name,
		Type:       wType,
		State:      StateStopped,
		LastActive: time.Now().UTC(),
	}
	s.workers[id] = info
	s.workerFunc[id] = fn
}

// StartWorker launches a registered worker with panic recovery and auto-restart.
func (s *Supervisor) StartWorker(ctx context.Context, id string) error {
	s.mu.Lock()
	info, exists := s.workers[id]
	fn, fnExists := s.workerFunc[id]
	if !exists || !fnExists {
		s.mu.Unlock()
		return fmt.Errorf("worker %s not registered", id)
	}

	workerCtx, cancel := context.WithCancel(ctx)
	s.cancelFunc[id] = cancel
	info.State = StateRunning
	info.StartedAt = time.Now().UTC()
	s.mu.Unlock()

	s.logger.Info(ctx, fmt.Sprintf("Supervisor launching worker %s (%s)", info.Name, info.Type), map[string]interface{}{"worker_id": id})

	go func() {
		defer func() {
			if r := recover(); r != nil {
				s.handleFailure(ctx, id, fmt.Sprintf("Worker Panic: %v", r))
			}
		}()

		err := fn(workerCtx)
		if err != nil && workerCtx.Err() == nil {
			s.handleFailure(ctx, id, err.Error())
		} else {
			s.mu.Lock()
			info.State = StateStopped
			s.mu.Unlock()
		}
	}()

	return nil
}

func (s *Supervisor) handleFailure(ctx context.Context, id string, errMsg string) {
	s.mu.Lock()
	info, exists := s.workers[id]
	if !exists {
		s.mu.Unlock()
		return
	}

	info.State = StateFailed
	info.LastError = errMsg
	info.RestartCount++
	info.LastActive = time.Now().UTC()
	restartCount := info.RestartCount
	s.mu.Unlock()

	s.logger.Error(ctx, fmt.Sprintf("Worker %s failed: %s. Initiating restart #%d...", info.Name, errMsg, restartCount), "WORKER_FAILED", map[string]interface{}{
		"worker_id":     id,
		"restart_count": restartCount,
	})

	// Exponential backoff before restart (max 10s)
	backoff := time.Duration(restartCount) * time.Second
	if backoff > 10*time.Second {
		backoff = 10 * time.Second
	}
	time.Sleep(backoff)

	s.mu.Lock()
	info.State = StateRestart
	s.mu.Unlock()

	_ = s.StartWorker(ctx, id)
}

// StopWorker safely stops a worker.
func (s *Supervisor) StopWorker(id string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if cancel, exists := s.cancelFunc[id]; exists {
		cancel()
		delete(s.cancelFunc, id)
	}
	if info, exists := s.workers[id]; exists {
		info.State = StateStopped
	}
}

// GetWorkerStatus returns current status of all managed workers.
func (s *Supervisor) GetWorkerStatus() []WorkerInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]WorkerInfo, 0, len(s.workers))
	for _, w := range s.workers {
		result = append(result, *w)
	}
	return result
}
