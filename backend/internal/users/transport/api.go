package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/modules/persona/application"
	"github.com/diablovocado/declutr/modules/persona/domain"
)

// PersonaAPI handles HTTP requests for the Reverse Persona Engine
type PersonaAPI struct {
	service *application.PersonaService
}

// NewPersonaAPI creates a new PersonaAPI
func NewPersonaAPI(service *application.PersonaService) *PersonaAPI {
	return &PersonaAPI{service: service}
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

// GetPersona returns the current persona profile for a vault
// GET /api/v1/persona?vaultId=<id>
func (a *PersonaAPI) GetPersona(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	profile, err := a.service.GetProfile(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	scores, _ := a.service.GetScores(vaultID)
	interests, _ := a.service.GetInterests(vaultID)
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"profile":   profile,
		"scores":    scores,
		"interests": interests,
	})
}

// GetRecommendations returns the current recommendations for a vault
// GET /api/v1/persona/recommendations?vaultId=<id>
func (a *PersonaAPI) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	recs, err := a.service.GetRecommendations(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"recommendations": recs,
		"total":           len(recs),
	})
}

// UpdateSettings updates the privacy/learning settings for a vault
// PUT /api/v1/persona/settings
func (a *PersonaAPI) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var settings domain.PersonaSettings
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

// GetSettings retrieves current privacy settings for a vault
// GET /api/v1/persona/settings?vaultId=<id>
func (a *PersonaAPI) GetSettings(w http.ResponseWriter, r *http.Request) {
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

// ResetPersona purges all learned persona data for a vault
// POST /api/v1/persona/reset
func (a *PersonaAPI) ResetPersona(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID string `json:"vaultId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.VaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.ResetPersona(body.VaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "persona reset",
		"vaultId": body.VaultID,
	})
}

// ExportPersona returns the full persona data as a JSON export
// GET /api/v1/persona/export?vaultId=<id>
func (a *PersonaAPI) ExportPersona(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	export, err := a.service.ExportPersona(vaultID)
	if err != nil {
		errJSON(w, http.StatusForbidden, err.Error())
		return
	}
	w.Header().Set("Content-Disposition", `attachment; filename="persona_export.json"`)
	writeJSON(w, http.StatusOK, export)
}

// DeletePersona performs a full GDPR-style deletion of all persona data
// DELETE /api/v1/persona?vaultId=<id>
func (a *PersonaAPI) DeletePersona(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	if err := a.service.DeletePersonaData(vaultID); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "all persona data deleted",
		"vaultId": vaultID,
	})
}

// RecordSignal allows the client to post a behaviour signal
// POST /api/v1/persona/signal
func (a *PersonaAPI) RecordSignal(w http.ResponseWriter, r *http.Request) {
	var body struct {
		VaultID    string  `json:"vaultId"`
		SignalType string  `json:"signalType"`
		AssetID    string  `json:"assetId,omitempty"`
		Value      string  `json:"value,omitempty"`
		Weight     float64 `json:"weight,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		errJSON(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if body.VaultID == "" || body.SignalType == "" {
		errJSON(w, http.StatusBadRequest, "vaultId and signalType are required")
		return
	}
	if err := a.service.RecordSignal(
		body.VaultID,
		domain.SignalType(body.SignalType),
		body.AssetID,
		body.Value,
		body.Weight,
	); err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, map[string]string{"status": "signal recorded"})
}

// GetHistory returns the audit history of persona state snapshots
// GET /api/v1/persona/history?vaultId=<id>
func (a *PersonaAPI) GetHistory(w http.ResponseWriter, r *http.Request) {
	vaultID := r.URL.Query().Get("vaultId")
	if vaultID == "" {
		errJSON(w, http.StatusBadRequest, "vaultId is required")
		return
	}
	history, err := a.service.GetHistory(vaultID)
	if err != nil {
		errJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"history": history,
		"total":   len(history),
	})
}
