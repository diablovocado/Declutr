package domain

import "time"

type ChallengeID string

type Challenge struct {
	ID        ChallengeID
	UserID    string

	ServerSecret    string
	ServerPublicKey string

	EmailHash string
	Salt      string
	B         string
	b         string
	ExpiresAt time.Time

	CreatedAt time.Time
}

type SRPChallenge = Challenge
