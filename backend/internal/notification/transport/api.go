package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/internal/notification/application"
	"github.com/diablovocado/declutr/internal/notification/domain"
)

// NotificationAPI handles HTTP endpoints for the Notification Center & Proactive Intelligence
type NotificationAPI struct {
	service *application.NotificationService
}

// NewNotificationAPI creates a new NotificationAPI instance
func NewNotificationAPI(service *application.NotificationService) *NotificationAPI {
	return &NotificationAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// ListNotifications returns notifications for a vault
// GET /api/v1/notifications?vaultId=<id>
func (a *NotificationAPI) ListNotifications(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	list, err := a.service.ListNotifications(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"notifications": list,
		"total":         len(list),
	})
}

// MarkRead handles marking specific notification(s) or all as read
// POST /api/v1/notifications/read
func (a *NotificationAPI) MarkRead(w http.ResponseWriter, r *http.Request) {
	var req domain.MarkReadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.MarkRead(req.VaultID, req.NotificationIDs); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "notifications marked as read"})
}

// DismissNotification handles dismissing a notification
// POST /api/v1/notifications/dismiss?notificationId=<id>
func (a *NotificationAPI) DismissNotification(w http.ResponseWriter, r *http.Request) {
	nID := r.URL.Query().Get("notificationId")
	if nID == "" {
		errJSON(w, http.StatusBadRequest, "notificationId is required")
		return
	}
	if err := a.service.DismissNotification(nID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "notification dismissed", "notificationId": nID})
}

// ExecuteAction handles performing an action on a notification
// POST /api/v1/notifications/action
func (a *NotificationAPI) ExecuteAction(w http.ResponseWriter, r *http.Request) {
	var req domain.ActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.NotificationID == "" {
		errJSON(w, http.StatusBadRequest, "notificationId is required")
		return
	}
	if err := a.service.ExecuteAction(req.NotificationID, req.ActionType); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":         "action executed",
		"notificationId": req.NotificationID,
		"actionType":     req.ActionType,
	})
}

// GetDigests returns generated digest reports for a vault
// GET /api/v1/notifications/digests?vaultId=<id>
func (a *NotificationAPI) GetDigests(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	digests, err := a.service.GetDigests(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"digests": digests, "total": len(digests)})
}

// GetPreferences returns user notification preferences
// GET /api/v1/notifications/preferences?vaultId=<id>
func (a *NotificationAPI) GetPreferences(w http.ResponseWriter, r *http.Request) {
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

// UpdatePreferences updates user notification preferences
// PUT /api/v1/notifications/preferences
func (a *NotificationAPI) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	var prefs domain.NotificationPreferences
	if err := json.NewDecoder(r.Body).Decode(&prefs); err != nil || prefs.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "invalid request body, missing vaultId")
		return
	}
	if err := a.service.UpdatePreferences(&prefs); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "preferences updated"})
}

// GetStats returns vault notification metrics
// GET /api/v1/notifications/stats?vaultId=<id>
func (a *NotificationAPI) GetStats(w http.ResponseWriter, r *http.Request) {
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
