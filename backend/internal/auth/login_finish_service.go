package auth

import authmodels "github.com/diablovocado/declutr/internal/auth/models"

func (s *Service) LoginFinish(
	req authmodels.LoginFinishRequest,
) (*authmodels.LoginFinishResponse, error) {

	return &authmodels.LoginFinishResponse{
		ServerProof: "temporary-server-proof",
		AccessToken: "temporary-access-token",
	}, nil
}
