package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/graph/application"
)

type API struct {
	service application.GraphService
}

func NewAPI(service application.GraphService) *API {
	return &API{service: service}
}

func (a *API) GetRelationshipsHandler(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	nodeID := r.URL.Query().Get("nodeId")

	edges, err := a.service.GetRelationshipsForNode(r.Context(), vaultID, nodeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(edges)
}

func (a *API) RefreshRelationshipsHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"status": "queued"})
}
