package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/persona/domain"
)

// PersonaRepository defines all data operations for the persona engine
type PersonaRepository interface {
	// Profile operations
	GetProfile(vaultID string) (*domain.PersonaProfile, error)
	UpsertProfile(profile *domain.PersonaProfile) error

	// Signal operations
	AppendSignal(signal *domain.PersonaSignal) error
	GetSignals(vaultID string) ([]*domain.PersonaSignal, error)
	DeleteSignals(vaultID string) error

	// Score operations
	GetScores(vaultID string) ([]*domain.PersonaScore, error)
	UpsertScore(score *domain.PersonaScore) error
	DeleteScores(vaultID string) error

	// Interest operations
	GetInterests(vaultID string) ([]*domain.PersonaInterest, error)
	UpsertInterest(interest *domain.PersonaInterest) error
	DeleteInterests(vaultID string) error

	// Recommendation operations
	GetRecommendations(vaultID string) ([]*domain.PersonaRecommendation, error)
	AddRecommendation(rec *domain.PersonaRecommendation) error
	DismissRecommendation(vaultID, recID string) error
	DeleteRecommendations(vaultID string) error

	// Settings operations
	GetSettings(vaultID string) (*domain.PersonaSettings, error)
	UpsertSettings(settings *domain.PersonaSettings) error

	// History operations
	AppendHistory(history *domain.PersonaHistory) error
	GetHistory(vaultID string) ([]*domain.PersonaHistory, error)
	DeleteHistory(vaultID string) error

	// Full delete (GDPR)
	DeleteAllPersonaData(vaultID string) error
}

// InMemoryPersonaRepository provides a thread-safe in-memory implementation
type InMemoryPersonaRepository struct {
	mu              sync.RWMutex
	profiles        map[string]*domain.PersonaProfile         // vaultID -> profile
	signals         map[string][]*domain.PersonaSignal        // vaultID -> signals
	scores          map[string][]*domain.PersonaScore         // vaultID -> scores
	interests       map[string][]*domain.PersonaInterest      // vaultID -> interests
	recommendations map[string][]*domain.PersonaRecommendation // vaultID -> recommendations
	settings        map[string]*domain.PersonaSettings        // vaultID -> settings
	history         map[string][]*domain.PersonaHistory       // vaultID -> history
}

func NewInMemoryPersonaRepository() *InMemoryPersonaRepository {
	return &InMemoryPersonaRepository{
		profiles:        make(map[string]*domain.PersonaProfile),
		signals:         make(map[string][]*domain.PersonaSignal),
		scores:          make(map[string][]*domain.PersonaScore),
		interests:       make(map[string][]*domain.PersonaInterest),
		recommendations: make(map[string][]*domain.PersonaRecommendation),
		settings:        make(map[string]*domain.PersonaSettings),
		history:         make(map[string][]*domain.PersonaHistory),
	}
}

// --- Profile ---

func (r *InMemoryPersonaRepository) GetProfile(vaultID string) (*domain.PersonaProfile, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if p, ok := r.profiles[vaultID]; ok {
		return p, nil
	}
	return nil, nil
}

func (r *InMemoryPersonaRepository) UpsertProfile(profile *domain.PersonaProfile) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.profiles[profile.VaultID] = profile
	return nil
}

// --- Signals ---

func (r *InMemoryPersonaRepository) AppendSignal(signal *domain.PersonaSignal) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.signals[signal.VaultID] = append(r.signals[signal.VaultID], signal)
	return nil
}

func (r *InMemoryPersonaRepository) GetSignals(vaultID string) ([]*domain.PersonaSignal, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.signals[vaultID], nil
}

func (r *InMemoryPersonaRepository) DeleteSignals(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.signals, vaultID)
	return nil
}

// --- Scores ---

func (r *InMemoryPersonaRepository) GetScores(vaultID string) ([]*domain.PersonaScore, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.scores[vaultID], nil
}

func (r *InMemoryPersonaRepository) UpsertScore(score *domain.PersonaScore) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	existing := r.scores[score.VaultID]
	for i, s := range existing {
		if s.Dimension == score.Dimension {
			existing[i] = score
			return nil
		}
	}
	r.scores[score.VaultID] = append(existing, score)
	return nil
}

func (r *InMemoryPersonaRepository) DeleteScores(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.scores, vaultID)
	return nil
}

// --- Interests ---

func (r *InMemoryPersonaRepository) GetInterests(vaultID string) ([]*domain.PersonaInterest, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.interests[vaultID], nil
}

func (r *InMemoryPersonaRepository) UpsertInterest(interest *domain.PersonaInterest) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	existing := r.interests[interest.VaultID]
	for i, it := range existing {
		if it.Topic == interest.Topic {
			existing[i] = interest
			return nil
		}
	}
	r.interests[interest.VaultID] = append(existing, interest)
	return nil
}

func (r *InMemoryPersonaRepository) DeleteInterests(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.interests, vaultID)
	return nil
}

// --- Recommendations ---

func (r *InMemoryPersonaRepository) GetRecommendations(vaultID string) ([]*domain.PersonaRecommendation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var active []*domain.PersonaRecommendation
	for _, rec := range r.recommendations[vaultID] {
		if !rec.IsDismissed {
			active = append(active, rec)
		}
	}
	return active, nil
}

func (r *InMemoryPersonaRepository) AddRecommendation(rec *domain.PersonaRecommendation) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recommendations[rec.VaultID] = append(r.recommendations[rec.VaultID], rec)
	return nil
}

func (r *InMemoryPersonaRepository) DismissRecommendation(vaultID, recID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, rec := range r.recommendations[vaultID] {
		if rec.RecommendationID == recID {
			rec.IsDismissed = true
			return nil
		}
	}
	return fmt.Errorf("recommendation %s not found", recID)
}

func (r *InMemoryPersonaRepository) DeleteRecommendations(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.recommendations, vaultID)
	return nil
}

// --- Settings ---

func (r *InMemoryPersonaRepository) GetSettings(vaultID string) (*domain.PersonaSettings, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if s, ok := r.settings[vaultID]; ok {
		return s, nil
	}
	// Return default settings if none exist
	return &domain.PersonaSettings{
		VaultID:             vaultID,
		LearningPaused:      false,
		DisabledSignalTypes: []string{},
		AllowExport:         true,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}, nil
}

func (r *InMemoryPersonaRepository) UpsertSettings(settings *domain.PersonaSettings) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	settings.UpdatedAt = time.Now()
	r.settings[settings.VaultID] = settings
	return nil
}

// --- History ---

func (r *InMemoryPersonaRepository) AppendHistory(history *domain.PersonaHistory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.history[history.VaultID] = append(r.history[history.VaultID], history)
	return nil
}

func (r *InMemoryPersonaRepository) GetHistory(vaultID string) ([]*domain.PersonaHistory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.history[vaultID], nil
}

func (r *InMemoryPersonaRepository) DeleteHistory(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.history, vaultID)
	return nil
}

// --- Full Delete ---

func (r *InMemoryPersonaRepository) DeleteAllPersonaData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.profiles, vaultID)
	delete(r.signals, vaultID)
	delete(r.scores, vaultID)
	delete(r.interests, vaultID)
	delete(r.recommendations, vaultID)
	delete(r.settings, vaultID)
	delete(r.history, vaultID)
	return nil
}
