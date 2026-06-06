package auth

import (
	authmodels "github.com/diablovocado/declutr/internal/auth/models"
	"github.com/diablovocado/declutr/internal/crypto"
)

func (s *Service) LoginStart(
	req authmodels.LoginStartRequest,
) (*authmodels.LoginStartResponse, error) {

	emailHash := crypto.HashEmail(req.Email)

	user, err := s.UserRepo.GetUserByEmailHash(emailHash)
	if err != nil {
		return nil, err
	}

	return &authmodels.LoginStartResponse{
		Salt: user.SRPSalt,
		ServerPublicKey: "temporary-server-public-key",
	}, nil
}
