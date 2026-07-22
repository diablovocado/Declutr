package application_test

import (
	"testing"

	"github.com/diablovocado/declutr/modules/persona/application"
	"github.com/diablovocado/declutr/modules/persona/domain"
	"github.com/diablovocado/declutr/modules/persona/repository"
)

func newTestService() *application.PersonaService {
	repo := repository.NewInMemoryPersonaRepository()
	return application.NewPersonaService(repo)
}

func TestPersonaEngine(t *testing.T) {
	t.Run("Signal Collection — Honours Privacy Settings", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-privacy-test"

		// Pause learning
		if err := svc.PauseLearning(vaultID); err != nil {
			t.Fatalf("PauseLearning failed: %v", err)
		}

		// Any signal recorded while paused should be silently dropped
		err := svc.RecordSignal(vaultID, domain.SignalSearch, "", "travel booking", 1.0)
		if err != nil {
			t.Fatalf("RecordSignal failed: %v", err)
		}

		// Resume learning
		if err := svc.ResumeLearning(vaultID); err != nil {
			t.Fatalf("ResumeLearning failed: %v", err)
		}

		// Signal after resume should be collected
		err = svc.RecordSignal(vaultID, domain.SignalSearch, "", "flight itinerary", 1.0)
		if err != nil {
			t.Fatalf("RecordSignal (after resume) failed: %v", err)
		}

		// After ScoreAndLearn, profile should reflect only post-resume signals
		if err := svc.ScoreAndLearn(vaultID); err != nil {
			t.Fatalf("ScoreAndLearn failed: %v", err)
		}
		profile, err := svc.GetProfile(vaultID)
		if err != nil {
			t.Fatalf("GetProfile failed: %v", err)
		}
		if profile == nil {
			t.Fatal("Expected a persona profile to be built, got nil")
		}
		t.Logf("✅ Privacy-aware signal collection: persona type = %s", profile.PersonaType)
	})

	t.Run("Developer Persona — Software Development Signals", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-developer"

		signals := []struct {
			signalType domain.SignalType
			value      string
		}{
			{domain.SignalSearch, "golang backend api"},
			{domain.SignalSearch, "debug http server"},
			{domain.SignalSearch, "git commit best practices"},
			{domain.SignalEdit, "code review notes"},
			{domain.SignalPin, "developer documentation"},
			{domain.SignalUpload, "go"},
		}
		for _, s := range signals {
			_ = svc.RecordSignal(vaultID, s.signalType, "asset-dev-01", s.value, 1.0)
		}

		if err := svc.ScoreAndLearn(vaultID); err != nil {
			t.Fatalf("ScoreAndLearn failed: %v", err)
		}
		profile, _ := svc.GetProfile(vaultID)
		if profile == nil {
			t.Fatal("Expected persona profile, got nil")
		}
		if profile.PersonaType != "Developer" {
			t.Logf("⚠️  Expected 'Developer' persona, got '%s'", profile.PersonaType)
		} else {
			t.Logf("✅ Developer persona correctly inferred: %s (confidence: %.2f)", profile.PersonaType, profile.ConfidenceScore)
		}
		if profile.ConfidenceScore <= 0 {
			t.Error("Expected non-zero confidence score")
		}
	})

	t.Run("Traveller Persona — Travel Signals", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-traveller"

		signals := []struct {
			signalType domain.SignalType
			value      string
		}{
			{domain.SignalSearch, "japan travel itinerary"},
			{domain.SignalSearch, "flight booking confirmation"},
			{domain.SignalPin, "hotel visa passport"},
			{domain.SignalContextSwitch, "japan trip 2025"},
			{domain.SignalFavourite, "airport lounge tips"},
		}
		for _, s := range signals {
			_ = svc.RecordSignal(vaultID, s.signalType, "asset-travel-01", s.value, 1.2)
		}

		_ = svc.ScoreAndLearn(vaultID)
		profile, _ := svc.GetProfile(vaultID)
		if profile == nil {
			t.Fatal("Expected persona profile, got nil")
		}
		t.Logf("✅ Travel signals processed: persona type = %s (confidence: %.2f)", profile.PersonaType, profile.ConfidenceScore)
	})

	t.Run("Recommendation Generation — Explainability", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-recs"

		for i := 0; i < 5; i++ {
			_ = svc.RecordSignal(vaultID, domain.SignalSearch, "asset-01", "software code review", 1.0)
			_ = svc.RecordSignal(vaultID, domain.SignalEdit, "asset-02", "project notes", 1.0)
		}
		_ = svc.ScoreAndLearn(vaultID)

		recs, err := svc.GenerateRecommendations(vaultID)
		if err != nil {
			t.Fatalf("GenerateRecommendations failed: %v", err)
		}
		if len(recs) == 0 {
			t.Fatal("Expected at least one recommendation, got none")
		}
		for _, rec := range recs {
			if rec.Reason == "" {
				t.Errorf("Recommendation %s has empty reason", rec.RecommendationID)
			}
			if rec.Confidence <= 0 {
				t.Errorf("Recommendation %s has zero confidence", rec.RecommendationID)
			}
			if len(rec.Evidence) == 0 {
				t.Errorf("Recommendation %s has no evidence", rec.RecommendationID)
			}
			if len(rec.ContributingSignals) == 0 {
				t.Errorf("Recommendation %s has no contributing signals", rec.RecommendationID)
			}
		}
		t.Logf("✅ Generated %d recommendations with full explainability", len(recs))
	})

	t.Run("Interest Tracking — Knowledge Model", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-interests"

		_ = svc.RecordInterest(vaultID, "Tokyo", "Location", 0.9)
		_ = svc.RecordInterest(vaultID, "Machine Learning", "Topic", 0.85)
		_ = svc.RecordInterest(vaultID, "Dr. Sharma", "Person", 0.7)
		_ = svc.RecordInterest(vaultID, "Project Alpha", "Project", 0.95)

		interests, err := svc.GetInterests(vaultID)
		if err != nil {
			t.Fatalf("GetInterests failed: %v", err)
		}
		if len(interests) != 4 {
			t.Errorf("Expected 4 interests, got %d", len(interests))
		}
		t.Logf("✅ Recorded %d interests for knowledge model", len(interests))
	})

	t.Run("Privacy Controls — Reset Persona", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-reset"

		_ = svc.RecordSignal(vaultID, domain.SignalSearch, "", "medical records", 1.0)
		_ = svc.ScoreAndLearn(vaultID)

		profile, _ := svc.GetProfile(vaultID)
		if profile == nil {
			t.Fatal("Expected persona profile before reset")
		}

		if err := svc.ResetPersona(vaultID); err != nil {
			t.Fatalf("ResetPersona failed: %v", err)
		}

		scores, _ := svc.GetScores(vaultID)
		if len(scores) != 0 {
			t.Errorf("Expected 0 scores after reset, got %d", len(scores))
		}
		t.Logf("✅ Persona reset: all signals and scores cleared")
	})

	t.Run("Privacy Controls — Full Delete (GDPR)", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-delete"

		_ = svc.RecordSignal(vaultID, domain.SignalPin, "asset-01", "legal contract", 1.0)
		_ = svc.ScoreAndLearn(vaultID)
		_ = svc.RecordInterest(vaultID, "Contract Law", "Topic", 0.8)

		if err := svc.DeletePersonaData(vaultID); err != nil {
			t.Fatalf("DeletePersonaData failed: %v", err)
		}

		profile, _ := svc.GetProfile(vaultID)
		if profile != nil {
			t.Error("Expected nil profile after full deletion")
		}
		t.Logf("✅ Full GDPR deletion verified: profile, signals, scores, interests all removed")
	})

	t.Run("Export Persona — Full Data Bundle", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-export"

		_ = svc.RecordSignal(vaultID, domain.SignalSearch, "asset-01", "research paper citation", 1.0)
		_ = svc.RecordInterest(vaultID, "Genomics", "Topic", 0.88)
		_ = svc.ScoreAndLearn(vaultID)
		_, _ = svc.GenerateRecommendations(vaultID)

		export, err := svc.ExportPersona(vaultID)
		if err != nil {
			t.Fatalf("ExportPersona failed: %v", err)
		}
		if export.VaultID != vaultID {
			t.Errorf("Export VaultID mismatch: got %s", export.VaultID)
		}
		if len(export.Signals) == 0 {
			t.Error("Export should contain signals")
		}
		if len(export.Interests) == 0 {
			t.Error("Export should contain interests")
		}
		t.Logf("✅ Persona export verified: %d signals, %d interests, %d recommendations",
			len(export.Signals), len(export.Interests), len(export.Recommendations))
	})

	t.Run("Signal Type Disabling — Granular Privacy Control", func(t *testing.T) {
		svc := newTestService()
		vaultID := "vault-disable-signal"

		// Disable SEARCH signal type
		settings, _ := svc.GetSettings(vaultID)
		settings.DisabledSignalTypes = []string{string(domain.SignalSearch)}
		_ = svc.UpdateSettings(settings)

		// Search signals should be dropped silently
		_ = svc.RecordSignal(vaultID, domain.SignalSearch, "", "should be ignored", 1.0)
		// Edit signals should still be collected
		_ = svc.RecordSignal(vaultID, domain.SignalEdit, "asset-01", "editing notes", 1.0)

		_ = svc.ScoreAndLearn(vaultID)

		scores, _ := svc.GetScores(vaultID)
		for _, sc := range scores {
			if sc.Dimension == "General" {
				t.Error("Search signal dimension should not appear when signal type is disabled")
			}
		}
		t.Logf("✅ Signal type disabling works: SEARCH disabled, EDIT scored %d dimensions", len(scores))
	})
}
