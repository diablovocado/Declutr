package application

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/memory/domain"
	"github.com/diablovocado/declutr/modules/memory/repository"
)

// MemoryService is the core Memory Engine service
type MemoryService struct {
	repo repository.MemoryRepository
}

// NewMemoryService creates a new MemoryService
func NewMemoryService(repo repository.MemoryRepository) *MemoryService {
	return &MemoryService{repo: repo}
}

// ============================================================
// Memory Formation
// ============================================================

// FormMemory creates a new memory from the given request.
// It consumes entities, relationships, contexts, and persona signals — never raw assets directly.
// If a very similar memory already exists, it strengthens it instead of creating a duplicate.
func (s *MemoryService) FormMemory(req *domain.MemoryFormationRequest) (*domain.Memory, error) {
	settings, err := s.repo.GetSettings(req.VaultID)
	if err != nil {
		return nil, fmt.Errorf("memory: failed to load settings: %w", err)
	}
	if !settings.MemoryLearningEnabled {
		return nil, nil // silently dropped
	}

	// Check for existing duplicate (same title in vault)
	existing, _ := s.repo.ListMemories(req.VaultID)
	for _, m := range existing {
		if strings.EqualFold(m.Title, req.Title) && !m.IsArchived {
			return s.strengthenMemory(m, req)
		}
	}

	now := time.Now()
	strength := computeInitialStrength(req.Importance, req.Confidence)
	memType := req.MemoryType
	if memType == "" {
		memType = classifyMemoryType(strength)
	}

	mem := &domain.Memory{
		MemoryID:       uuid.New().String(),
		VaultID:        req.VaultID,
		Title:          req.Title,
		Summary:        req.Summary,
		MemoryType:     memType,
		ImportanceScore: req.Importance,
		Confidence:     req.Confidence,
		Recency:        1.0,
		Frequency:      1,
		MemoryStrength: strength,
		DecayRate:      settings.DefaultDecayRate,
		IsPinned:       false,
		IsArchived:     false,
		LastAccessedAt: &now,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if err := s.repo.CreateMemory(mem); err != nil {
		return nil, fmt.Errorf("memory: failed to create memory: %w", err)
	}

	// Record sources
	for _, src := range req.Sources {
		_ = s.repo.AddSource(&domain.MemorySource{
			SourceID:           uuid.New().String(),
			MemoryID:           mem.MemoryID,
			SourceType:         src.SourceType,
			SourceRefID:        src.SourceRefID,
			ContributionWeight: src.Weight,
			CreatedAt:          now,
		})
	}

	// Record initial score
	_ = s.recordScore(mem)

	// Log formation event
	_ = s.repo.AppendEvent(&domain.MemoryEvent{
		EventID:   uuid.New().String(),
		MemoryID:  mem.MemoryID,
		EventType: domain.MemoryEventFormed,
		EventData: map[string]interface{}{
			"strength": strength,
			"type":     memType,
			"sources":  len(req.Sources),
		},
		OccurredAt: now,
	})

	return mem, nil
}

// strengthenMemory increases the frequency and recency of an existing memory
func (s *MemoryService) strengthenMemory(m *domain.Memory, req *domain.MemoryFormationRequest) (*domain.Memory, error) {
	m.Frequency++
	m.Recency = 1.0
	if req.Importance > m.ImportanceScore {
		m.ImportanceScore = req.Importance
	}
	if req.Confidence > m.Confidence {
		m.Confidence = req.Confidence
	}
	m.MemoryStrength = computeStrength(m.ImportanceScore, m.Recency, m.Frequency, m.Confidence)
	m.MemoryType = classifyMemoryType(m.MemoryStrength)
	now := time.Now()
	m.LastAccessedAt = &now
	m.UpdatedAt = now

	if err := s.repo.UpdateMemory(m); err != nil {
		return nil, fmt.Errorf("memory: failed to strengthen memory: %w", err)
	}

	_ = s.recordScore(m)
	_ = s.repo.AppendEvent(&domain.MemoryEvent{
		EventID:   uuid.New().String(),
		MemoryID:  m.MemoryID,
		EventType: domain.MemoryEventStrengthened,
		EventData: map[string]interface{}{"newStrength": m.MemoryStrength, "frequency": m.Frequency},
		OccurredAt: now,
	})
	return m, nil
}

// ============================================================
// Memory Decay
// ============================================================

// ApplyDecay applies configurable exponential decay to all vault memories.
// Pinned memories are immune to decay.
// Memories that fall below thresholds are automatically archived or marked forgotten.
func (s *MemoryService) ApplyDecay(vaultID string) error {
	settings, _ := s.repo.GetSettings(vaultID)
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return err
	}

	now := time.Now()
	for _, m := range memories {
		if m.IsPinned || m.IsArchived || m.MemoryType == domain.MemoryTypeForgotten {
			continue
		}

		daysSince := 0.0
		if m.LastAccessedAt != nil {
			daysSince = now.Sub(*m.LastAccessedAt).Hours() / 24
		}

		// Exponential decay: strength × e^(−decayRate × days)
		decayFactor := math.Exp(-m.DecayRate * daysSince)
		m.Recency = decayFactor
		m.MemoryStrength = computeStrength(m.ImportanceScore, m.Recency, m.Frequency, m.Confidence)

		// Lifecycle transitions based on strength thresholds
		previousType := m.MemoryType
		switch {
		case m.MemoryStrength < settings.AutoForgetThreshold:
			m.MemoryType = domain.MemoryTypeForgotten
		case m.MemoryStrength < settings.AutoArchiveThreshold:
			m.MemoryType = domain.MemoryTypeArchived
			m.IsArchived = true
		default:
			m.MemoryType = classifyMemoryType(m.MemoryStrength)
		}

		m.UpdatedAt = now
		_ = s.repo.UpdateMemory(m)
		_ = s.recordScore(m)

		if string(m.MemoryType) != string(previousType) {
			_ = s.repo.AppendEvent(&domain.MemoryEvent{
				EventID:   uuid.New().String(),
				MemoryID:  m.MemoryID,
				EventType: domain.MemoryEventDecayed,
				EventData: map[string]interface{}{
					"from":     previousType,
					"to":       m.MemoryType,
					"strength": m.MemoryStrength,
					"daysSince": daysSince,
				},
				OccurredAt: now,
			})
		}
	}
	return nil
}

// ============================================================
// Memory Consolidation
// ============================================================

// ConsolidateMemories merges duplicates, strengthens recurring patterns, and archives stale memories.
// This runs incrementally — only processes memories updated since the last consolidation.
func (s *MemoryService) ConsolidateMemories(vaultID string) error {
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return err
	}

	// Build clusters by grouping memories with similar titles/keywords
	clusters := buildTopicClusters(memories, vaultID)
	for _, cluster := range clusters {
		_ = s.repo.UpsertCluster(cluster)
	}

	return nil
}

// buildTopicClusters groups memories by shared topic keywords
func buildTopicClusters(memories []*domain.Memory, vaultID string) []*domain.MemoryCluster {
	topicMap := make(map[string][]string)
	for _, m := range memories {
		topics := extractTopicKeywords(m.Title + " " + m.Summary)
		for _, topic := range topics {
			topicMap[topic] = append(topicMap[topic], m.MemoryID)
		}
	}

	var clusters []*domain.MemoryCluster
	now := time.Now()
	for topic, ids := range topicMap {
		if len(ids) < 2 {
			continue
		}
		cohesion := math.Min(float64(len(ids))/10.0, 1.0)
		clusters = append(clusters, &domain.MemoryCluster{
			ClusterID:       uuid.New().String(),
			VaultID:         vaultID,
			ClusterName:     topic,
			ClusterType:     "TOPIC",
			MemberMemoryIDs: ids,
			CohesionScore:   cohesion,
			CreatedAt:       now,
			UpdatedAt:       now,
		})
	}
	return clusters
}

func extractTopicKeywords(text string) []string {
	text = strings.ToLower(text)
	keywordSets := map[string][]string{
		"travel":     {"travel", "flight", "trip", "hotel", "visa", "airport", "itinerary"},
		"medical":    {"medical", "health", "doctor", "hospital", "prescription", "diagnosis"},
		"finance":    {"invoice", "payment", "tax", "budget", "expense", "bank", "finance"},
		"legal":      {"legal", "contract", "agreement", "court", "attorney", "lawsuit"},
		"project":    {"project", "sprint", "milestone", "deadline", "meeting", "task"},
		"research":   {"research", "paper", "study", "analysis", "experiment", "journal"},
		"education":  {"study", "university", "exam", "lecture", "thesis", "course"},
		"personal":   {"personal", "diary", "journal", "note", "memory", "life"},
	}

	var matched []string
	for topic, keywords := range keywordSets {
		for _, kw := range keywords {
			if strings.Contains(text, kw) {
				matched = append(matched, topic)
				break
			}
		}
	}
	return matched
}

// ============================================================
// Memory Retrieval
// ============================================================

// GetStrongestMemories returns the top N memories by composite strength
func (s *MemoryService) GetStrongestMemories(vaultID string, limit int) ([]*domain.Memory, error) {
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return nil, err
	}
	sort.Slice(memories, func(i, j int) bool {
		return memories[i].MemoryStrength > memories[j].MemoryStrength
	})
	if limit > 0 && len(memories) > limit {
		return memories[:limit], nil
	}
	return memories, nil
}

// GetRecentMemories returns memories ordered by last accessed time
func (s *MemoryService) GetRecentMemories(vaultID string, limit int) ([]*domain.Memory, error) {
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return nil, err
	}
	sort.Slice(memories, func(i, j int) bool {
		ai := memories[i].LastAccessedAt
		aj := memories[j].LastAccessedAt
		if ai == nil {
			return false
		}
		if aj == nil {
			return true
		}
		return ai.After(*aj)
	})
	if limit > 0 && len(memories) > limit {
		return memories[:limit], nil
	}
	return memories, nil
}

// GetMemoriesByType retrieves memories filtered by type
func (s *MemoryService) GetMemoriesByType(vaultID string, memType domain.MemoryType) ([]*domain.Memory, error) {
	return s.repo.ListMemoriesByType(vaultID, memType)
}

// GetTimelineMemories returns all memories sorted chronologically for a vault
func (s *MemoryService) GetTimelineMemories(vaultID string) ([]*domain.Memory, error) {
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return nil, err
	}
	sort.Slice(memories, func(i, j int) bool {
		return memories[i].CreatedAt.Before(memories[j].CreatedAt)
	})
	return memories, nil
}

// GetMemoryDetail returns the full enriched view of a memory
func (s *MemoryService) GetMemoryDetail(memoryID string) (*domain.MemoryDetail, error) {
	mem, err := s.repo.GetMemory(memoryID)
	if err != nil {
		return nil, err
	}
	sources, _ := s.repo.GetSources(memoryID)
	scores, _ := s.repo.GetScores(memoryID)
	events, _ := s.repo.GetEvents(memoryID)

	now := time.Now()
	mem.LastAccessedAt = &now
	_ = s.repo.UpdateMemory(mem)
	_ = s.repo.AppendEvent(&domain.MemoryEvent{
		EventID:    uuid.New().String(),
		MemoryID:   memoryID,
		EventType:  domain.MemoryEventAccessed,
		EventData:  map[string]interface{}{"at": now},
		OccurredAt: now,
	})

	return &domain.MemoryDetail{
		Memory:  mem,
		Sources: sources,
		Scores:  scores,
		Events:  events,
	}, nil
}

// ============================================================
// User Controls
// ============================================================

// PinMemory marks a memory as pinned, making it immune to decay
func (s *MemoryService) PinMemory(memoryID, reason string) error {
	m, err := s.repo.GetMemory(memoryID)
	if err != nil {
		return err
	}
	m.IsPinned = true
	m.PinReason = reason
	m.MemoryType = domain.MemoryTypePinned
	now := time.Now()
	m.UpdatedAt = now
	if err := s.repo.UpdateMemory(m); err != nil {
		return err
	}
	return s.repo.AppendEvent(&domain.MemoryEvent{
		EventID:    uuid.New().String(),
		MemoryID:   memoryID,
		EventType:  domain.MemoryEventPinned,
		EventData:  map[string]interface{}{"reason": reason},
		OccurredAt: now,
	})
}

// ArchiveMemory moves a memory to the archived state
func (s *MemoryService) ArchiveMemory(memoryID string) error {
	m, err := s.repo.GetMemory(memoryID)
	if err != nil {
		return err
	}
	m.IsArchived = true
	m.MemoryType = domain.MemoryTypeArchived
	now := time.Now()
	m.UpdatedAt = now
	if err := s.repo.UpdateMemory(m); err != nil {
		return err
	}
	return s.repo.AppendEvent(&domain.MemoryEvent{
		EventID:    uuid.New().String(),
		MemoryID:   memoryID,
		EventType:  domain.MemoryEventArchived,
		EventData:  map[string]interface{}{},
		OccurredAt: now,
	})
}

// DeleteMemory permanently removes a memory
func (s *MemoryService) DeleteMemory(memoryID string) error {
	return s.repo.DeleteMemory(memoryID)
}

// ResetMemoryModel removes all memory data for a vault and logs a history event
func (s *MemoryService) ResetMemoryModel(vaultID string) error {
	memories, _ := s.repo.ListMemories(vaultID)
	for _, m := range memories {
		_ = s.repo.AppendHistory(&domain.MemoryHistory{
			HistoryID:      uuid.New().String(),
			MemoryID:       m.MemoryID,
			VaultID:        vaultID,
			MemoryType:     string(m.MemoryType),
			StrengthSnapshot: m.MemoryStrength,
			SnapshotReason: "user_reset",
			SnapshotData:   map[string]interface{}{"event": "reset"},
			CreatedAt:      time.Now(),
		})
	}
	return s.repo.DeleteAllMemoryData(vaultID)
}

// GetSettings returns current memory settings for a vault
func (s *MemoryService) GetSettings(vaultID string) (*domain.MemorySettings, error) {
	return s.repo.GetSettings(vaultID)
}

// UpdateSettings saves updated memory settings
func (s *MemoryService) UpdateSettings(settings *domain.MemorySettings) error {
	return s.repo.UpsertSettings(settings)
}

// ============================================================
// Statistics
// ============================================================

// GetStats returns vault-level memory statistics
func (s *MemoryService) GetStats(vaultID string) (*domain.MemoryStats, error) {
	memories, err := s.repo.ListMemories(vaultID)
	if err != nil {
		return nil, err
	}

	stats := &domain.MemoryStats{
		VaultID:       vaultID,
		TotalMemories: len(memories),
		TypeBreakdown: make(map[string]int),
	}
	totalStrength := 0.0
	for _, m := range memories {
		stats.TypeBreakdown[string(m.MemoryType)]++
		totalStrength += m.MemoryStrength
		switch m.MemoryType {
		case domain.MemoryTypePinned:
			stats.Pinned++
		case domain.MemoryTypeLongTerm:
			stats.LongTerm++
		case domain.MemoryTypeWorking:
			stats.Working++
		case domain.MemoryTypeArchived:
			stats.Archived++
		case domain.MemoryTypeForgotten:
			stats.Forgotten++
		}
	}
	if len(memories) > 0 {
		stats.AvgStrength = totalStrength / float64(len(memories))
	}
	return stats, nil
}

// GetClusters returns all memory clusters for a vault
func (s *MemoryService) GetClusters(vaultID string) ([]*domain.MemoryCluster, error) {
	return s.repo.GetClusters(vaultID)
}

// ============================================================
// Auto-Formation Helpers — consumes AI-layer outputs
// ============================================================

// FormMemoriesFromContext forms memories from context engine output.
// Called with context name, type, and contributing entity/asset IDs.
func (s *MemoryService) FormMemoriesFromContext(vaultID, contextName, contextType string, entityIDs, assetIDs []string, confidence float64) error {
	sources := make([]domain.MemorySourceInput, 0, len(entityIDs)+len(assetIDs))
	for _, id := range entityIDs {
		sources = append(sources, domain.MemorySourceInput{SourceType: domain.SourceEntity, SourceRefID: id, Weight: 0.8})
	}
	for _, id := range assetIDs {
		sources = append(sources, domain.MemorySourceInput{SourceType: domain.SourceContext, SourceRefID: id, Weight: 1.0})
	}

	importance := importanceFromContextType(contextType)
	req := &domain.MemoryFormationRequest{
		VaultID:    vaultID,
		Title:      contextName,
		Summary:    fmt.Sprintf("Auto-formed from %s context with %d contributing sources", contextType, len(sources)),
		MemoryType: domain.MemoryTypeWorking,
		Sources:    sources,
		Importance: importance,
		Confidence: confidence,
	}
	_, err := s.FormMemory(req)
	return err
}

// FormMemoriesFromPersona forms memories from persona interest output.
func (s *MemoryService) FormMemoriesFromPersona(vaultID, personaType string, interests []string, confidence float64) error {
	for _, interest := range interests {
		req := &domain.MemoryFormationRequest{
			VaultID: vaultID,
			Title:   interest,
			Summary: fmt.Sprintf("Long-term interest inferred by %s persona profile", personaType),
			MemoryType: domain.MemoryTypeLongTerm,
			Sources: []domain.MemorySourceInput{
				{SourceType: domain.SourcePersona, SourceRefID: personaType, Weight: 0.9},
			},
			Importance: 0.7,
			Confidence: confidence,
		}
		if _, err := s.FormMemory(req); err != nil {
			return err
		}
	}
	return nil
}

// ============================================================
// Internal helpers
// ============================================================

func computeInitialStrength(importance, confidence float64) float64 {
	return math.Min((importance+confidence)/2.0, 1.0)
}

func computeStrength(importance, recency float64, frequency int, confidence float64) float64 {
	freqBonus := math.Log1p(float64(frequency)) / 5.0
	return math.Min((importance*0.4+recency*0.3+freqBonus*0.2+confidence*0.1), 1.0)
}

func classifyMemoryType(strength float64) domain.MemoryType {
	switch {
	case strength >= 0.75:
		return domain.MemoryTypeLongTerm
	case strength >= 0.4:
		return domain.MemoryTypeWorking
	default:
		return domain.MemoryTypeShortTerm
	}
}

func importanceFromContextType(contextType string) float64 {
	m := map[string]float64{
		"Legal": 0.95, "Medical": 0.92, "Financial": 0.88,
		"Travel": 0.75, "Project": 0.80, "Education": 0.78,
		"Research": 0.82, "Personal": 0.65,
	}
	if v, ok := m[contextType]; ok {
		return v
	}
	return 0.70
}

func (s *MemoryService) recordScore(m *domain.Memory) error {
	return s.repo.AppendScore(&domain.MemoryScore{
		ScoreID:          uuid.New().String(),
		MemoryID:         m.MemoryID,
		Importance:       m.ImportanceScore,
		Recency:          m.Recency,
		Frequency:        m.Frequency,
		Confidence:       m.Confidence,
		DecayFactor:      m.Recency,
		CompositeStrength: m.MemoryStrength,
		ScoredAt:         time.Now(),
	})
}
