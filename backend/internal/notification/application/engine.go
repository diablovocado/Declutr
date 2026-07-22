package application

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/notification/domain"
)

// NotificationEventEngine subscribes to domain events and dispatches notifications
type NotificationEventEngine struct {
	service *NotificationService
}

// NewNotificationEventEngine creates a new NotificationEventEngine
func NewNotificationEventEngine(service *NotificationService) *NotificationEventEngine {
	return &NotificationEventEngine{service: service}
}

// HandleDomainEvent converts an internal domain event (e.g. AssetUploaded, DocumentExpiring, WorkflowFailed) into a proactive notification
func (e *NotificationEventEngine) HandleDomainEvent(ctx context.Context, vaultID string, eventType string, title string, message string, nType domain.NotificationType) error {
	log.Printf("[NotificationEventEngine] Processing domain event: %s for vault: %s", eventType, vaultID)

	n := &domain.Notification{
		VaultID:    vaultID,
		Type:       nType,
		Priority:   CalculatePriority(nType, "NORMAL"),
		Title:      title,
		Message:    message,
		Summary:    "Proactive intelligence alert from " + eventType,
		ActionType: domain.ActionViewContext,
	}

	_, err := e.service.DispatchNotification(ctx, n)
	if err != nil {
		log.Printf("[NotificationEventEngine] Dispatch warning: %v", err)
	}
	return nil
}
