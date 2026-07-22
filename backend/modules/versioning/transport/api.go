package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/versioning/application"
	"github.com/diablovocado/declutr/modules/versioning/domain"
)

// VersioningAPI handles HTTP endpoints for Version History, Recovery & Time Machine
type VersioningAPI struct {
	service *application.VersioningService
}

// NewVersioningAPI creates a new VersioningAPI instance
func NewVersioningAPI(service *application.VersioningService) *VersioningAPI {
	return &VersioningAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// ListVersions returns versions for a resource or vault
// GET /api/v1/versions?vaultId=<id>&resourceId=<id>
func (a *VersioningAPI) ListVersions(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	resourceID := r.URL.Query().Get("resourceId")

	if vaultID == "" && resourceID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId or resourceId is required")
		return
	}
	versions, err := a.service.ListVersions(vaultID, resourceID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"versions": versions, "total": len(versions)})
}

// CreateSnapshot captures a new version snapshot
// POST /api/v1/versions/snapshot
func (a *VersioningAPI) CreateSnapshot(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateSnapshotRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.ResourceID == "" {
		errJSON(w, http.StatusBadRequest, "invalid request body, missing vaultId or resourceId")
		return
	}
	ver, err := a.service.CreateSnapshot(r.Context(), &req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, ver)
}

// CompareVersions handles comparing two version snapshots and generating a diff
// POST /api/v1/versions/compare
func (a *VersioningAPI) CompareVersions(w http.ResponseWriter, r *http.Request) {
	var req domain.CompareVersionsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.SourceVersionID == "" || req.TargetVersionID == "" {
		errJSON(w, http.StatusBadRequest, "sourceVersionId and targetVersionId are required")
		return
	}
	diff, err := a.service.CompareVersions(req.SourceVersionID, req.TargetVersionID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, diff)
}

// RestoreVersion restores resource state to target version
// POST /api/v1/versions/restore
func (a *VersioningAPI) RestoreVersion(w http.ResponseWriter, r *http.Request) {
	var req domain.RestoreVersionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VersionID == "" {
		errJSON(w, http.StatusBadRequest, "versionId is required")
		return
	}
	restored, err := a.service.RestoreVersion(&req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, restored)
}

// ListRecycleBin returns soft-deleted items
// GET /api/v1/recyclebin?vaultId=<id>
func (a *VersioningAPI) ListRecycleBin(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	items, err := a.service.ListRecycleBin(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"items": items, "total": len(items)})
}

// RestoreRecycleItem handles restoring a soft-deleted item
// POST /api/v1/recyclebin/restore?recycleId=<id>
func (a *VersioningAPI) RestoreRecycleItem(w http.ResponseWriter, r *http.Request) {
	recycleID := r.URL.Query().Get("recycleId")
	if recycleID == "" {
		errJSON(w, http.StatusBadRequest, "recycleId is required")
		return
	}
	if err := a.service.RestoreFromRecycleBin(recycleID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "item restored", "recycleId": recycleID})
}

// PurgeRecycleItem permanently deletes a soft-deleted item
// DELETE /api/v1/recyclebin/purge?recycleId=<id>
func (a *VersioningAPI) PurgeRecycleItem(w http.ResponseWriter, r *http.Request) {
	recycleID := r.URL.Query().Get("recycleId")
	if recycleID == "" {
		errJSON(w, http.StatusBadRequest, "recycleId is required")
		return
	}
	if err := a.service.PurgeRecycleItem(recycleID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "item purged permanently", "recycleId": recycleID})
}

// GetStats returns vault versioning & time machine stats
// GET /api/v1/versions/stats?vaultId=<id>
func (a *VersioningAPI) GetStats(w http.ResponseWriter, r *http.Request) {
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
