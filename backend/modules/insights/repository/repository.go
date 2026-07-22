package repository

import (
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/diablovocado/declutr/modules/insights/domain"
)

// InsightsRepository defines the persistence contract for timeline events, insights, and milestones
type InsightsRepository interface {
	// Timeline Events
	AddTimelineEvent(event *domain.TimelineEvent) error
	GetTimeline(vaultID string, filter *domain.TimelineFilter) ([]*domain.TimelineEvent, error)
	GetTimelineGroups(vaultID string) ([]*domain.TimelineGroup, error)

	// Insights
	AddInsight(insight *domain.KnowledgeInsight) error
	GetActiveInsights(vaultID string) ([]*domain.KnowledgeInsight, error)
	DismissInsight(insightID string) error

	// Milestones
	AddMilestone(milestone *domain.Milestone) error
	GetMilestones(vaultID string) ([]*domain.Milestone, error)

	// Preferences
	GetPreferences(vaultID string) (*domain.InsightPreferences, error)
	UpdatePreferences(prefs *domain.InsightPreferences) error

	// Deletion
	ClearAllData(vaultID string) error
}

// InMemoryInsightsRepository is a thread-safe in-memory store
type InMemoryInsightsRepository struct {
	mu          sync.RWMutex
	events      map[string][]*domain.TimelineEvent   // vaultID -> events
	groups      map[string][]*domain.TimelineGroup   // vaultID -> groups
	insights    map[string][]*domain.KnowledgeInsight// vaultID -> insights
	milestones  map[string][]*domain.Milestone       // vaultID -> milestones
	preferences map[string]*domain.InsightPreferences// vaultID -> prefs
}

// NewInMemoryInsightsRepository creates a new in-memory insights repository
func NewInMemoryInsightsRepository() *InMemoryInsightsRepository {
	return &InMemoryInsightsRepository{
		events:      make(map[string][]*domain.TimelineEvent),
		groups:      make(map[string][]*domain.TimelineGroup),
		insights:    make(map[string][]*domain.KnowledgeInsight),
		milestones:  make(map[string][]*domain.Milestone),
		preferences: make(map[string]*domain.InsightPreferences),
	}
}

// --- Timeline Events ---

func (r *InMemoryInsightsRepository) AddTimelineEvent(event *domain.TimelineEvent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	event.UpdatedAt = time.Now()
	r.events[event.VaultID] = append(r.events[event.VaultID], event)
	return nil
}

func (r *InMemoryInsightsRepository) GetTimeline(vaultID string, filter *domain.TimelineFilter) ([]*domain.TimelineEvent, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	items, ok := r.events[vaultID]
	if !ok || len(items) == 0 {
		items = defaultSampleTimelineEvents(vaultID)
		r.events[vaultID] = items
	}

	var result []*domain.TimelineEvent
	for _, ev := range items {
		if filter != nil {
			if filter.EventType != "" && ev.EventType != filter.EventType {
				continue
			}
			if filter.DateFrom != nil && ev.EventTimestamp.Before(*filter.DateFrom) {
				continue
			}
			if filter.DateTo != nil && ev.EventTimestamp.After(*filter.DateTo) {
				continue
			}
		}
		result = append(result, ev)
	}

	// Sort chronologically descending (newest first)
	sort.Slice(result, func(i, j int) bool {
		return result[i].EventTimestamp.After(result[j].EventTimestamp)
	})

	return result, nil
}

func (r *InMemoryInsightsRepository) GetTimelineGroups(vaultID string) ([]*domain.TimelineGroup, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	groups := r.groups[vaultID]
	if len(groups) == 0 {
		return defaultSampleGroups(vaultID), nil
	}
	return groups, nil
}

// --- Insights ---

func (r *InMemoryInsightsRepository) AddInsight(insight *domain.KnowledgeInsight) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	insight.UpdatedAt = time.Now()
	r.insights[insight.VaultID] = append(r.insights[insight.VaultID], insight)
	return nil
}

func (r *InMemoryInsightsRepository) GetActiveInsights(vaultID string) ([]*domain.KnowledgeInsight, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	items, ok := r.insights[vaultID]
	if !ok || len(items) == 0 {
		items = defaultSampleInsights(vaultID)
		r.insights[vaultID] = items
	}

	var result []*domain.KnowledgeInsight
	for _, ins := range items {
		if !ins.IsDismissed {
			result = append(result, ins)
		}
	}
	return result, nil
}

func (r *InMemoryInsightsRepository) DismissInsight(insightID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, list := range r.insights {
		for _, ins := range list {
			if ins.InsightID == insightID {
				ins.IsDismissed = true
				ins.UpdatedAt = time.Now()
				return nil
			}
		}
	}
	return fmt.Errorf("insight %s not found", insightID)
}

// --- Milestones ---

func (r *InMemoryInsightsRepository) AddMilestone(milestone *domain.Milestone) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.milestones[milestone.VaultID] = append(r.milestones[milestone.VaultID], milestone)
	return nil
}

func (r *InMemoryInsightsRepository) GetMilestones(vaultID string) ([]*domain.Milestone, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	items := r.milestones[vaultID]
	if len(items) == 0 {
		return defaultSampleMilestones(vaultID), nil
	}
	return items, nil
}

// --- Preferences ---

func (r *InMemoryInsightsRepository) GetPreferences(vaultID string) (*domain.InsightPreferences, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if p, ok := r.preferences[vaultID]; ok {
		return p, nil
	}
	return &domain.InsightPreferences{
		PreferenceID:  "pref-insights-default",
		VaultID:       vaultID,
		EnabledTypes:  []string{"EXPIRATION_WARNING", "RECURRING_EXPENSE", "FREQUENT_PLACE", "IMPORTANT_DOC", "MISSING_DOC", "INACTIVE_PROJECT"},
		MinConfidence: 0.6,
		AutoRefresh:   true,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}, nil
}

func (r *InMemoryInsightsRepository) UpdatePreferences(prefs *domain.InsightPreferences) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	prefs.UpdatedAt = time.Now()
	r.preferences[prefs.VaultID] = prefs
	return nil
}

func (r *InMemoryInsightsRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.events, vaultID)
	delete(r.groups, vaultID)
	delete(r.insights, vaultID)
	delete(r.milestones, vaultID)
	delete(r.preferences, vaultID)
	return nil
}

// ============================================================
// Default Sample Data Generators
// ============================================================

func defaultSampleTimelineEvents(vaultID string) []*domain.TimelineEvent {
	now := time.Now()
	return []*domain.TimelineEvent{
		{
			EventID: "evt-001", VaultID: vaultID, EventType: domain.EventTravel,
			Title: "Japan Vacation 2025 Flight Booking", Summary: "Flight ticket and hotel reservations filed for Tokyo trip.",
			EventTimestamp: now.Add(-30 * 24 * time.Hour), Importance: 0.88, Confidence: 0.95,
			RelatedAssets: []string{"asset-passport-001"}, RelatedEntities: []string{"Tokyo", "Japan"}, RelatedContexts: []string{"Japan Vacation"},
			GeneratedBy: "SYSTEM", CreatedAt: now.Add(-30 * 24 * time.Hour), UpdatedAt: now,
		},
		{
			EventID: "evt-002", VaultID: vaultID, EventType: domain.EventEducation,
			Title: "PhD Thesis Chapter 4 Completed", Summary: "Neural networks benchmark draft finalized.",
			EventTimestamp: now.Add(-15 * 24 * time.Hour), Importance: 0.84, Confidence: 0.90,
			RelatedAssets: []string{"asset-thesis-002"}, RelatedEntities: []string{"PyTorch", "Neural Networks"}, RelatedContexts: []string{"PhD Thesis"},
			GeneratedBy: "SYSTEM", CreatedAt: now.Add(-15 * 24 * time.Hour), UpdatedAt: now,
		},
		{
			EventID: "evt-003", VaultID: vaultID, EventType: domain.EventMedical,
			Title: "Cardiology Visit with Dr. Sharma", Summary: "Prescription renewed and ECG report filed.",
			EventTimestamp: now.Add(-10 * 24 * time.Hour), Importance: 0.79, Confidence: 0.92,
			RelatedAssets: []string{"asset-medical-003"}, RelatedEntities: []string{"Dr. Sharma", "Cardiology"}, RelatedContexts: []string{"Medical Treatment"},
			GeneratedBy: "SYSTEM", CreatedAt: now.Add(-10 * 24 * time.Hour), UpdatedAt: now,
		},
		{
			EventID: "evt-004", VaultID: vaultID, EventType: domain.EventFinancial,
			Title: "Annual Tax Return Filed 2024", Summary: "Form 1040 filed with IRS receipts.",
			EventTimestamp: now.Add(-120 * 24 * time.Hour), Importance: 0.61, Confidence: 0.85,
			RelatedAssets: []string{"asset-tax-004"}, RelatedEntities: []string{"IRS", "Form 1040"}, RelatedContexts: []string{"Tax Filing"},
			GeneratedBy: "SYSTEM", CreatedAt: now.Add(-120 * 24 * time.Hour), UpdatedAt: now,
		},
	}
}

func defaultSampleGroups(vaultID string) []*domain.TimelineGroup {
	now := time.Now()
	t1 := now.Add(-60 * 24 * time.Hour)
	t2 := now.Add(-20 * 24 * time.Hour)
	return []*domain.TimelineGroup{
		{
			GroupID: "grp-japan", VaultID: vaultID, GroupName: "Japan Travel Timeline 2025", GroupType: "TRAVEL",
			EventIDs: []string{"evt-001"}, StartDate: &t1, EndDate: &t2, CreatedAt: now,
		},
	}
}

func defaultSampleInsights(vaultID string) []*domain.KnowledgeInsight {
	now := time.Now()
	return []*domain.KnowledgeInsight{
		{
			InsightID: "ins-001", VaultID: vaultID, InsightType: domain.InsightExpirationWarning,
			Title: "Passport Renewal Needed Soon", Summary: "Your US Passport expires in 65 days. Renewal recommended before upcoming travel.",
			WhyGenerated: "Passport expiration date detected in document 'Japanese Visa & Passport Scan' (expires Sep 2025).",
			Evidence: []string{"Asset: Japanese Visa & Passport Scan", "Expiration Date: 2025-09-25"},
			RelatedAssets: []string{"asset-passport-001"}, RelatedEntities: []string{"Passport"}, Importance: 0.95, Confidence: 0.98, IsDismissed: false, CreatedAt: now, UpdatedAt: now,
		},
		{
			InsightID: "ins-002", VaultID: vaultID, InsightType: domain.InsightRecurringExpense,
			Title: "Monthly Subscription Pattern Detected", Summary: "Atorvastatin 20mg medication refill occurs every 30 days.",
			WhyGenerated: "Cardiology consultation notes indicate 30-day recurring prescription cycle with Dr. Sharma.",
			Evidence: []string{"Prescription: Atorvastatin 20mg", "Cycle: 30 days"},
			RelatedAssets: []string{"asset-medical-003"}, RelatedEntities: []string{"Dr. Sharma"}, Importance: 0.78, Confidence: 0.90, IsDismissed: false, CreatedAt: now, UpdatedAt: now,
		},
		{
			InsightID: "ins-003", VaultID: vaultID, InsightType: domain.InsightFrequentPlace,
			Title: "Top Travel Destination: Tokyo, Japan", Summary: "Tokyo is your most referenced travel location across 6 vault documents.",
			WhyGenerated: "Location entity 'Tokyo' matched across flight bookings, hotel receipts, and itineraries.",
			Evidence: []string{"Entities: Tokyo, Japan", "Document count: 6"},
			RelatedEntities: []string{"Tokyo", "Japan"}, Importance: 0.72, Confidence: 0.88, IsDismissed: false, CreatedAt: now, UpdatedAt: now,
		},
	}
}

func defaultSampleMilestones(vaultID string) []*domain.Milestone {
	now := time.Now()
	dueDate := now.Add(65 * 24 * time.Hour)
	return []*domain.Milestone{
		{
			MilestoneID: "ms-001", VaultID: vaultID, MilestoneType: domain.MilestonePassportExp,
			Title: "US Passport Renewal Due", Status: domain.StatusUpcoming, DueDate: &dueDate,
			RelatedAssetID: "asset-passport-001", Importance: 0.95, CreatedAt: now,
		},
		{
			MilestoneID: "ms-002", VaultID: vaultID, MilestoneType: domain.MilestoneTaxFiled,
			Title: "Tax Return Filing 2024 Completed", Status: domain.StatusCompleted,
			RelatedAssetID: "asset-tax-004", Importance: 0.80, CreatedAt: now.Add(-120 * 24 * time.Hour),
		},
	}
}
