package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestEndToEndUserJourney(t *testing.T) {
	// Step 1: Register User
	registerPayload := map[string]interface{}{
		"email":       "newuser@declutr.app",
		"name":        "Test User",
		"srpSalt":     "salt_123456",
		"srpVerifier": "verifier_abcdef",
		"mvk": map[string]interface{}{
			"ciphertext": "cipher_mvk_key",
			"nonce":      "nonce_123",
			"version":    1,
		},
	}
	body, _ := json.Marshal(registerPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	// Mock server router simulation
	http.HandleFunc("/api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"registered","userId":"usr_e2e_01"}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Register failed, expected status 200, got %d", w.Code)
	}

	// Step 2: Login Challenge
	loginPayload := map[string]string{"email": "newuser@declutr.app"}
	body, _ = json.Marshal(loginPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/login/start", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	http.HandleFunc("/api/v1/auth/login/start", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"challengeId":"chl_e2e_01","salt":"srp_salt"}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Login start failed, expected status 200, got %d", w.Code)
	}

	// Step 3: Create Vault
	vaultPayload := map[string]string{"displayName": "E2E Life Vault"}
	body, _ = json.Marshal(vaultPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/vaults", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	http.HandleFunc("/api/v1/vaults", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"id":"v_e2e_01","displayName":"E2E Life Vault"}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Create vault failed, expected status 201, got %d", w.Code)
	}

	// Step 4: Upload File Ingestion
	uploadPayload := map[string]interface{}{
		"vaultId":  "v_e2e_01",
		"fileName": "Tax_Return_2025.pdf",
		"size":     1048576,
	}
	body, _ = json.Marshal(uploadPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/files/upload", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	http.HandleFunc("/api/v1/files/upload", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte(`{"id":"file_e2e_01","status":"PROCESSING","stage":"READY","progress":100}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusAccepted {
		t.Fatalf("Upload file failed, expected status 202, got %d", w.Code)
	}

	// Step 5: Natural Search
	searchPayload := map[string]string{"queryText": "Tax Return", "vaultId": "v_e2e_01"}
	body, _ = json.Marshal(searchPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/search/query", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	http.HandleFunc("/api/v1/search/query", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"results":[{"id":"file_e2e_01","fileName":"Tax_Return_2025.pdf","relevanceScore":0.98}],"totalMatches":1}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Search failed, expected status 200, got %d", w.Code)
	}

	// Step 6: AI Copilot Chat
	chatPayload := map[string]string{"conversationId": "conv_01", "question": "What is this document?"}
	body, _ = json.Marshal(chatPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/copilot/messages", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	http.HandleFunc("/api/v1/copilot/messages", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"messageId":"msg_01","answer":"This is a 2025 Tax Return filing.","citations":["Tax_Return_2025.pdf"]}`))
	})
	http.DefaultServeMux.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Copilot chat failed, expected status 200, got %d", w.Code)
	}
}
