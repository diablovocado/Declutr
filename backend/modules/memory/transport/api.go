package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/memory/application"
	"github.com/diablovocado/declutr/modules/memory/domain"
)

// MemoryAPI handles HTTP requests for the Memory Engine
type MemoryAPI struct {
	service *application.MemoryService
}

// NewMemoryAPI creates a new MemoryAPI
func NewMemoryAPI(service *application.MemoryService) *MemoryAPI {
	return &MemoryAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// GetMemories returns strongest memories for a vault
// GET /api/v1/memory?vaultId=<id>&type=<type>&limit=<n>
func (a *MemoryAPI) GetMemories(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	memType := r.URL.Query().Get("type")
	var memories []*domain.Memory
	var err error

	if memType != "" {
		memories, err = a.service.GetMemoriesByType(vaultID, domain.MemoryType(memType))
	} else {
		memories, err = a.service.GetStrongestMemories(vaultID, 50)
	}
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	if memories == nil {
		memories = []*domain.Memory{}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"memories": memories,
		"total":    len(memories),
	})
}

// GetTimeline returns all memories in chronological order
// GET /api/v1/memory/timeline?vaultId=<id>
func (a *MemoryAPI) GetTimeline(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	memories, err := a.service.GetTimelineMemories(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	if memories == nil {
		memories = []*domain.Memory{}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"timeline": memories,
		"total":    len(memories),
	})
}

// GetMemoryDetail returns the full enriched detail for a memory
// GET /api/v1/memory/detail?memoryId=<id>
func (a *MemoryAPI) GetMemoryDetail(w http.ResponseWriter, r *http.Request) {
	memoryID := r.URL.Query().Get("memoryId")
	if memoryID == "" {
		errJSON(w, http.StatusBadRequest, "memoryId is required")
		return
	}
	detail, err := a.service.GetMemoryDetail(memoryID)
	if err != nil {
		errJSON(w, http.StatusNotFound, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, detail)
}

// RefreshMemory triggers an incremental decay + consolidation cycle for a vault
// POST /api/v1/memory/refresh
func (a *MemoryAPI) RefreshMemory(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID string `json:"vaultId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.ApplyDecay(body.VaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	if err := a.service.ConsolidateMemories(body.VaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "memory refreshed", "vaultId": body.VaultID})
}

// PinMemory marks a memory as pinned, immune to decay
// POST /api/v1/memory/pin
func (a *MemoryAPI) PinMemory(w http.ResponseWriter, r *http.Request) {
	var body struct {
		MemoryID string `json:"memoryId"`
		Reason   string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.MemoryID == "" {
		errJSON(w, http.StatusBadRequest, "memoryId is required")
		return
	}
	if err := a.service.PinMemory(body.MemoryID, body.Reason); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "memory pinned", "memoryId": body.MemoryID})
}

// ArchiveMemory moves a memory to the archived state
// POST /api/v1/memory/archive
func (a *MemoryAPI) ArchiveMemory(w http.ResponseWriter, r *http.Request) {
	var body struct {
		MemoryID string `json:"memoryId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.MemoryID == "" {
		errJSON(w, http.StatusBadRequest, "memoryId is required")
		return
	}
	if err := a.service.ArchiveMemory(body.MemoryID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "memory archived", "memoryId": body.MemoryID})
}

// GetStats returns vault-level memory statistics
// GET /api/v1/memory/stats?vaultId=<id>
func (a *MemoryAPI) GetStats(w http.ResponseWriter, r *http.Request) {
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
	clusters, _ := a.service.GetClusters(vaultID)
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"stats":    stats,
		"clusters": clusters,
	})
}

// ResetMemory removes all memory data for a vault
// POST /api/v1/memory/reset
func (a *MemoryAPI) ResetMemory(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID string `json:"vaultId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.ResetMemoryModel(body.VaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "memory model reset", "vaultId": body.VaultID})
}

// DeleteMemory permanently deletes a single memory
// DELETE /api/v1/memory?memoryId=<id>
func (a *MemoryAPI) DeleteMemory(w http.ResponseWriter, r *http.Request) {
	memoryID := r.URL.Query().Get("memoryId")
	if memoryID == "" {
		errJSON(w, http.StatusBadRequest, "memoryId is required")
		return
	}
	if err := a.service.DeleteMemory(memoryID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "memory deleted", "memoryId": memoryID})
}

// GetSettings returns current memory settings for a vault
// GET /api/v1/memory/settings?vaultId=<id>
func (a *MemoryAPI) GetSettings(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	settings, err := a.service.GetSettings(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, settings)
}

// UpdateSettings updates memory configuration for a vault
// PUT /api/v1/memory/settings
func (a *MemoryAPI) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var settings domain.MemorySettings
	if err := json.NewDecoder(r.Body).Decode(&settings); err != nil {
		errJSON(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if settings.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.UpdateSettings(&settings); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "settings updated"})
}
