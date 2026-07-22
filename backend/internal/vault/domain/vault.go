package domain

import "time"

type Vault struct {
	VaultID            string    `json:"vaultId"`
	OwnerID            string    `json:"ownerId"`
	DisplayName        string    `json:"displayName"`
	Description        string    `json:"description"`
	StorageUsageBytes  int64     `json:"storageUsageBytes"`
	ItemCount          int       `json:"itemCount"`
	CollectionCount    int       `json:"collectionCount"`
	WorkspaceStatus    string    `json:"workspaceStatus"`
	EncryptionStatus   string    `json:"encryptionStatus"`
	DefaultLanguage    string    `json:"defaultLanguage"`
	DefaultAIMode      string    `json:"defaultAiMode"`
	DefaultPrivacyMode string    `json:"defaultPrivacyMode"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

type VaultSettings struct {
	VaultID     string    `json:"vaultId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Theme       string    `json:"theme"`
	PrivacyMode string    `json:"privacyMode"`
	AIMode      string    `json:"aiMode"`
	Language    string    `json:"language"`
	Timezone    string    `json:"timezone"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type VaultStatistics struct {
	TotalBytes  int64 `json:"totalBytes"`
	TotalItems  int   `json:"totalItems"`
	Collections int   `json:"collections"`
}
