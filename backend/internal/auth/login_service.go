package auth

import (
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/google/uuid"

	authmodels "github.com/diablovocado/declutr/internal/auth/models"
	"github.com/diablovocado/declutr/internal/auth/srp"
	"github.com/diablovocado/declutr/internal/crypto"
)

func randomHex(n int) string {
	b := make([]byte, n)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func (s *Service) LoginStart(
	req authmodels.LoginStartRequest,
) (*authmodels.LoginStartResponse, error) {

	emailHash := crypto.HashEmail(req.Email)

	user, err := s.UserRepo.GetUserByEmailHash(emailHash)
	if err != nil {
		return nil, err
	}

	challengeID := srp.ChallengeID(uuid.New().String())

	challenge := srp.Challenge{
		ID:     challengeID,
		UserID: user.ID,

		ServerSecret:    randomHex(32),
		ServerPublicKey: randomHex(32),

		CreatedAt: time.Now(),
	}

	s.Challenges.Challenges[string(challengeID)] = challenge

	return &authmodels.LoginStartResponse{
		ChallengeID:     string(challengeID),
		Salt:            user.SRPSalt,
		ServerPublicKey: challenge.ServerPublicKey,
	}, nil
}
