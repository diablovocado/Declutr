package application

import (
	"testing"
	"time"

	"github.com/diablovocado/declutr/modules/auth/domain"
)

func TestSessionActiveCheck(t *testing.T) {
	activeSession := domain.UserSession{
		SessionID: "sess_1",
		UserID:    "usr_1",
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}

	if !activeSession.IsActive() {
		t.Errorf("Expected session to be active")
	}

	expiredSession := domain.UserSession{
		SessionID: "sess_2",
		UserID:    "usr_1",
		ExpiresAt: time.Now().Add(-1 * time.Hour),
	}

	if expiredSession.IsActive() {
		t.Errorf("Expected expired session to be inactive")
	}

	now := time.Now()
	revokedSession := domain.UserSession{
		SessionID: "sess_3",
		UserID:    "usr_1",
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
		RevokedAt: &now,
	}

	if revokedSession.IsActive() {
		t.Errorf("Expected revoked session to be inactive")
	}
}
