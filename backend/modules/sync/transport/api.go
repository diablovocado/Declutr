package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/sync/application"
	"github.com/diablovocado/declutr/modules/sync/domain"
)

// SyncAPI handles HTTP endpoints for Offline-First Sync Engine & Conflict Resolution
type SyncAPI struct {
	service *application.SyncService
}

// NewSyncAPI creates a new SyncAPI instance
func NewSyncAPI(service *application.SyncService) *SyncAPI {
	return &SyncAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// PushChanges receives batch of local mutation events from device
// POST /api/v1/sync/push
func (a *SyncAPI) PushChanges(w http.ResponseWriter, r *http.Request) {
	var req domain.PushChangesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.DeviceID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and deviceId are required")
		return
	}
	count, conflicts, err := a.service.PushChanges(r.Context(), &req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"processed": count,
		"conflicts": conflicts,
		"status":    "pushed successfully",
	})
}

// PullChanges returns remote server change events since checkpoint
// POST /api/v1/sync/pull
func (a *SyncAPI) PullChanges(w http.ResponseWriter, r *http.Request) {
	var req domain.PullChangesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.DeviceID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and deviceId are required")
		return
	}
	events, newSeq, err := a.service.PullChanges(&req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"events":      events,
		"newSequence": newSeq,
		"total":       len(events),
	})
}

// ListConflicts returns unresolved sync conflicts
// GET /api/v1/sync/conflicts?vaultId=<id>
func (a *SyncAPI) ListConflicts(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	conflicts, err := a.service.ListConflicts(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"conflicts": conflicts, "total": len(conflicts)})
}

// ResolveConflict resolves a sync conflict
// POST /api/v1/sync/resolve
func (a *SyncAPI) ResolveConflict(w http.ResponseWriter, r *http.Request) {
	var req domain.ResolveConflictRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ConflictID == "" {
		errJSON(w, http.StatusBadRequest, "conflictId is required")
		return
	}
	resolved, err := a.service.ResolveConflict(&req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, resolved)
}

// RegisterDevice updates device connection state & checkpoints
// POST /api/v1/sync/register-device
func (a *SyncAPI) RegisterDevice(w http.ResponseWriter, r *http.Request) {
	var req domain.RegisterDeviceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.DeviceID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and deviceId are required")
		return
	}
	st, err := a.service.RegisterDevice(&req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, st)
}

// GetStatus returns current queue & device sync status
// GET /api/v1/sync/status?vaultId=<id>&deviceId=<id>
func (a *SyncAPI) GetStatus(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	queue, _ := a.service.ListQueue(vaultID, domain.QueueQueued)
	conflicts, _ := a.service.ListConflicts(vaultID)

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"vaultId":          vaultID,
		"pendingQueue":     len(queue),
		"activeConflicts":  len(conflicts),
		"status":           "ONLINE",
		"syncProtocolVer": "v1.0",
	})
}

// GetStats returns vault sync engine metrics
// GET /api/v1/sync/stats?vaultId=<id>
func (a *SyncAPI) GetStats(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	stats, err := a.service.GetStats(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, stats)
}
