package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/extraction/application"
)

type API struct {
	service application.ContentService
}

func NewAPI(service application.ContentService) *API {
	return &API{service: service}
}

func (a *API) GetContentHandler(w http.ResponseWriter, r *http.Request) {
	assetID := r.URL.Query().Get("assetId")

	doc, err := a.service.GetDocument(r.Context(), assetID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if doc == nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doc)
}

func (a *API) GetVersionHistoryHandler(w http.ResponseWriter, r *http.Request) {
	docID := r.URL.Query().Get("documentId")

	history, err := a.service.GetVersionHistory(r.Context(), docID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

func (a *API) RefreshContentHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"status": "queued"})
}
