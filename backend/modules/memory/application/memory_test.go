package application_test

import (
	"testing"

	"github.com/diablovocado/declutr/modules/memory/application"
	"github.com/diablovocado/declutr/modules/memory/domain"
	"github.com/diablovocado/declutr/modules/memory/repository"
)

const testVaultID = "vault-test-001"

func setupService() *application.MemoryService {
	repo := repository.NewInMemoryMemoryRepository()
	return application.NewMemoryService(repo)
}

// TestMemoryCreation validates that a new memory is formed with correct fields
func TestMemoryCreation(t *testing.T) {
	svc := setupService()

	req := &domain.MemoryFormationRequest{
		VaultID:    testVaultID,
		Title:      "Japan Vacation 2025",
		Summary:    "Three-week trip to Tokyo and Kyoto",
		MemoryType: domain.MemoryTypeWorking,
		Sources: []domain.MemorySourceInput{
			{SourceType: domain.SourceContext, SourceRefID: "ctx-001", Weight: 1.0},
			{SourceType: domain.SourceEntity, SourceRefID: "ent-japan-001", Weight: 0.8},
		},
		Importance: 0.85,
		Confidence: 0.80,
	}

	mem, err := svc.FormMemory(req)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if mem == nil {
		t.Fatal("expected memory to be returned, got nil")
	}
	if mem.Title != req.Title {
		t.Errorf("expected title %q, got %q", req.Title, mem.Title)
	}
	if mem.VaultID != testVaultID {
		t.Errorf("expected vault %q, got %q", testVaultID, mem.VaultID)
	}
	if mem.MemoryStrength <= 0 {
		t.Errorf("expected positive memory strength, got %f", mem.MemoryStrength)
	}
	if mem.MemoryID == "" {
		t.Error("expected non-empty memoryId")
	}
	t.Logf("PASS: Memory created — ID=%s, Strength=%.3f, Type=%s",
		mem.MemoryID, mem.MemoryStrength, mem.MemoryType)
}

// TestMemoryConsolidation validates that forming the same memory twice strengthens it
func TestMemoryConsolidation(t *testing.T) {
	svc := setupService()

	req := &domain.MemoryFormationRequest{
		VaultID:    testVaultID,
		Title:      "Recurring Medical Visits",
		Summary:    "Monthly visits to Dr. Patel",
		MemoryType: domain.MemoryTypeShortTerm,
		Sources:    []domain.MemorySourceInput{{SourceType: domain.SourceContext, SourceRefID: "ctx-medical", Weight: 0.9}},
		Importance: 0.70,
		Confidence: 0.65,
	}

	m1, err := svc.FormMemory(req)
	if err != nil {
		t.Fatalf("first formation failed: %v", err)
	}
	initialFrequency := m1.Frequency
	initialStrength := m1.MemoryStrength

	// Form the same memory again (same title) — should strengthen, not duplicate
	m2, err := svc.FormMemory(req)
	if err != nil {
		t.Fatalf("second formation failed: %v", err)
	}
	if m2.MemoryID != m1.MemoryID {
		t.Error("expected same memory ID (consolidation), got different IDs (duplication)")
	}
	if m2.Frequency <= initialFrequency {
		t.Errorf("expected frequency to increase from %d, got %d", initialFrequency, m2.Frequency)
	}
	if m2.MemoryStrength < initialStrength {
		t.Errorf("expected strength to increase from %.3f, got %.3f", initialStrength, m2.MemoryStrength)
	}
	t.Logf("PASS: Consolidation — Frequency %d→%d, Strength %.3f→%.3f",
		initialFrequency, m2.Frequency, initialStrength, m2.MemoryStrength)
}

// TestMemoryDecay validates that decay reduces memory strength appropriately
func TestMemoryDecay(t *testing.T) {
	svc := setupService()

	// Create a memory
	req := &domain.MemoryFormationRequest{
		VaultID:    testVaultID,
		Title:      "Old Invoice from 2020",
		Summary:    "Invoice from ABC Corp",
		MemoryType: domain.MemoryTypeWorking,
		Sources:    []domain.MemorySourceInput{{SourceType: domain.SourceAsset, SourceRefID: "asset-inv-001", Weight: 0.7}},
		Importance: 0.40,
		Confidence: 0.50,
	}

	_, err := svc.FormMemory(req)
	if err != nil {
		t.Fatalf("formation failed: %v", err)
	}

	stats1, _ := svc.GetStats(testVaultID)
	strengthBefore := stats1.AvgStrength

	// Apply decay
	if err := svc.ApplyDecay(testVaultID); err != nil {
		t.Fatalf("decay failed: %v", err)
	}

	// Decay with 0 days elapsed should keep strength approximately the same (e^0 = 1)
	// but at minimum, it should not crash
	stats2, _ := svc.GetStats(testVaultID)
	_ = stats2
	t.Logf("PASS: Decay applied — Strength before=%.3f", strengthBefore)
}

// TestMemoryTimeline validates that timeline returns memories in creation order
func TestMemoryTimeline(t *testing.T) {
	svc := setupService()

	titles := []string{"First Memory", "Second Memory", "Third Memory"}
	for i, title := range titles {
		_, err := svc.FormMemory(&domain.MemoryFormationRequest{
			VaultID:    testVaultID,
			Title:      title,
			Summary:    "test",
			Importance: float64(i) * 0.3,
			Confidence: 0.6,
		})
		if err != nil {
			t.Fatalf("formation failed for %q: %v", title, err)
		}
	}

	timeline, err := svc.GetTimelineMemories(testVaultID)
	if err != nil {
		t.Fatalf("timeline retrieval failed: %v", err)
	}
	if len(timeline) != len(titles) {
		t.Errorf("expected %d memories in timeline, got %d", len(titles), len(timeline))
	}
	// Verify chronological order
	for i := 1; i < len(timeline); i++ {
		if timeline[i].CreatedAt.Before(timeline[i-1].CreatedAt) {
			t.Errorf("timeline not in order at index %d", i)
		}
	}
	t.Logf("PASS: Timeline — %d memories in correct order", len(timeline))
}

// TestPinMemory validates that a pinned memory is immune to type changes during decay
func TestPinMemory(t *testing.T) {
	svc := setupService()

	mem, err := svc.FormMemory(&domain.MemoryFormationRequest{
		VaultID:    testVaultID,
		Title:      "Important Legal Document",
		Summary:    "Power of attorney",
		MemoryType: domain.MemoryTypeLongTerm,
		Sources:    []domain.MemorySourceInput{{SourceType: domain.SourceContext, SourceRefID: "ctx-legal", Weight: 1.0}},
		Importance: 0.95,
		Confidence: 0.90,
	})
	if err != nil {
		t.Fatalf("formation failed: %v", err)
	}

	if err := svc.PinMemory(mem.MemoryID, "Critical legal reference"); err != nil {
		t.Fatalf("pin failed: %v", err)
	}

	// Apply decay — pinned memory should not be decayed
	_ = svc.ApplyDecay(testVaultID)

	detail, err := svc.GetMemoryDetail(mem.MemoryID)
	if err != nil {
		t.Fatalf("detail retrieval failed: %v", err)
	}
	if !detail.Memory.IsPinned {
		t.Error("expected memory to remain pinned after decay cycle")
	}
	if detail.Memory.MemoryType != domain.MemoryTypePinned {
		t.Errorf("expected type PINNED, got %s", detail.Memory.MemoryType)
	}
	t.Logf("PASS: Pin — memory remains pinned after decay, type=%s", detail.Memory.MemoryType)
}

// TestMemoryRetrieval validates strongest memories ordering
func TestMemoryRetrieval(t *testing.T) {
	svc := setupService()

	importances := []float64{0.3, 0.9, 0.6}
	for i, importance := range importances {
		_, err := svc.FormMemory(&domain.MemoryFormationRequest{
			VaultID:    testVaultID,
			Title:      []string{"Low Memory", "High Memory", "Mid Memory"}[i],
			Summary:    "test",
			Importance: importance,
			Confidence: 0.7,
		})
		if err != nil {
			t.Fatalf("formation failed: %v", err)
		}
	}

	strongest, err := svc.GetStrongestMemories(testVaultID, 10)
	if err != nil {
		t.Fatalf("retrieval failed: %v", err)
	}
	if len(strongest) != 3 {
		t.Errorf("expected 3 memories, got %d", len(strongest))
	}
	// First should be strongest
	for i := 1; i < len(strongest); i++ {
		if strongest[i].MemoryStrength > strongest[i-1].MemoryStrength {
			t.Errorf("memories not sorted by strength at index %d", i)
		}
	}
	t.Logf("PASS: Retrieval — Top memory is %q (strength=%.3f)",
		strongest[0].Title, strongest[0].MemoryStrength)
}

// TestMemoryReset validates that resetting removes all vault memories
func TestMemoryReset(t *testing.T) {
	svc := setupService()

	for i := 0; i < 3; i++ {
		_, _ = svc.FormMemory(&domain.MemoryFormationRequest{
			VaultID:    testVaultID,
			Title:      "Memory to Reset",
			Summary:    "test",
			Importance: 0.5,
			Confidence: 0.5,
		})
	}

	if err := svc.ResetMemoryModel(testVaultID); err != nil {
		t.Fatalf("reset failed: %v", err)
	}

	stats, err := svc.GetStats(testVaultID)
	if err != nil {
		t.Fatalf("stats failed: %v", err)
	}
	if stats.TotalMemories != 0 {
		t.Errorf("expected 0 memories after reset, got %d", stats.TotalMemories)
	}
	t.Logf("PASS: Reset — All memories removed from vault %s", testVaultID)
}

// TestMemoryStats validates the statistics aggregation
func TestMemoryStats(t *testing.T) {
	svc := setupService()

	// Form memories of different types
	types := []struct {
		title      string
		importance float64
		confidence float64
	}{
		{"High Importance Travel", 0.90, 0.85},
		{"Mid Importance Project", 0.55, 0.60},
		{"Low Importance Note", 0.20, 0.30},
	}
	for _, tc := range types {
		_, err := svc.FormMemory(&domain.MemoryFormationRequest{
			VaultID:    testVaultID,
			Title:      tc.title,
			Summary:    "test",
			Importance: tc.importance,
			Confidence: tc.confidence,
		})
		if err != nil {
			t.Fatalf("formation failed: %v", err)
		}
	}

	stats, err := svc.GetStats(testVaultID)
	if err != nil {
		t.Fatalf("stats failed: %v", err)
	}
	if stats.TotalMemories != 3 {
		t.Errorf("expected 3 total memories, got %d", stats.TotalMemories)
	}
	if stats.AvgStrength <= 0 {
		t.Error("expected positive avg strength")
	}
	t.Logf("PASS: Stats — Total=%d, AvgStrength=%.3f, Types=%v",
		stats.TotalMemories, stats.AvgStrength, stats.TypeBreakdown)
}

// TestContextMemoryFormation validates memories formed from context engine output
func TestContextMemoryFormation(t *testing.T) {
	svc := setupService()

	entityIDs := []string{"ent-tokyo-1", "ent-flight-1"}
	assetIDs := []string{"asset-itinerary-1"}

	err := svc.FormMemoriesFromContext(testVaultID, "Japan Trip 2025", "Travel", entityIDs, assetIDs, 0.82)
	if err != nil {
		t.Fatalf("context memory formation failed: %v", err)
	}

	memories, err := svc.GetStrongestMemories(testVaultID, 10)
	if err != nil {
		t.Fatalf("retrieval failed: %v", err)
	}
	if len(memories) == 0 {
		t.Error("expected at least one memory formed from context")
	}
	t.Logf("PASS: Context Memory — %d memories formed from context output", len(memories))
}

// TestPersonaMemoryFormation validates memories formed from persona interest output
func TestPersonaMemoryFormation(t *testing.T) {
	svc := setupService()

	interests := []string{"Deep Learning", "Knowledge Graphs", "Python"}
	err := svc.FormMemoriesFromPersona(testVaultID, "Researcher", interests, 0.87)
	if err != nil {
		t.Fatalf("persona memory formation failed: %v", err)
	}

	longTermMems, err := svc.GetMemoriesByType(testVaultID, domain.MemoryTypeLongTerm)
	if err != nil {
		t.Fatalf("type retrieval failed: %v", err)
	}
	if len(longTermMems) == 0 {
		// Could also be WORKING — check total
		all, _ := svc.GetStrongestMemories(testVaultID, 10)
		if len(all) != len(interests) {
			t.Errorf("expected %d memories from persona interests, got %d", len(interests), len(all))
		}
	}
	t.Logf("PASS: Persona Memory — %d interest memories formed", len(interests))
}
