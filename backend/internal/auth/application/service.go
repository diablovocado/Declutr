package application

import (
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/internal/auth/domain"
	"github.com/diablovocado/declutr/internal/auth/repository"
	"github.com/diablovocado/declutr/internal/auth/transport/models"
	"github.com/diablovocado/declutr/utils"
)

type Service struct {
	UserRepo   repository.UserRepository
	Challenges *ChallengeStore
	SRP        *Engine
}

func (s *Service) Register(req models.RegisterRequest) (string, error) {
	id := uuid.New().String()

	user := domain.User{
		ID: id,

		EmailHash: utils.HashEmail(req.Email),

		SRPVerifier: req.SRPVerifier,
		SRPSalt:     req.SRPSalt,

		EncryptedMVKCiphertext: req.MVK.Ciphertext,
		EncryptedMVKNonce:      req.MVK.Nonce,
		EncryptedMVKVersion:    req.MVK.Version,

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.UserRepo.CreateUser(user); err != nil {
		return "", err
	}

	return id, nil
}
