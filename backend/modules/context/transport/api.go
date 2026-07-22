package transport

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/diablovocado/declutr/modules/context/application"
)

type API struct {
	service application.ContextService
}

func NewAPI(service application.ContextService) *API {
	return &API{service: service}
}

// GetContextsHandler handles GET /api/v1/context
func (a *API) GetContextsHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	contextType := r.URL.Query().Get("type")
	status := r.URL.Query().Get("status")

	contexts, err := a.service.GetContexts(r.Context(), vaultID, contextType, status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contexts)
}

// GetContextDetailHandler handles GET /api/v1/context/details or GET /api/v1/context/:id
func (a *API) GetContextDetailHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	contextID := r.URL.Query().Get("contextId")
	if contextID == "" {
		// Extract from path if formatted /api/v1/context/{id}
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) > 0 {
			contextID = parts[len(parts)-1]
		}
	}

	detail, err := a.service.GetContextDetail(r.Context(), vaultID, contextID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(detail)
}

// RefreshContextHandler handles POST /api/v1/context/refresh or POST /api/v1/context/:id/refresh
func (a *API) RefreshContextHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	contextID := r.URL.Query().Get("contextId")
	if contextID == "" {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) >= 2 && parts[len(parts)-1] == "refresh" {
			contextID = parts[len(parts)-2]
		}
	}

	err := a.service.RefreshContext(r.Context(), vaultID, contextID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"status": "refreshed", "contextId": contextID})
}

// GetIntentHandler handles GET /api/v1/context/intent
func (a *API) GetIntentHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	assetID := r.URL.Query().Get("assetId")

	intent, err := a.service.GetIntentForAsset(r.Context(), vaultID, assetID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(intent)
}

// GetStatsHandler handles GET /api/v1/context/stats
func (a *API) GetStatsHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")

	stats, err := a.service.GetContextStats(r.Context(), vaultID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
