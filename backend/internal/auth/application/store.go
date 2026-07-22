package application

import (
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/auth/domain"
)

type ChallengeStore struct {
	mu         sync.RWMutex
	Challenges map[string]domain.Challenge
}

func NewChallengeStore() *ChallengeStore {
	return &ChallengeStore{
		Challenges: make(map[string]domain.Challenge),
	}
}

func (s *ChallengeStore) Save(ch domain.SRPChallenge) {
	s.mu.Lock()
	defer s.mu.Unlock()
	key := string(ch.ID)
	if key == "" {
		key = "default"
	}
	s.Challenges[key] = ch
}

func (s *ChallengeStore) Get(id string) (domain.SRPChallenge, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	ch, exists := s.Challenges[id]
	if !exists {
		return domain.SRPChallenge{}, false
	}
	if !ch.ExpiresAt.IsZero() && time.Now().After(ch.ExpiresAt) {
		return domain.SRPChallenge{}, false
	}
	return ch, true
}

func (s *ChallengeStore) Delete(id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.Challenges, id)
}
