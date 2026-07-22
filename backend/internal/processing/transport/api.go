package transport

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/diablovocado/declutr/modules/processing/application"
)

type API struct {
	service application.ProcessingService
}

func NewAPI(service application.ProcessingService) *API {
	return &API{service: service}
}

func (a *API) ListJobsHandler(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	
	limit := 50
	offset := 0
	
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil {
			offset = o
		}
	}

	jobs, err := a.service.ListJobs(r.Context(), limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jobs)
}

func (a *API) GetJobHandler(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Query().Get("id") // In real implementation, extract from chi router context
	
	job, err := a.service.GetJob(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(job)
}

func (a *API) CancelJobHandler(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Query().Get("id")
	
	err := a.service.CancelJob(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *API) RetryJobHandler(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Query().Get("id")
	
	err := a.service.RetryJob(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *API) GetStatsHandler(w http.ResponseWriter, r *http.Request) {
	stats, err := a.service.GetStatistics(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
