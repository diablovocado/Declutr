package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/diablovocado/declutr/internal/notification/domain"
)

// NotificationRepository defines persistence contract for notifications, preferences, and digests
type NotificationRepository interface {
	CreateNotification(n *domain.Notification) error
	GetNotification(nID string) (*domain.Notification, error)
	ListNotifications(vaultID string) ([]*domain.Notification, error)
	MarkRead(vaultID string, nIDs []string) error
	DismissNotification(nID string) error
	ExecuteAction(nID string, action domain.ActionType) error

	GetPreferences(vaultID string) (*domain.NotificationPreferences, error)
	UpdatePreferences(pref *domain.NotificationPreferences) error

	SaveDigest(d *domain.DigestReport) error
	GetDigests(vaultID string) ([]*domain.DigestReport, error)

	GetStats(vaultID string) (*domain.NotificationStats, error)
	ClearAllData(vaultID string) error
}

// InMemoryNotificationRepository is a thread-safe in-memory store
type InMemoryNotificationRepository struct {
	mu            sync.RWMutex
	notifications map[string]*domain.Notification      // nID -> Notification
	preferences   map[string]*domain.NotificationPreferences // vaultID -> Prefs
	digests       map[string][]*domain.DigestReport    // vaultID -> Digests
}

// NewInMemoryNotificationRepository creates a new in-memory notification repository
func NewInMemoryNotificationRepository() *InMemoryNotificationRepository {
	return &InMemoryNotificationRepository{
		notifications: make(map[string]*domain.Notification),
		preferences:   make(map[string]*domain.NotificationPreferences),
		digests:       make(map[string][]*domain.DigestReport),
	}
}

func (r *InMemoryNotificationRepository) CreateNotification(n *domain.Notification) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.notifications[n.NotificationID] = n
	return nil
}

func (r *InMemoryNotificationRepository) GetNotification(nID string) (*domain.Notification, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	n, ok := r.notifications[nID]
	if !ok {
		return nil, fmt.Errorf("notification %s not found", nID)
	}
	return n, nil
}

func (r *InMemoryNotificationRepository) ListNotifications(vaultID string) ([]*domain.Notification, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var list []*domain.Notification
	for _, n := range r.notifications {
		if n.VaultID == vaultID && !n.IsDismissed {
			list = append(list, n)
		}
	}
	if len(list) == 0 {
		list = defaultSampleNotifications(vaultID)
		for _, n := range list {
			r.notifications[n.NotificationID] = n
		}
	}
	return list, nil
}

func (r *InMemoryNotificationRepository) MarkRead(vaultID string, nIDs []string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	now := time.Now()
	if len(nIDs) == 0 {
		// Mark all read for vault
		for _, n := range r.notifications {
			if n.VaultID == vaultID {
				n.IsRead = true
				n.ReadAt = &now
			}
		}
		return nil
	}

	for _, id := range nIDs {
		if n, ok := r.notifications[id]; ok {
			n.IsRead = true
			n.ReadAt = &now
		}
	}
	return nil
}

func (r *InMemoryNotificationRepository) DismissNotification(nID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	n, ok := r.notifications[nID]
	if !ok {
		return fmt.Errorf("notification %s not found", nID)
	}
	now := time.Now()
	n.IsDismissed = true
	n.DismissedAt = &now
	return nil
}

func (r *InMemoryNotificationRepository) ExecuteAction(nID string, action domain.ActionType) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	n, ok := r.notifications[nID]
	if !ok {
		return fmt.Errorf("notification %s not found", nID)
	}
	n.ActionType = action
	now := time.Now()
	if action == domain.ActionDismiss || action == domain.ActionArchive {
		n.IsDismissed = true
		n.DismissedAt = &now
	} else if action == domain.ActionSnooze {
		exp := now.Add(24 * time.Hour)
		n.ExpiresAt = &exp
	}
	return nil
}

func (r *InMemoryNotificationRepository) GetPreferences(vaultID string) (*domain.NotificationPreferences, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	pref, ok := r.preferences[vaultID]
	if !ok {
		pref = &domain.NotificationPreferences{
			PreferenceID: "pref-" + vaultID,
			VaultID:      vaultID,
			EnabledTypes: []domain.NotificationType{
				domain.TypeInfo, domain.TypeSuccess, domain.TypeWarning, domain.TypeCritical,
				domain.TypeReminder, domain.TypeRecommendation, domain.TypeAIInsight,
				domain.TypeWorkflow, domain.TypeSecurity, domain.TypeSystem,
			},
			InAppEnabled:    true,
			EmailEnabled:    false,
			PushEnabled:     false,
			DesktopEnabled:  false,
			DigestFrequency: domain.DigestDaily,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}
		r.preferences[vaultID] = pref
	}
	return pref, nil
}

func (r *InMemoryNotificationRepository) UpdatePreferences(pref *domain.NotificationPreferences) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	pref.UpdatedAt = time.Now()
	r.preferences[pref.VaultID] = pref
	return nil
}

func (r *InMemoryNotificationRepository) SaveDigest(d *domain.DigestReport) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.digests[d.VaultID] = append(r.digests[d.VaultID], d)
	return nil
}

func (r *InMemoryNotificationRepository) GetDigests(vaultID string) ([]*domain.DigestReport, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	list := r.digests[vaultID]
	if len(list) == 0 {
		list = defaultSampleDigests(vaultID)
	}
	return list, nil
}

func (r *InMemoryNotificationRepository) GetStats(vaultID string) (*domain.NotificationStats, error) {
	list, _ := r.ListNotifications(vaultID)

	unread := 0
	urgent := 0
	read := 0
	for _, n := range list {
		if !n.IsRead {
			unread++
		} else {
			read++
		}
		if n.Priority == domain.PriorityUrgent || n.Priority == domain.PriorityHigh {
			urgent++
		}
	}

	rate := 0.0
	if len(list) > 0 {
		rate = float64(read) / float64(len(list))
	}

	return &domain.NotificationStats{
		VaultID:            vaultID,
		TotalNotifications: len(list),
		UnreadCount:        unread,
		UrgentCount:        urgent,
		ReadRate:           rate,
	}, nil
}

func (r *InMemoryNotificationRepository) ClearAllData(vaultID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for id, n := range r.notifications {
		if n.VaultID == vaultID {
			delete(r.notifications, id)
		}
	}
	delete(r.preferences, vaultID)
	delete(r.digests, vaultID)
	return nil
}

// Sample Data Generators
func defaultSampleNotifications(vaultID string) []*domain.Notification {
	now := time.Now()
	return []*domain.Notification{
		{
			NotificationID: "notif-exp-001",
			VaultID:        vaultID,
			Type:           domain.TypeWarning,
			Priority:       domain.PriorityUrgent,
			Title:          "Passport Expiring Soon (65 Days)",
			Message:        "Your US Passport expires on September 25, 2025. Renewal recommended before upcoming international travel.",
			Summary:        "Passport renewal milestone alert generated from Japanese Visa & Passport Scan.",
			RelatedAssets:  []string{"asset-passport-001"},
			ActionType:     domain.ActionOpenAsset,
			IsRead:         false,
			CreatedAt:      now.Add(-30 * time.Minute),
		},
		{
			NotificationID: "notif-wf-002",
			VaultID:        vaultID,
			Type:           domain.TypeWorkflow,
			Priority:       domain.PriorityMedium,
			Title:          "Workflow Completed: Auto-tag Travel Documents",
			Message:        "Workflow successfully processed document 'Japanese Visa & Passport Scan' and applied tags: Travel, Passport.",
			Summary:        "Automation rule executed in 45ms.",
			ActionType:     domain.ActionRunWorkflow,
			IsRead:         true,
			CreatedAt:      now.Add(-2 * time.Hour),
		},
		{
			NotificationID: "notif-sec-003",
			VaultID:        vaultID,
			Type:           domain.TypeSecurity,
			Priority:       domain.PriorityHigh,
			Title:          "Zero-Knowledge Encryption Key Rotation Suggested",
			Message:        "It has been 90 days since your zero-knowledge vault master key was rotated.",
			Summary:        "Recommended periodic security key rotation for enhanced vault protection.",
			ActionType:     domain.ActionViewContext,
			IsRead:         false,
			CreatedAt:      now.Add(-5 * time.Hour),
		},
	}
}

func defaultSampleDigests(vaultID string) []*domain.DigestReport {
	now := time.Now()
	return []*domain.DigestReport{
		{
			DigestID:    "digest-daily-001",
			VaultID:     vaultID,
			DigestType:  domain.DigestDaily,
			Title:       "Daily Intelligence Summary",
			Summary:     "Today: 3 new memories formed, 1 document expiring alert, 2 workflows executed, 100% success rate.",
			ContentData: map[string]interface{}{"newMemories": 3, "expirations": 1, "workflowRuns": 2},
			GeneratedAt: now.Add(-6 * time.Hour),
		},
		{
			DigestID:    "digest-weekly-002",
			VaultID:     vaultID,
			DigestType:  domain.DigestWeekly,
			Title:       "Weekly Vault Recap",
			Summary:     "This Week: 14 assets ingested, 8 entity relationships discovered, Passport renewal milestone flagged.",
			ContentData: map[string]interface{}{"assetsIngested": 14, "relationships": 8},
			GeneratedAt: now.Add(-3 * 24 * time.Hour),
		},
	}
}
