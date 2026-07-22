package application_test

import (
	"context"
	"testing"

	aiProviders "github.com/diablovocado/declutr/modules/ai/providers"
	"github.com/diablovocado/declutr/modules/context/application"
	"github.com/diablovocado/declutr/modules/context/repository"
)

func TestContextAndIntentEngine(t *testing.T) {
	ctx := context.Background()
	repo := repository.NewInMemoryContextRepository()
	provider := aiProviders.NewMockProvider()
	service := application.NewContextService(repo, provider)

	testCases := []struct {
		name               string
		assetID            string
		expectedIntent     string
		expectedContext    string
		expectedEventType  string
	}{
		{
			name:              "Travel Context & Intent",
			assetID:           "flight_japan_2026.pdf",
			expectedIntent:    "Travel",
			expectedContext:   "Japan Vacation",
			expectedEventType: "Flight",
		},
		{
			name:              "Medical Case Context & Intent",
			assetID:           "hospital_mri_report.pdf",
			expectedIntent:    "Health",
			expectedContext:   "Medical Treatment",
			expectedEventType: "Hospital Visit",
		},
		{
			name:              "Invoices and Purchase Context",
			assetID:           "receipt_car_downpayment.pdf",
			expectedIntent:    "Finance",
			expectedContext:   "Buying a Car",
			expectedEventType: "Purchase",
		},
		{
			name:              "Education Admission Context",
			assetID:           "university_admission_stanford.pdf",
			expectedIntent:    "Education",
			expectedContext:   "University Admission",
			expectedEventType: "Interview",
		},
		{
			name:              "Legal & Visa Process Context",
			assetID:           "consulate_visa_appointment.pdf",
			expectedIntent:    "Legal",
			expectedContext:   "Visa Application",
			expectedEventType: "Contract Signing",
		},
		{
			name:              "Project Notes Context",
			assetID:           "project_alpha_architecture_notes.md",
			expectedIntent:    "Knowledge",
			expectedContext:   "Project Alpha",
			expectedEventType: "Meeting",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			vaultID := "v_test_123"

			err := service.PredictIntentAndContext(ctx, vaultID, tc.assetID)
			if err != nil {
				t.Fatalf("PredictIntentAndContext failed for %s: %v", tc.assetID, err)
			}

			// Verify Intent Prediction
			intent, err := service.GetIntentForAsset(ctx, vaultID, tc.assetID)
			if err != nil {
				t.Fatalf("Failed to retrieve intent for %s: %v", tc.assetID, err)
			}
			if intent.IntentTypeName != tc.expectedIntent {
				t.Errorf("Expected intent %s, got %s", tc.expectedIntent, intent.IntentTypeName)
			}
			if intent.ConfidenceScore <= 0 {
				t.Errorf("Expected confidence score > 0, got %f", intent.ConfidenceScore)
			}
			if intent.Evidence == "" || intent.Reasoning == "" {
				t.Errorf("Expected non-empty evidence and reasoning")
			}

			// Verify Context & Events
			contexts, err := service.GetContexts(ctx, vaultID, "", "")
			if err != nil {
				t.Fatalf("Failed to fetch contexts: %v", err)
			}
			if len(contexts) == 0 {
				t.Fatalf("Expected contexts to be created, got 0")
			}

			// Verify detail view
			foundContext := false
			for _, c := range contexts {
				if c.Name == tc.expectedContext {
					foundContext = true
					detail, err := service.GetContextDetail(ctx, vaultID, c.ContextID)
					if err != nil {
						t.Fatalf("Failed to get context detail for %s: %v", c.ContextID, err)
					}
					if len(detail.Assets) == 0 {
						t.Errorf("Expected context assets in detail view")
					}
				}
			}
			if !foundContext {
				t.Errorf("Expected context %s not found in created contexts", tc.expectedContext)
			}
		})
	}

	// Verify Context Stats
	t.Run("Verify Context Statistics", func(t *testing.T) {
		stats, err := service.GetContextStats(ctx, "v_test_123")
		if err != nil {
			t.Fatalf("Failed to get context stats: %v", err)
		}

		if stats.TotalContexts == 0 {
			t.Errorf("Expected total contexts > 0")
		}
		if stats.TotalEvents == 0 {
			t.Errorf("Expected total events > 0")
		}
		if len(stats.IntentBreakdown) == 0 {
			t.Errorf("Expected intent breakdown to contain entries")
		}
	})
}
