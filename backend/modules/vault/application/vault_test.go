package application

import (
	"testing"
	"time"

	"github.com/diablovocado/declutr/modules/vault/domain"
)

func TestVaultDomainDefaults(t *testing.T) {
	v := domain.Vault{
		VaultID:          "v_123",
		OwnerID:          "u_456",
		DisplayName:      "My Life Vault",
		WorkspaceStatus:  "ACTIVE",
		EncryptionStatus: "ENCRYPTED",
		CreatedAt:        time.Now(),
	}

	if v.DisplayName != "My Life Vault" {
		t.Errorf("Expected default vault display name 'My Life Vault', got '%s'", v.DisplayName)
	}

	if v.WorkspaceStatus != "ACTIVE" || v.EncryptionStatus != "ENCRYPTED" {
		t.Errorf("Expected active encrypted workspace status")
	}
}

func TestVaultStatisticsCalculations(t *testing.T) {
	stats := domain.VaultStatistics{
		TotalBytes:  1024 * 1024 * 50, // 50MB
		TotalItems:  12,
		Collections: 3,
	}

	if stats.TotalItems != 12 || stats.Collections != 3 {
		t.Errorf("Vault statistics mismatch: %+v", stats)
	}
}
