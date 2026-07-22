package transport

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/diablovocado/declutr/pkg/health"
	"github.com/diablovocado/declutr/shared/cache"
	"github.com/diablovocado/declutr/shared/observability"
	"github.com/diablovocado/declutr/shared/supervisor"
)

// AdminAPI provides HTTP endpoints for internal system observability & admin interface.
type AdminAPI struct{}

func NewAdminAPI() *AdminAPI {
	return &AdminAPI{}
}

func (a *AdminAPI) GetSystemStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	h := health.HealthProbe()
	_ = json.NewEncoder(w).Encode(h)
}

func (a *AdminAPI) GetMetrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	metrics := observability.GetMetricsRegistry().Snapshot()
	_ = json.NewEncoder(w).Encode(metrics)
}

func (a *AdminAPI) GetQueuesAndWorkers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	workers := supervisor.GetSupervisor().GetWorkerStatus()
	resp := map[string]interface{}{
		"workers":       workers,
		"active_queues": 5,
		"queue_depth":   observability.GetMetricsRegistry().Snapshot().QueueDepth,
		"timestamp":     time.Now().UTC(),
	}
	_ = json.NewEncoder(w).Encode(resp)
}

func (a *AdminAPI) GetCacheStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	st, _ := cache.GetDefaultCache().Stats(r.Context())
	_ = json.NewEncoder(w).Encode(st)
}

func (a *AdminAPI) GetTraces(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	spans := observability.GetTracer().GetSpans()
	_ = json.NewEncoder(w).Encode(spans)
}
