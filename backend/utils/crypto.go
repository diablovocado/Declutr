package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

type EncryptedMVK struct {
	Ciphertext string `json:"ciphertext"`
	Nonce      string `json:"nonce"`
	Version    int    `json:"version"`
}

func GenerateRandomToken(bytesLen int) (string, error) {
	b := make([]byte, bytesLen)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func HashEmail(email string) string {
	normalized := strings.ToLower(strings.TrimSpace(email))
	hash := sha256.Sum256([]byte(normalized))
	return hex.EncodeToString(hash[:])
}
