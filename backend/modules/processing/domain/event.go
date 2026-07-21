package domain

import "time"

type EventType string

const (
	EventAssetUploaded      EventType = "ASSET_UPLOADED"
	EventProcessingStarted  EventType = "PROCESSING_STARTED"
	EventProcessingCompleted EventType = "PROCESSING_COMPLETED"
	EventProcessingFailed   EventType = "PROCESSING_FAILED"
	EventRetryScheduled     EventType = "RETRY_SCHEDULED"
	EventWorkerRegistered   EventType = "WORKER_REGISTERED"
)

type Event struct {
	EventID   string                 `json:"eventId"`
	JobID     string                 `json:"jobId,omitempty"`
	AssetID   string                 `json:"assetId"`
	EventType EventType              `json:"eventType"`
	Payload   map[string]interface{} `json:"payload,omitempty"`
	CreatedAt time.Time              `json:"createdAt"`
}
