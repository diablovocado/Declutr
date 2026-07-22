package application

import (
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/internal/auth/domain"
	"github.com/diablovocado/declutr/internal/auth/transport/models"
	"github.com/diablovocado/declutr/utils"
)

func (s *Service) LoginStart(
	req models.LoginStartRequest,
) (*models.LoginStartResponse, error) {

	emailHash := utils.HashEmail(req.Email)

	user, err := s.UserRepo.GetUserByEmailHash(emailHash)
	if err != nil {
		return nil, err
	}

	challengeID := domain.ChallengeID(uuid.New().String())

	challenge := domain.Challenge{
		ID:     challengeID,
		UserID: user.ID,

		ServerSecret:    s.SRP.GenerateServerSecret(),
		ServerPublicKey: s.SRP.GenerateServerPublicKey(),

		CreatedAt: time.Now(),
	}

	s.Challenges.Challenges[string(challengeID)] = challenge

	return &models.LoginStartResponse{
		ChallengeID:     string(challengeID),
		Salt:            user.SRPSalt,
		ServerPublicKey: challenge.ServerPublicKey,
	}, nil
}
