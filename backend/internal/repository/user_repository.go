package repository

import "github.com/diablovocado/declutr/internal/models"

type UserRepository interface {
	CreateUser(user models.User) error
	GetUserByEmailHash(emailHash string) (*models.User, error)
}
func (r *PostgresUserRepository) GetUserByEmailHash(emailHash string) (*models.User, error) {
	user := &models.User{}

	err := r.DB.QueryRow(`
		SELECT
			id,
			email_hash,
			srp_verifier,
			srp_salt,
			encrypted_mvk_ciphertext,
			encrypted_mvk_nonce,
			encrypted_mvk_version,
			created_at,
			updated_at
		FROM users
		WHERE email_hash = $1
	`,
		emailHash,
	).Scan(
		&user.ID,
		&user.EmailHash,
		&user.SRPVerifier,
		&user.SRPSalt,
		&user.EncryptedMVKCiphertext,
		&user.EncryptedMVKNonce,
		&user.EncryptedMVKVersion,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}