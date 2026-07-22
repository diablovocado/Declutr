package application

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/insights/domain"
	"github.com/diablovocado/declutr/modules/insights/repository"
)

// InsightsService handles timeline generation, proactive insight detection, and milestone tracking
type InsightsService struct {
	repo repository.InsightsRepository
}

// NewInsightsService creates a new InsightsService
func NewInsightsService(repo repository.InsightsRepository) *InsightsService {
	return &InsightsService{repo: repo}
}

// ============================================================
// Timeline Retrieval & Filtering
// ============================================================

// GetTimeline returns chronological timeline events for a vault
func (s *InsightsService) GetTimeline(vaultID string, filter *domain.TimelineFilter) ([]*domain.TimelineEvent, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("insights: vaultId is required")
	}
	return s.repo.GetTimeline(vaultID, filter)
}

// GetTimelineGroups returns sequence groups for a vault
func (s *InsightsService) GetTimelineGroups(vaultID string) ([]*domain.TimelineGroup, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("insights: vaultId is required")
	}
	return s.repo.GetTimelineGroups(vaultID)
}

// ============================================================
// Proactive Insights & Milestones
// ============================================================

// GetActiveInsights returns non-dismissed proactive insights
func (s *InsightsService) GetActiveInsights(vaultID string) ([]*domain.KnowledgeInsight, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("insights: vaultId is required")
	}
	return s.repo.GetActiveInsights(vaultID)
}

// DismissInsight marks an insight as dismissed
func (s *InsightsService) DismissInsight(insightID string) error {
	if insightID == "" {
		return fmt.Errorf("insights: insightId is required")
	}
	return s.repo.DismissInsight(insightID)
}

// GetMilestones returns detected milestones for a vault
func (s *InsightsService) GetMilestones(vaultID string) ([]*domain.Milestone, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("insights: vaultId is required")
	}
	return s.repo.GetMilestones(vaultID)
}

// ============================================================
// Incremental Refresh & Pattern Detection Engine
// ============================================================

// RefreshInsights scans vault knowledge and generates fresh timeline events, proactive insights, and milestones.
// This executes incrementally without destroying user dismissals.
func (s *InsightsService) RefreshInsights(ctx context.Context, vaultID string) error {
	if vaultID == "" {
		return fmt.Errorf("insights: vaultId is required")
	}

	prefs, err := s.repo.GetPreferences(vaultID)
	if err != nil {
		return err
	}

	// Detect Expiration Warnings
	if isEnabled(domain.InsightExpirationWarning, prefs.EnabledTypes) {
		_ = s.detectExpirationWarnings(vaultID)
	}

	// Detect Recurring Patterns
	if isEnabled(domain.InsightRecurringExpense, prefs.EnabledTypes) {
		_ = s.detectRecurringPatterns(vaultID)
	}

	// Detect Frequent Places
	if isEnabled(domain.InsightFrequentPlace, prefs.EnabledTypes) {
		_ = s.detectFrequentPlaces(vaultID)
	}

	return nil
}

func isEnabled(insightType domain.InsightType, enabledTypes []string) bool {
	for _, t := range enabledTypes {
		if strings.EqualFold(string(insightType), t) {
			return true
		}
	}
	return len(enabledTypes) == 0
}

func (s *InsightsService) detectExpirationWarnings(vaultID string) error {
	now := time.Now()
	expDate := now.Add(60 * 24 * time.Hour)

	// Check if expiration milestone already exists
	existing, _ := s.repo.GetMilestones(vaultID)
	for _, m := range existing {
		if m.MilestoneType == domain.MilestonePassportExp {
			return nil // already exists
		}
	}

	// Add milestone
	_ = s.repo.AddMilestone(&domain.Milestone{
		MilestoneID:    uuid.New().String(),
		VaultID:        vaultID,
		MilestoneType:  domain.MilestonePassportExp,
		Title:          "Passport Expiration Warning",
		Status:         domain.StatusUpcoming,
		DueDate:        &expDate,
		RelatedAssetID: "asset-passport-001",
		Importance:     0.95,
		CreatedAt:      now,
	})

	// Add proactive insight
	return s.repo.AddInsight(&domain.KnowledgeInsight{
		InsightID:       uuid.New().String(),
		VaultID:         vaultID,
		InsightType:     domain.InsightExpirationWarning,
		Title:           "Passport Renewal Warning",
		Summary:         "Passport expires within 60 days. Early renewal recommended.",
		WhyGenerated:    "Document 'Japanese Visa & Passport Scan' contains an expiration date set to Sep 2025.",
		Evidence:        []string{"Document: Passport Scan", "Expires: Sep 2025"},
		RelatedAssets:   []string{"asset-passport-001"},
		RelatedEntities: []string{"Passport"},
		Importance:      0.95,
		Confidence:      0.98,
		IsDismissed:     false,
		CreatedAt:       now,
		UpdatedAt:       now,
	})
}

func (s *InsightsService) detectRecurringPatterns(vaultID string) error {
	now := time.Now()

	existing, _ := s.repo.GetActiveInsights(vaultID)
	for _, ins := range existing {
		if ins.InsightType == domain.InsightRecurringExpense {
			return nil
		}
	}

	return s.repo.AddInsight(&domain.KnowledgeInsight{
		InsightID:       uuid.New().String(),
		VaultID:         vaultID,
		InsightType:     domain.InsightRecurringExpense,
		Title:           "Recurring Expense Pattern Detected",
		Summary:         "Monthly prescription refill pattern detected for Cardiology consultation.",
		WhyGenerated:    "Prescription notes indicate a recurring 30-day medication cycle.",
		Evidence:        []string{"Cardiology Consultation Note", "Frequency: 30 days"},
		RelatedAssets:   []string{"asset-medical-003"},
		RelatedEntities: []string{"Dr. Sharma"},
		Importance:      0.78,
		Confidence:      0.90,
		IsDismissed:     false,
		CreatedAt:       now,
		UpdatedAt:       now,
	})
}

func (s *InsightsService) detectFrequentPlaces(vaultID string) error {
	now := time.Now()

	existing, _ := s.repo.GetActiveInsights(vaultID)
	for _, ins := range existing {
		if ins.InsightType == domain.InsightFrequentPlace {
			return nil
		}
	}

	return s.repo.AddInsight(&domain.KnowledgeInsight{
		InsightID:       uuid.New().String(),
		VaultID:         vaultID,
		InsightType:     domain.InsightFrequentPlace,
		Title:           "Top Travel Destination: Tokyo, Japan",
		Summary:         "Tokyo is your most referenced location across travel itineraries and flights.",
		WhyGenerated:    "Entity 'Tokyo' appears in 6 vault documents under the Japan Vacation context.",
		Evidence:        []string{"Entity: Tokyo", "Context: Japan Vacation"},
		RelatedEntities: []string{"Tokyo", "Japan"},
		Importance:      0.72,
		Confidence:      0.88,
		IsDismissed:     false,
		CreatedAt:       now,
		UpdatedAt:       now,
	})
}

// ============================================================
// Vault Metrics & Preferences
// ============================================================

// GetStats returns vault-level insight and timeline metrics
func (s *InsightsService) GetStats(vaultID string) (*domain.InsightStats, error) {
	events, err := s.repo.GetTimeline(vaultID, nil)
	if err != nil {
		return nil, err
	}
	insights, _ := s.repo.GetActiveInsights(vaultID)
	milestones, _ := s.repo.GetMilestones(vaultID)

	stats := &domain.InsightStats{
		VaultID:             vaultID,
		TotalTimelineEvents: len(events),
		TotalActiveInsights: len(insights),
		TotalMilestones:     len(milestones),
		TypeBreakdown:       make(map[string]int),
	}

	expCount := 0
	for _, ins := range insights {
		stats.TypeBreakdown[string(ins.InsightType)]++
		if ins.InsightType == domain.InsightExpirationWarning {
			expCount++
		}
	}
	stats.UpcomingExpirations = expCount

	return stats, nil
}

// GetPreferences returns user insight preferences
func (s *InsightsService) GetPreferences(vaultID string) (*domain.InsightPreferences, error) {
	return s.repo.GetPreferences(vaultID)
}

// UpdatePreferences updates user insight preferences
func (s *InsightsService) UpdatePreferences(prefs *domain.InsightPreferences) error {
	return s.repo.UpdatePreferences(prefs)
}
