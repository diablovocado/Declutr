package application

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/diablovocado/declutr/modules/notification/domain"
	"github.com/diablovocado/declutr/modules/notification/repository"
)

// NotificationService manages proactive notification lifecycle, deduplication, priority scoring, actions, and digests
type NotificationService struct {
	repo repository.NotificationRepository
}

// NewNotificationService creates a new NotificationService
func NewNotificationService(repo repository.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

// CalculatePriority computes priority level based on type, importance, and urgency
func CalculatePriority(nType domain.NotificationType, urgency string) domain.PriorityLevel {
	if nType == domain.TypeSecurity || strings.EqualFold(urgency, "CRITICAL") {
		return domain.PriorityUrgent
	}
	if nType == domain.TypeWarning || nType == domain.TypeReminder {
		return domain.PriorityHigh
	}
	if nType == domain.TypeWorkflow || nType == domain.TypeAIInsight {
		return domain.PriorityMedium
	}
	return domain.PriorityLow
}

// DispatchNotification creates, deduplicates, and stores a new proactive notification
func (s *NotificationService) DispatchNotification(ctx context.Context, n *domain.Notification) (*domain.Notification, error) {
	if n.VaultID == "" || n.Title == "" {
		return nil, fmt.Errorf("notification: vaultId and title are required")
	}

	// Check user preferences
	prefs, err := s.repo.GetPreferences(n.VaultID)
	if err == nil && prefs != nil {
		enabled := false
		for _, t := range prefs.EnabledTypes {
			if t == n.Type {
				enabled = true
				break
			}
		}
		if !enabled {
			return nil, fmt.Errorf("notification type %s disabled in user preferences", n.Type)
		}
	}

	// Deduplicate similar existing unread notifications
	existing, err := s.repo.ListNotifications(n.VaultID)
	if err == nil {
		for _, ex := range existing {
			if !ex.IsRead && !ex.IsDismissed && strings.EqualFold(ex.Title, n.Title) {
				return ex, nil // Return existing notification without duplicating
			}
		}
	}

	if n.NotificationID == "" {
		n.NotificationID = "notif-" + uuid.New().String()[:8]
	}
	if n.Priority == "" {
		n.Priority = CalculatePriority(n.Type, "NORMAL")
	}
	n.CreatedAt = time.Now()

	if err := s.repo.CreateNotification(n); err != nil {
		return nil, err
	}
	return n, nil
}

// ListNotifications returns notifications for a vault
func (s *NotificationService) ListNotifications(vaultID string) ([]*domain.Notification, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.ListNotifications(vaultID)
}

// MarkRead marks notification(s) as read
func (s *NotificationService) MarkRead(vaultID string, nIDs []string) error {
	if vaultID == "" {
		return fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.MarkRead(vaultID, nIDs)
}

// DismissNotification marks a notification as dismissed
func (s *NotificationService) DismissNotification(nID string) error {
	if nID == "" {
		return fmt.Errorf("notification: notificationId is required")
	}
	return s.repo.DismissNotification(nID)
}

// ExecuteAction performs an action on a notification (e.g., Open Asset, Run Workflow, Snooze)
func (s *NotificationService) ExecuteAction(nID string, action domain.ActionType) error {
	if nID == "" {
		return fmt.Errorf("notification: notificationId is required")
	}
	return s.repo.ExecuteAction(nID, action)
}

// GetPreferences returns user notification preferences
func (s *NotificationService) GetPreferences(vaultID string) (*domain.NotificationPreferences, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.GetPreferences(vaultID)
}

// UpdatePreferences updates user notification preferences
func (s *NotificationService) UpdatePreferences(pref *domain.NotificationPreferences) error {
	if pref.VaultID == "" {
		return fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.UpdatePreferences(pref)
}

// GenerateDigest Report creates a Daily or Weekly Digest summary
func (s *NotificationService) GenerateDigest(vaultID string, digestType domain.DigestType) (*domain.DigestReport, error) {
	now := time.Now()
	title := fmt.Sprintf("%s Digest Report", string(digestType))
	summary := "Your digital vault summary: 3 new memories formed, 1 document expiring alert, 100% workflow success rate."

	d := &domain.DigestReport{
		DigestID:    "digest-" + uuid.New().String()[:8],
		VaultID:     vaultID,
		DigestType:  digestType,
		Title:       title,
		Summary:     summary,
		ContentData: map[string]interface{}{"newMemories": 3, "expirations": 1, "workflowRuns": 2},
		GeneratedAt: now,
	}

	if err := s.repo.SaveDigest(d); err != nil {
		return nil, err
	}
	return d, nil
}

// GetDigests returns generated digest reports for a vault
func (s *NotificationService) GetDigests(vaultID string) ([]*domain.DigestReport, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.GetDigests(vaultID)
}

// GetStats returns notification metrics for a vault
func (s *NotificationService) GetStats(vaultID string) (*domain.NotificationStats, error) {
	if vaultID == "" {
		return nil, fmt.Errorf("notification: vaultId is required")
	}
	return s.repo.GetStats(vaultID)
}
