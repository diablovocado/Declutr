package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/insights/application"
	"github.com/diablovocado/declutr/modules/insights/domain"
)

// InsightsAPI handles HTTP requests for the Knowledge Insights & Timeline Engine
type InsightsAPI struct {
	service *application.InsightsService
}

// NewInsightsAPI creates a new InsightsAPI instance
func NewInsightsAPI(service *application.InsightsService) *InsightsAPI {
	return &InsightsAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// GetTimeline returns chronological timeline events for a vault
// GET /api/v1/insights/timeline?vaultId=<id>&eventType=<type>
func (a *InsightsAPI) GetTimeline(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}

	eventType := r.URL.Query().Get("eventType")
	var filter *domain.TimelineFilter
	if eventType != "" {
		filter = &domain.TimelineFilter{EventType: domain.TimelineEventType(eventType)}
	}

	events, err := a.service.GetTimeline(vaultID, filter)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	groups, _ := a.service.GetTimelineGroups(vaultID)

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"timeline": events,
		"groups":   groups,
		"total":    len(events),
	})
}

// GetInsights returns proactive knowledge insights for a vault
// GET /api/v1/insights?vaultId=<id>
func (a *InsightsAPI) GetInsights(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	insights, err := a.service.GetActiveInsights(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"insights": insights,
		"total":    len(insights),
	})
}

// GetMilestones returns detected milestones for a vault
// GET /api/v1/insights/milestones?vaultId=<id>
func (a *InsightsAPI) GetMilestones(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	milestones, err := a.service.GetMilestones(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"milestones": milestones,
		"total":      len(milestones),
	})
}

// DismissInsight marks a proactive insight as dismissed
// POST /api/v1/insights/dismiss
func (a *InsightsAPI) DismissInsight(w http.ResponseWriter, r *http.Request) {
	var body struct {
		InsightID string `json:"insightId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.InsightID == "" {
		errJSON(w, http.StatusBadRequest, "insightId is required")
		return
	}
	if err := a.service.DismissInsight(body.InsightID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "insight dismissed", "insightId": body.InsightID})
}

// RefreshInsights triggers an incremental intelligence refresh
// POST /api/v1/insights/refresh
func (a *InsightsAPI) RefreshInsights(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID string `json:"vaultId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.RefreshInsights(r.Context(), body.VaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "insights refresh complete", "vaultId": body.VaultID})
}

// GetStats returns vault insights statistics
// GET /api/v1/insights/stats?vaultId=<id>
func (a *InsightsAPI) GetStats(w http.ResponseWriter, r *http.Request) {
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

// GetPreferences returns user insight preferences
// GET /api/v1/insights/preferences?vaultId=<id>
func (a *InsightsAPI) GetPreferences(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	prefs, err := a.service.GetPreferences(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, prefs)
}

// UpdatePreferences updates user insight preferences
// PUT /api/v1/insights/preferences
func (a *InsightsAPI) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	var prefs domain.InsightPreferences
	if err := json.NewDecoder(r.Body).Decode(&prefs); err != nil || prefs.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "invalid request body or missing vaultId")
		return
	}
	if err := a.service.UpdatePreferences(&prefs); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "preferences updated"})
}
