package transport

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/diablovocado/declutr/modules/integrations/application"
	"github.com/diablovocado/declutr/modules/integrations/domain"
)

// IntegrationAPI handles HTTP endpoints for Integration Platform & Connector Framework
type IntegrationAPI struct {
	service *application.IntegrationService
}

// NewIntegrationAPI creates a new IntegrationAPI instance
func NewIntegrationAPI(service *application.IntegrationService) *IntegrationAPI {
	return &IntegrationAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// ListIntegrations returns marketplace and installed connectors
// GET /api/v1/integrations?vaultId=<id>
func (a *IntegrationAPI) ListIntegrations(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	marketplace, _ := a.service.ListMarketplace()
	installed, err := a.service.ListConnectors(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"marketplace": marketplace,
		"installed":   installed,
	})
}

// InstallConnector installs a connector from marketplace
// POST /api/v1/integrations/install
func (a *IntegrationAPI) InstallConnector(w http.ResponseWriter, r *http.Request) {
	var req domain.InstallConnectorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.VaultID == "" || req.TypeKey == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and typeKey are required")
		return
	}
	conn, err := a.service.InstallConnector(r.Context(), &req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, conn)
}

// ConfigureConnector updates settings and auth credentials
// POST /api/v1/integrations/configure
func (a *IntegrationAPI) ConfigureConnector(w http.ResponseWriter, r *http.Request) {
	var req domain.ConfigureConnectorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ConnectorID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId is required")
		return
	}
	if err := a.service.ConfigureConnector(r.Context(), &req); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "configured and connected"})
}

// ToggleConnector enables or disables connector
// POST /api/v1/integrations/enable
func (a *IntegrationAPI) ToggleConnector(w http.ResponseWriter, r *http.Request) {
	var req domain.ToggleConnectorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ConnectorID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId is required")
		return
	}
	if err := a.service.ToggleConnector(&req); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"status": "toggled", "connectorId": req.ConnectorID, "isEnabled": req.Enable})
}

// TriggerSync initiates sync/import job
// POST /api/v1/integrations/sync
func (a *IntegrationAPI) TriggerSync(w http.ResponseWriter, r *http.Request) {
	var req domain.TriggerSyncRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ConnectorID == "" || req.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId and vaultId are required")
		return
	}
	job, err := a.service.TriggerSync(r.Context(), &req)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, job)
}

// GetStatus returns health probe result
// GET /api/v1/integrations/status?connectorId=<id>
func (a *IntegrationAPI) GetStatus(w http.ResponseWriter, r *http.Request) {
	connectorID := r.URL.Query().Get("connectorId")
	if connectorID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId is required")
		return
	}
	health, err := a.service.CheckHealth(r.Context(), connectorID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, health)
}

// GetLogs returns execution logs
// GET /api/v1/integrations/logs?connectorId=<id>&limit=20
func (a *IntegrationAPI) GetLogs(w http.ResponseWriter, r *http.Request) {
	connectorID := r.URL.Query().Get("connectorId")
	if connectorID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId is required")
		return
	}
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	logs, err := a.service.GetLogs(connectorID, limit)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"logs": logs, "total": len(logs)})
}

// ProcessWebhook receives inbound webhook payload
// POST /api/v1/integrations/webhooks
func (a *IntegrationAPI) ProcessWebhook(w http.ResponseWriter, r *http.Request) {
	var payload domain.WebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.ConnectorID == "" {
		errJSON(w, http.StatusBadRequest, "connectorId is required")
		return
	}
	if err := a.service.ProcessWebhook(r.Context(), &payload); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "webhook accepted"})
}
