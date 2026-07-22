package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/memory/domain"
)

// MemoryRepository defines all persistence operations for the Memory Engine
type MemoryRepository interface {
	// Memory CRUD
	CreateMemory(m *domain.Memory) error
	GetMemory(memoryID string) (*domain.Memory, error)
	UpdateMemory(m *domain.Memory) error
	DeleteMemory(memoryID string) error
	ListMemories(vaultID string) ([]*domain.Memory, error)
	ListMemoriesByType(vaultID string, memType domain.MemoryType) ([]*domain.Memory, error)

	// Sources
	AddSource(source *domain.MemorySource) error
	GetSources(memoryID string) ([]*domain.MemorySource, error)

	// Scores
	AppendScore(score *domain.MemoryScore) error
	GetScores(memoryID string) ([]*domain.MemoryScore, error)

	// Events
	AppendEvent(event *domain.MemoryEvent) error
	GetEvents(memoryID string) ([]*domain.MemoryEvent, error)

	// History
	AppendHistory(history *domain.MemoryHistory) error
	GetHistory(memoryID string) ([]*domain.MemoryHistory, error)

	// Settings
	GetSettings(vaultID string) (*domain.MemorySettings, error)
	UpsertSettings(settings *domain.MemorySettings) error

	// Clusters
	UpsertCluster(cluster *domain.MemoryCluster) error
	GetClusters(vaultID string) ([]*domain.MemoryCluster, error)

	// Vault-wide operations
	DeleteAllMemoryData(vaultID string) error
}

// InMemoryMemoryRepository is a thread-safe in-memory implementation
type InMemoryMemoryRepository struct {
	mu       sync.RWMutex
	memories  map[string]*domain.Memory          // memoryID → memory
	sources   map[string][]*domain.MemorySource  // memoryID → sources
	scores    map[string][]*domain.MemoryScore   // memoryID → scores
	events    map[string][]*domain.MemoryEvent   // memoryID → events
	history   map[string][]*domain.MemoryHistory // memoryID → history
	settings  map[string]*domain.MemorySettings  // vaultID → settings
	clusters  map[string][]*domain.MemoryCluster // vaultID → clusters
}

// NewInMemoryMemoryRepository creates a new in-memory repository
func NewInMemoryMemoryRepository() *InMemoryMemoryRepository {
	return &InMemoryMemoryRepository{
		memories: make(map[string]*domain.Memory),
		sources:  make(map[string][]*domain.MemorySource),
		scores:   make(map[string][]*domain.MemoryScore),
		events:   make(map[string][]*domain.MemoryEvent),
		history:  make(map[string][]*domain.MemoryHistory),
		settings: make(map[string]*domain.MemorySettings),
		clusters: make(map[string][]*domain.MemoryCluster),
	}
}

// --- Memory CRUD ---

func (r *InMemoryMemoryRepository) CreateMemory(m *domain.Memory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.memories[m.MemoryID] = m
	return nil
}

func (r *InMemoryMemoryRepository) GetMemory(memoryID string) (*domain.Memory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if m, ok := r.memories[memoryID]; ok {
		return m, nil
	}
	return nil, fmt.Errorf("memory %s not found", memoryID)
}

func (r *InMemoryMemoryRepository) UpdateMemory(m *domain.Memory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	m.UpdatedAt = time.Now()
	r.memories[m.MemoryID] = m
	return nil
}

func (r *InMemoryMemoryRepository) DeleteMemory(memoryID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.memories, memoryID)
	delete(r.sources, memoryID)
	delete(r.scores, memoryID)
	delete(r.events, memoryID)
	return nil
}

func (r *InMemoryMemoryRepository) ListMemories(vaultID string) ([]*domain.Memory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []*domain.Memory
	for _, m := range r.memories {
		if m.VaultID == vaultID {
			result = append(result, m)
		}
	}
	return result, nil
}

func (r *InMemoryMemoryRepository) ListMemoriesByType(vaultID string, memType domain.MemoryType) ([]*domain.Memory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []*domain.Memory
	for _, m := range r.memories {
		if m.VaultID == vaultID && m.MemoryType == memType {
			result = append(result, m)
		}
	}
	return result, nil
}

// --- Sources ---

func (r *InMemoryMemoryRepository) AddSource(source *domain.MemorySource) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.sources[source.MemoryID] = append(r.sources[source.MemoryID], source)
	return nil
}

func (r *InMemoryMemoryRepository) GetSources(memoryID string) ([]*domain.MemorySource, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.sources[memoryID], nil
}

// --- Scores ---

func (r *InMemoryMemoryRepository) AppendScore(score *domain.MemoryScore) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.scores[score.MemoryID] = append(r.scores[score.MemoryID], score)
	return nil
}

func (r *InMemoryMemoryRepository) GetScores(memoryID string) ([]*domain.MemoryScore, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.scores[memoryID], nil
}

// --- Events ---

func (r *InMemoryMemoryRepository) AppendEvent(event *domain.MemoryEvent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.events[event.MemoryID] = append(r.events[event.MemoryID], event)
	return nil
}

func (r *InMemoryMemoryRepository) GetEvents(memoryID string) ([]*domain.MemoryEvent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.events[memoryID], nil
}

// --- History ---

func (r *InMemoryMemoryRepository) AppendHistory(history *domain.MemoryHistory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.history[history.MemoryID] = append(r.history[history.MemoryID], history)
	return nil
}

func (r *InMemoryMemoryRepository) GetHistory(memoryID string) ([]*domain.MemoryHistory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.history[memoryID], nil
}

// --- Settings ---

func (r *InMemoryMemoryRepository) GetSettings(vaultID string) (*domain.MemorySettings, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if s, ok := r.settings[vaultID]; ok {
		return s, nil
	}
	// Return defaults
	return &domain.MemorySettings{
		VaultID:               vaultID,
		MemoryLearningEnabled: true,
		AutoArchiveThreshold:  0.1,
		AutoForgetThreshold:   0.01,
		DefaultDecayRate:      0.03,
		MaxWorkingMemories:    20,
		CreatedAt:             time.Now(),
		UpdatedAt:             time.Now(),
	}, nil
}

func (r *InMemoryMemoryRepository) UpsertSettings(settings *domain.MemorySettings) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	settings.UpdatedAt = time.Now()
	r.settings[settings.VaultID] = settings
	return nil
}

// --- Clusters ---

func (r *InMemoryMemoryRepository) UpsertCluster(cluster *domain.MemoryCluster) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	clusters := r.clusters[cluster.VaultID]
	for i, c := range clusters {
		if c.ClusterID == cluster.ClusterID {
			clusters[i] = cluster
			return nil
		}
	}
	r.clusters[cluster.VaultID] = append(clusters, cluster)
	return nil
}

func (r *InMemoryMemoryRepository) GetClusters(vaultID string) ([]*domain.MemoryCluster, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.clusters[vaultID], nil
}

// --- Full Delete ---

func (r *InMemoryMemoryRepository) DeleteAllMemoryData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for id, m := range r.memories {
		if m.VaultID == vaultID {
			delete(r.memories, id)
			delete(r.sources, id)
			delete(r.scores, id)
			delete(r.events, id)
		}
	}
	delete(r.settings, vaultID)
	delete(r.clusters, vaultID)
	return nil
}
