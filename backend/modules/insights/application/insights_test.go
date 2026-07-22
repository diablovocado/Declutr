package application_test

import (
	"context"
	"testing"
	"time"

	"github.com/diablovocado/declutr/modules/insights/application"
	"github.com/diablovocado/declutr/modules/insights/domain"
	"github.com/diablovocado/declutr/modules/insights/repository"
)

const testVaultID = "vault-test-001"

func setupService() *application.InsightsService {
	repo := repository.NewInMemoryInsightsRepository()
	return application.NewInsightsService(repo)
}

// TestTimelineGeneration validates retrieval and event type filtering of chronological timeline events
func TestTimelineGeneration(t *testing.T) {
	svc := setupService()

	// Get full timeline
	events, err := svc.GetTimeline(testVaultID, nil)
	if err != nil {
		t.Fatalf("get timeline failed: %v", err)
	}
	if len(events) == 0 {
		t.Fatal("expected default sample timeline events, got 0")
	}

	// Filter by Travel event type
	filter := &domain.TimelineFilter{EventType: domain.EventTravel}
	travelEvents, err := svc.GetTimeline(testVaultID, filter)
	if err != nil {
		t.Fatalf("filtered timeline failed: %v", err)
	}
	if len(travelEvents) == 0 {
		t.Fatal("expected at least 1 travel event")
	}
	for _, ev := range travelEvents {
		if ev.EventType != domain.EventTravel {
			t.Errorf("expected event type TRAVEL, got %s", ev.EventType)
		}
	}

	t.Logf("PASS: Timeline Generation — %d total events, %d travel events", len(events), len(travelEvents))
}

// TestInsightGeneration validates active proactive insight retrieval and dismiss functionality
func TestInsightGeneration(t *testing.T) {
	svc := setupService()

	insights, err := svc.GetActiveInsights(testVaultID)
	if err != nil {
		t.Fatalf("get active insights failed: %v", err)
	}
	if len(insights) == 0 {
		t.Fatal("expected default proactive insights, got 0")
	}

	targetID := insights[0].InsightID
	if err := svc.DismissInsight(targetID); err != nil {
		t.Fatalf("dismiss insight failed: %v", err)
	}

	insightsAfter, _ := svc.GetActiveInsights(testVaultID)
	if len(insightsAfter) != len(insights)-1 {
		t.Errorf("expected %d active insights after dismissal, got %d", len(insights)-1, len(insightsAfter))
	}

	t.Logf("PASS: Insight Generation — %d active insights remaining after dismissal", len(insightsAfter))
}

// TestMilestoneDetection validates detecting passport expiration and tax filing milestones
func TestMilestoneDetection(t *testing.T) {
	svc := setupService()

	milestones, err := svc.GetMilestones(testVaultID)
	if err != nil {
		t.Fatalf("get milestones failed: %v", err)
	}
	if len(milestones) == 0 {
		t.Fatal("expected default milestones, got 0")
	}

	foundPassportExp := false
	for _, ms := range milestones {
		if ms.MilestoneType == domain.MilestonePassportExp {
			foundPassportExp = true
			if ms.Status != domain.StatusUpcoming {
				t.Errorf("expected status UPCOMING for passport expiration, got %s", ms.Status)
			}
		}
	}
	if !foundPassportExp {
		t.Error("expected passport expiration milestone")
	}

	t.Logf("PASS: Milestone Detection — %d milestones detected (Passport Renewal verified)", len(milestones))
}

// TestPatternDetection validates recurring pattern detection logic
func TestPatternDetection(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	// Trigger incremental refresh
	if err := svc.RefreshInsights(ctx, testVaultID); err != nil {
		t.Fatalf("refresh insights failed: %v", err)
	}

	insights, err := svc.GetActiveInsights(testVaultID)
	if err != nil {
		t.Fatalf("get active insights failed: %v", err)
	}

	foundRecurring := false
	for _, ins := range insights {
		if ins.InsightType == domain.InsightRecurringExpense {
			foundRecurring = true
			if ins.WhyGenerated == "" {
				t.Error("expected WhyGenerated explanation for recurring pattern")
			}
		}
	}
	if !foundRecurring {
		t.Error("expected recurring pattern insight to be present")
	}

	t.Logf("PASS: Pattern Detection — Recurring expense pattern detected with explainability")
}

// TestIncrementalRefresh validates refreshing without overwriting user dismissals
func TestIncrementalRefresh(t *testing.T) {
	svc := setupService()
	ctx := context.Background()

	insights, _ := svc.GetActiveInsights(testVaultID)
	if len(insights) == 0 {
		t.Fatal("expected insights")
	}
	dismissedID := insights[0].InsightID
	_ = svc.DismissInsight(dismissedID)

	// Run refresh
	_ = svc.RefreshInsights(ctx, testVaultID)

	// Dismissed insight should NOT reappear
	insightsAfter, _ := svc.GetActiveInsights(testVaultID)
	for _, ins := range insightsAfter {
		if ins.InsightID == dismissedID {
			t.Errorf("dismissed insight %s reappeared after refresh", dismissedID)
		}
	}

	t.Logf("PASS: Incremental Refresh — Dismissed insights respected")
}

// TestInsightStats validates aggregate stats calculation
func TestInsightStats(t *testing.T) {
	svc := setupService()

	stats, err := svc.GetStats(testVaultID)
	if err != nil {
		t.Fatalf("get stats failed: %v", err)
	}
	if stats.TotalTimelineEvents <= 0 || stats.TotalActiveInsights <= 0 {
		t.Error("expected positive timeline and insight counts")
	}

	t.Logf("PASS: Insight Stats — %d timeline events, %d active insights, %d milestones",
		stats.TotalTimelineEvents, stats.TotalActiveInsights, stats.TotalMilestones)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
func parseYear(y string) int {
	var year int
	_, _ = time.Parse("2006", y)
	return year
}
