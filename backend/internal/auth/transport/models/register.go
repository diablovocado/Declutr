package models

import "github.com/diablovocado/declutr/utils"

type RegisterRequest struct {
	Email       string              `json:"email"`
	SRPVerifier string              `json:"srpVerifier"`
	SRPSalt     string              `json:"srpSalt"`
	MVK         utils.EncryptedMVK `json:"mvk"`
}

type RegisterResponse struct {
	UserID string `json:"userId"`
}
