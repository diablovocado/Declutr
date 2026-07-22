package transport

import (
	"encoding/json"
	"net/http"

	"github.com/diablovocado/declutr/internal/settings/application"
	"github.com/diablovocado/declutr/internal/settings/domain"
)

// ExtensionAPI handles HTTP REST endpoints for extension ecosystem & marketplace.
type ExtensionAPI struct {
	service *application.ExtensionService
}

func NewExtensionAPI(service *application.ExtensionService) *ExtensionAPI {
	return &ExtensionAPI{service: service}
}

func (a *ExtensionAPI) ListMarketplace(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	q := r.URL.Query().Get("q")

	extensions, err := a.service.ListMarketplace(r.Context(), category, q)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(extensions)
}

func (a *ExtensionAPI) GetExtensionDetails(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	ext, err := a.service.GetExtensionDetails(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(ext)
}

func (a *ExtensionAPI) InstallExtension(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ExtensionID         string   `json:"extension_id"`
		ApprovedPermissions []string `json:"approved_permissions"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	inst, err := a.service.InstallExtension(r.Context(), userID, req.ExtensionID, req.ApprovedPermissions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(inst)
}

func (a *ExtensionAPI) ListInstalled(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	installs, err := a.service.ListUserInstallations(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(installs)
}

func (a *ExtensionAPI) ManageLifecycle(w http.ResponseWriter, r *http.Request) {
	var req struct {
		InstallationID string `json:"installation_id"`
		Action         string `json:"action"` // ENABLE, DISABLE, UNINSTALL
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.ChangeLifecycleState(r.Context(), req.InstallationID, req.Action); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *ExtensionAPI) ApprovePermissions(w http.ResponseWriter, r *http.Request) {
	var req struct {
		InstallationID string   `json:"installation_id"`
		Permissions    []string `json:"permissions"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.service.ApprovePermissions(r.Context(), req.InstallationID, req.Permissions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *ExtensionAPI) PublishExtension(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Manifest     domain.ExtensionManifest `json:"manifest"`
		BundleURL    string                   `json:"bundle_url"`
		ReleaseNotes string                   `json:"release_notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ver, err := a.service.PublishExtensionVersion(r.Context(), req.Manifest, req.BundleURL, req.ReleaseNotes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(ver)
}

func (a *ExtensionAPI) AddReview(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ExtensionID string `json:"extension_id"`
		Rating      int    `json:"rating"`
		Comment     string `json:"comment"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "usr-dev-default"
	}

	review, err := a.service.AddReview(r.Context(), userID, "Developer User", req.ExtensionID, req.Rating, req.Comment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(review)
}
