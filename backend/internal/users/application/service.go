package application

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/internal/users/domain"
	"github.com/diablovocado/declutr/internal/users/repository"
)

// PersonaService is the core learning and recommendation engine
type PersonaService struct {
	repo repository.PersonaRepository
}

// NewPersonaService creates a new PersonaService
func NewPersonaService(repo repository.PersonaRepository) *PersonaService {
	return &PersonaService{repo: repo}
}

// ============================================================
// Signal Collection
// ============================================================

// RecordSignal appends a single user behaviour signal.
// Honours privacy settings — if learning is paused or the signal type is disabled, it is a no-op.
func (s *PersonaService) RecordSignal(vaultID string, signalType domain.SignalType, assetID, value string, weight float64) error {
	settings, err := s.repo.GetSettings(vaultID)
	if err != nil {
		return fmt.Errorf("persona: failed to load settings: %w", err)
	}
	if settings.LearningPaused {
		return nil // silently drop — learning is paused by user choice
	}
	for _, disabled := range settings.DisabledSignalTypes {
		if disabled == string(signalType) {
			return nil // silently drop — this signal type was disabled by user
		}
	}

	if weight <= 0 {
		weight = 1.0
	}
	sig := &domain.PersonaSignal{
		SignalID:   uuid.New().String(),
		VaultID:    vaultID,
		SignalType: signalType,
		AssetID:    assetID,
		Value:      value,
		Weight:     weight,
		Source:     "user_interaction",
		RecordedAt: time.Now(),
	}
	return s.repo.AppendSignal(sig)
}

// ============================================================
// Scoring Engine with Recency Decay
// ============================================================

// ScoreAndLearn processes all signals for a vault, calculates scores, and updates the profile.
// Uses an exponential decay model: score * e^(-decayRate * daysSinceLastSeen)
func (s *PersonaService) ScoreAndLearn(vaultID string) error {
	signals, err := s.repo.GetSignals(vaultID)
	if err != nil {
		return fmt.Errorf("persona: failed to get signals: %w", err)
	}
	if len(signals) == 0 {
		return nil
	}

	// Aggregate signals into dimension frequency counts and last-seen times
	type dimStats struct {
		frequency int
		totalWeight float64
		lastSeen  time.Time
	}
	dimMap := make(map[string]*dimStats)

	for _, sig := range signals {
		dim := inferDimension(sig)
		if dim == "" {
			continue
		}
		if _, ok := dimMap[dim]; !ok {
			dimMap[dim] = &dimStats{lastSeen: sig.RecordedAt}
		}
		ds := dimMap[dim]
		ds.frequency++
		ds.totalWeight += sig.Weight
		if sig.RecordedAt.After(ds.lastSeen) {
			ds.lastSeen = sig.RecordedAt
		}
	}

	existingScores, _ := s.repo.GetScores(vaultID)
	existingMap := make(map[string]*domain.PersonaScore)
	for _, sc := range existingScores {
		existingMap[sc.Dimension] = sc
	}

	now := time.Now()
	for dim, stats := range dimMap {
		daysSince := now.Sub(stats.lastSeen).Hours() / 24
		decayRate := 0.05
		// Decay applied on recency component
		recency := math.Exp(-decayRate * daysSince) * stats.totalWeight
		// Importance = weighted frequency normalised
		importance := math.Log1p(float64(stats.frequency)) * stats.totalWeight
		confidence := math.Min((recency+importance)/10.0, 1.0)

		trend := domain.TrendStable
		if ex, ok := existingMap[dim]; ok {
			if importance > ex.Importance*1.1 {
				trend = domain.TrendRising
			} else if importance < ex.Importance*0.9 {
				trend = domain.TrendFalling
			}
		}

		ls := stats.lastSeen
		score := &domain.PersonaScore{
			ScoreID:    uuid.New().String(),
			VaultID:    vaultID,
			Dimension:  dim,
			Importance: importance,
			Recency:    recency,
			Frequency:  stats.frequency,
			Confidence: confidence,
			DecayRate:  decayRate,
			Trend:      trend,
			LastSeenAt: &ls,
			UpdatedAt:  now,
		}
		if ex, ok := existingMap[dim]; ok {
			score.ScoreID = ex.ScoreID
		}
		if err := s.repo.UpsertScore(score); err != nil {
			return fmt.Errorf("persona: failed to upsert score for %s: %w", dim, err)
		}
	}

	return s.BuildPersonaProfile(vaultID)
}

// inferDimension maps a signal to a persona dimension category
func inferDimension(sig *domain.PersonaSignal) string {
	val := strings.ToLower(sig.Value)
	switch {
	case sig.SignalType == domain.SignalSearch && val != "":
		return inferTopicFromText(val)
	case sig.SignalType == domain.SignalContextSwitch:
		return inferTopicFromText(val)
	case sig.SignalType == domain.SignalRelationshipExplore:
		return "Knowledge Research"
	case sig.SignalType == domain.SignalUpload:
		return inferDimensionFromFileType(val)
	case sig.SignalType == domain.SignalEdit:
		return "Active Writing"
	case sig.SignalType == domain.SignalPin || sig.SignalType == domain.SignalFavourite:
		return inferTopicFromText(val)
	default:
		return ""
	}
}

func inferTopicFromText(text string) string {
	text = strings.ToLower(text)
	switch {
	case contains(text, "travel", "flight", "hotel", "trip", "visa", "passport", "itinerary", "airport"):
		return "Travel"
	case contains(text, "code", "software", "api", "developer", "debug", "git", "backend", "frontend", "programming"):
		return "Software Development"
	case contains(text, "medical", "doctor", "hospital", "prescription", "health", "diagnosis", "treatment", "pharmacy"):
		return "Healthcare"
	case contains(text, "finance", "invoice", "tax", "budget", "payment", "bank", "expense", "investment", "insurance"):
		return "Finance"
	case contains(text, "legal", "contract", "agreement", "lawsuit", "court", "attorney", "compliance"):
		return "Legal"
	case contains(text, "design", "figma", "ui", "ux", "sketch", "colour", "typography", "mockup"):
		return "Design"
	case contains(text, "photo", "camera", "lens", "shoot", "edit", "raw", "lightroom", "portrait"):
		return "Photography"
	case contains(text, "study", "university", "course", "exam", "lecture", "assignment", "thesis", "research"):
		return "Education"
	case contains(text, "project", "sprint", "milestone", "deadline", "task", "team", "stakeholder"):
		return "Project Management"
	case contains(text, "business", "startup", "product", "market", "sales", "revenue", "pitch"):
		return "Entrepreneurship"
	case contains(text, "content", "blog", "video", "social", "post", "youtube", "creator", "audience"):
		return "Content Creation"
	case contains(text, "research", "paper", "journal", "analysis", "data", "experiment", "findings"):
		return "Research"
	default:
		return "General"
	}
}

func inferDimensionFromFileType(fileType string) string {
	fileType = strings.ToLower(fileType)
	switch {
	case contains(fileType, "pdf", "doc", "docx"):
		return "Document Work"
	case contains(fileType, "jpg", "jpeg", "png", "raw", "heic"):
		return "Photography"
	case contains(fileType, "go", "py", "js", "ts", "java", "cpp"):
		return "Software Development"
	case contains(fileType, "xls", "xlsx", "csv"):
		return "Finance"
	default:
		return "File Management"
	}
}

func contains(text string, keywords ...string) bool {
	for _, kw := range keywords {
		if strings.Contains(text, kw) {
			return true
		}
	}
	return false
}

// ============================================================
// Persona Profile Builder
// ============================================================

// BuildPersonaProfile infers persona type from top scoring dimensions
func (s *PersonaService) BuildPersonaProfile(vaultID string) error {
	scores, err := s.repo.GetScores(vaultID)
	if err != nil || len(scores) == 0 {
		return err
	}

	// Sort by composite score (importance * recency)
	sort.Slice(scores, func(i, j int) bool {
		ci := scores[i].Importance * scores[i].Recency
		cj := scores[j].Importance * scores[j].Recency
		return ci > cj
	})

	topDimension := scores[0].Dimension
	personaType := mapDimensionToPersonaType(topDimension)
	confidence := math.Min(scores[0].Confidence, 1.0)

	// Build knowledge model from interests
	interests, _ := s.repo.GetInterests(vaultID)
	km := buildKnowledgeModel(interests, scores)

	// Build attributes map from top 5 scores
	attrs := map[string]interface{}{}
	for i, sc := range scores {
		if i >= 5 {
			break
		}
		attrs[sc.Dimension] = map[string]interface{}{
			"importance": sc.Importance,
			"recency":    sc.Recency,
			"frequency":  sc.Frequency,
			"confidence": sc.Confidence,
			"trend":      sc.Trend,
		}
	}

	now := time.Now()
	existing, _ := s.repo.GetProfile(vaultID)
	profileID := uuid.New().String()
	if existing != nil {
		profileID = existing.ProfileID
	}

	profile := &domain.PersonaProfile{
		ProfileID:       profileID,
		VaultID:         vaultID,
		PersonaType:     personaType,
		ConfidenceScore: confidence,
		Attributes:      attrs,
		KnowledgeModel:  km,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if existing != nil {
		profile.CreatedAt = existing.CreatedAt
	}

	// Snapshot for history before overwriting
	_ = s.repo.AppendHistory(&domain.PersonaHistory{
		SnapshotID:     uuid.New().String(),
		VaultID:        vaultID,
		PersonaType:    personaType,
		SnapshotData:   attrs,
		SnapshotReason: "incremental_update",
		CreatedAt:      now,
	})

	return s.repo.UpsertProfile(profile)
}

func mapDimensionToPersonaType(dimension string) string {
	m := map[string]string{
		"Travel":              "Traveller",
		"Software Development": "Developer",
		"Healthcare":          "Healthcare Professional",
		"Finance":             "Finance Professional",
		"Legal":               "Legal Professional",
		"Design":              "Designer",
		"Photography":         "Photographer",
		"Education":           "Student",
		"Project Management":  "Project Manager",
		"Entrepreneurship":    "Entrepreneur",
		"Content Creation":    "Content Creator",
		"Research":            "Researcher",
		"Active Writing":      "Writer",
		"Knowledge Research":  "Researcher",
	}
	if pt, ok := m[dimension]; ok {
		return pt
	}
	return "General User"
}

func buildKnowledgeModel(interests []*domain.PersonaInterest, scores []*domain.PersonaScore) *domain.PersonaKnowledgeModel {
	km := &domain.PersonaKnowledgeModel{
		FrequentEntities:   []string{},
		FavouriteLocations: []string{},
		RecurringProjects:  []string{},
		LongTermInterests:  []string{},
		ActiveContexts:     []string{},
		RecurringContacts:  []string{},
		CommonWorkflows:    []string{},
		FrequentVaultAreas: []string{},
	}
	for _, it := range interests {
		switch strings.ToLower(it.EntityType) {
		case "location":
			km.FavouriteLocations = append(km.FavouriteLocations, it.Topic)
		case "person":
			km.RecurringContacts = append(km.RecurringContacts, it.Topic)
		case "project":
			km.RecurringProjects = append(km.RecurringProjects, it.Topic)
		default:
			km.LongTermInterests = append(km.LongTermInterests, it.Topic)
		}
		km.FrequentEntities = append(km.FrequentEntities, it.Topic)
	}
	for _, sc := range scores {
		if sc.Frequency > 3 {
			km.CommonWorkflows = append(km.CommonWorkflows, sc.Dimension)
		}
	}
	return km
}

// ============================================================
// Recommendation Engine
// ============================================================

// GenerateRecommendations produces explainable recommendations based on persona scores
func (s *PersonaService) GenerateRecommendations(vaultID string) ([]*domain.PersonaRecommendation, error) {
	scores, err := s.repo.GetScores(vaultID)
	if err != nil || len(scores) == 0 {
		return nil, err
	}
	// Clear old recommendations for fresh generation
	_ = s.repo.DeleteRecommendations(vaultID)

	profile, _ := s.repo.GetProfile(vaultID)
	personaType := "General User"
	if profile != nil {
		personaType = profile.PersonaType
	}

	var recs []*domain.PersonaRecommendation
	for _, sc := range scores {
		if sc.Confidence < 0.2 {
			continue
		}
		rec := generateRecommendationForScore(vaultID, sc, personaType)
		if rec != nil {
			recs = append(recs, rec)
			_ = s.repo.AddRecommendation(rec)
		}
	}
	return recs, nil
}

func generateRecommendationForScore(vaultID string, sc *domain.PersonaScore, personaType string) *domain.PersonaRecommendation {
	now := time.Now()
	baseRec := &domain.PersonaRecommendation{
		RecommendationID: uuid.New().String(),
		VaultID:          vaultID,
		Confidence:       sc.Confidence,
		ContributingSignals: []string{
			fmt.Sprintf("Dimension '%s' has frequency %d", sc.Dimension, sc.Frequency),
			fmt.Sprintf("Importance score: %.2f", sc.Importance),
			fmt.Sprintf("Recency score: %.2f (trend: %s)", sc.Recency, sc.Trend),
		},
		Evidence: []string{
			fmt.Sprintf("You have %d recorded interactions in '%s'", sc.Frequency, sc.Dimension),
			fmt.Sprintf("This area is %s in your activity", strings.ToLower(string(sc.Trend))),
		},
		RelatedAssetIDs: []string{},
		CreatedAt:       now,
	}

	switch sc.Dimension {
	case "Travel":
		baseRec.RecommendationType = domain.RecommendContinueProject
		baseRec.Title = "Continue Planning Your Trip"
		baseRec.Reason = fmt.Sprintf("As a %s, your travel-related documents are frequently active. You may have an upcoming trip that needs attention.", personaType)
	case "Software Development":
		baseRec.RecommendationType = domain.RecommendContinueProject
		baseRec.Title = "Resume Development Work"
		baseRec.Reason = "Your coding-related assets show high recency. Resuming your active project may help maintain momentum."
	case "Healthcare":
		baseRec.RecommendationType = domain.RecommendRelatedDocument
		baseRec.Title = "Review Your Medical Records"
		baseRec.Reason = "Medical documents are frequently referenced in your vault. Keeping records organised ensures quick access when needed."
	case "Finance":
		baseRec.RecommendationType = domain.RecommendSuggestedContext
		baseRec.Title = "Organise Financial Documents"
		baseRec.Reason = "Your finance-related activity suggests recurring financial tasks. Creating a dedicated context can improve organisation."
	case "Legal":
		baseRec.RecommendationType = domain.RecommendRelatedDocument
		baseRec.Title = "Review Active Legal Documents"
		baseRec.Reason = "Legal documents in your vault show regular interaction. Ensuring these are current and accessible is recommended."
	case "Education":
		baseRec.RecommendationType = domain.RecommendResumeReading
		baseRec.Title = "Continue Your Studies"
		baseRec.Reason = "Study materials and academic documents are a strong pattern in your vault. Resuming where you left off can help with continuity."
	case "Research":
		baseRec.RecommendationType = domain.RecommendSuggestedCollection
		baseRec.Title = "Group Research into a Collection"
		baseRec.Reason = "Your research materials span multiple topics. Grouping them into a dedicated collection will improve discoverability."
	case "Design":
		baseRec.RecommendationType = domain.RecommendContinueProject
		baseRec.Title = "Continue Your Design Project"
		baseRec.Reason = "Design files are consistently accessed in your vault, suggesting an active creative project."
	case "Photography":
		baseRec.RecommendationType = domain.RecommendSuggestedArchive
		baseRec.Title = "Archive Older Photo Sets"
		baseRec.Reason = "Your vault contains a large volume of photos. Archiving older sets can free up navigation space for recent work."
	default:
		baseRec.RecommendationType = domain.RecommendRelatedDocument
		baseRec.Title = fmt.Sprintf("Explore Your %s Materials", sc.Dimension)
		baseRec.Reason = fmt.Sprintf("Your activity in '%s' is consistently present. Reviewing related assets may surface useful information.", sc.Dimension)
	}

	return baseRec
}

// ============================================================
// Interest Tracking
// ============================================================

// RecordInterest updates or creates a long-term interest entry
func (s *PersonaService) RecordInterest(vaultID, topic, entityType string, relevance float64) error {
	now := time.Now()
	interest := &domain.PersonaInterest{
		InterestID:        uuid.New().String(),
		VaultID:           vaultID,
		Topic:             topic,
		EntityType:        entityType,
		FrequencyScore:    relevance,
		PersonalRelevance: relevance,
		LastSeenAt:        &now,
		CreatedAt:         now,
	}
	return s.repo.UpsertInterest(interest)
}

// ============================================================
// Privacy Controls
// ============================================================

// GetSettings returns the current privacy settings for a vault
func (s *PersonaService) GetSettings(vaultID string) (*domain.PersonaSettings, error) {
	return s.repo.GetSettings(vaultID)
}

// UpdateSettings saves updated privacy settings
func (s *PersonaService) UpdateSettings(settings *domain.PersonaSettings) error {
	return s.repo.UpsertSettings(settings)
}

// PauseLearning pauses signal collection for a vault
func (s *PersonaService) PauseLearning(vaultID string) error {
	settings, err := s.repo.GetSettings(vaultID)
	if err != nil {
		return err
	}
	settings.LearningPaused = true
	return s.repo.UpsertSettings(settings)
}

// ResumeLearning resumes signal collection for a vault
func (s *PersonaService) ResumeLearning(vaultID string) error {
	settings, err := s.repo.GetSettings(vaultID)
	if err != nil {
		return err
	}
	settings.LearningPaused = false
	return s.repo.UpsertSettings(settings)
}

// ResetPersona purges all learned data for a vault and logs a history snapshot
func (s *PersonaService) ResetPersona(vaultID string) error {
	profile, _ := s.repo.GetProfile(vaultID)
	personaType := "Unknown"
	if profile != nil {
		personaType = profile.PersonaType
	}
	_ = s.repo.AppendHistory(&domain.PersonaHistory{
		SnapshotID:     uuid.New().String(),
		VaultID:        vaultID,
		PersonaType:    personaType,
		SnapshotData:   map[string]interface{}{"event": "reset"},
		SnapshotReason: "user_reset",
		CreatedAt:      time.Now(),
	})
	_ = s.repo.DeleteSignals(vaultID)
	_ = s.repo.DeleteScores(vaultID)
	_ = s.repo.DeleteInterests(vaultID)
	_ = s.repo.DeleteRecommendations(vaultID)
	return s.repo.DeleteHistory(vaultID)
}

// DeletePersonaData performs a full GDPR-style deletion
func (s *PersonaService) DeletePersonaData(vaultID string) error {
	return s.repo.DeleteAllPersonaData(vaultID)
}

// ExportPersona returns the full persona data bundle
func (s *PersonaService) ExportPersona(vaultID string) (*domain.PersonaExport, error) {
	settings, _ := s.repo.GetSettings(vaultID)
	if settings != nil && !settings.AllowExport {
		return nil, fmt.Errorf("persona: export is disabled by user settings")
	}
	profile, _ := s.repo.GetProfile(vaultID)
	signals, _ := s.repo.GetSignals(vaultID)
	scores, _ := s.repo.GetScores(vaultID)
	interests, _ := s.repo.GetInterests(vaultID)
	recs, _ := s.repo.GetRecommendations(vaultID)
	history, _ := s.repo.GetHistory(vaultID)

	return &domain.PersonaExport{
		VaultID:         vaultID,
		ExportedAt:      time.Now(),
		Profile:         profile,
		Signals:         signals,
		Scores:          scores,
		Interests:       interests,
		Recommendations: recs,
		Settings:        settings,
		History:         history,
	}, nil
}

// ============================================================
// Query Operations
// ============================================================

func (s *PersonaService) GetProfile(vaultID string) (*domain.PersonaProfile, error) {
	return s.repo.GetProfile(vaultID)
}

func (s *PersonaService) GetRecommendations(vaultID string) ([]*domain.PersonaRecommendation, error) {
	return s.repo.GetRecommendations(vaultID)
}

func (s *PersonaService) GetScores(vaultID string) ([]*domain.PersonaScore, error) {
	return s.repo.GetScores(vaultID)
}

func (s *PersonaService) GetInterests(vaultID string) ([]*domain.PersonaInterest, error) {
	return s.repo.GetInterests(vaultID)
}

func (s *PersonaService) GetHistory(vaultID string) ([]*domain.PersonaHistory, error) {
	return s.repo.GetHistory(vaultID)
}
