package domain

import "time"

type JobStatus string

const (
	StatusQueued    JobStatus = "QUEUED"
	StatusWaiting   JobStatus = "WAITING"
	StatusRunning   JobStatus = "RUNNING"
	StatusPaused    JobStatus = "PAUSED"
	StatusRetrying  JobStatus = "RETRYING"
	StatusCompleted JobStatus = "COMPLETED"
	StatusCancelled JobStatus = "CANCELLED"
	StatusFailed    JobStatus = "FAILED"
	StatusSkipped   JobStatus = "SKIPPED"
)

type JobType string

const (
	TypeMetadataExtraction JobType = "METADATA_EXTRACTION"
	TypeThumbnailGen       JobType = "THUMBNAIL_GENERATION"
	TypeOCR                JobType = "OCR"
	TypeTextExtraction     JobType = "TEXT_EXTRACTION"
	TypePDFProcessing      JobType = "PDF_PROCESSING"
	TypeAudioTranscription JobType = "AUDIO_TRANSCRIPTION"
	TypeVideoProcessing    JobType = "VIDEO_PROCESSING"
	TypeEmbeddingGen       JobType = "EMBEDDING_GENERATION"
	TypeEntityExtraction       JobType = "ENTITY_EXTRACTION"
	TypeIntentAnalysis         JobType = "INTENT_ANALYSIS"
	TypeRelationship           JobType = "RELATIONSHIP_DISCOVERY"
	TypeRelationshipDiscovery  JobType = "RELATIONSHIP_DISCOVERY"
	TypeContextDetection       JobType = "CONTEXT_DETECTION"
	TypeAIAnalysis             JobType = "AI_ANALYSIS"
	TypeContentExtraction      JobType = "TEXT_EXTRACTION"
	TypeSearchIndexing         JobType = "SEARCH_INDEXING"
	TypeVirusScan              JobType = "VIRUS_SCAN"
	TypePersonaLearning        JobType = "PERSONA_LEARNING"
	TypeMemoryFormation        JobType = "MEMORY_FORMATION"
)

type Job struct {
	JobID         string    `json:"jobId"`
	AssetID       string    `json:"assetId"`
	VaultID       string    `json:"vaultId"`
	JobType       JobType   `json:"jobType"`
	Status        JobStatus `json:"status"`
	Priority      int       `json:"priority"`
	CurrentStage  string    `json:"currentStage,omitempty"`
	RetryCount    int       `json:"retryCount"`
	MaxRetries    int       `json:"maxRetries"`
	FailureReason string    `json:"failureReason,omitempty"`
	WorkerID      string    `json:"workerId,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	StartedAt     *time.Time `json:"startedAt,omitempty"`
	CompletedAt   *time.Time `json:"completedAt,omitempty"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type WorkerStatus string

const (
	WorkerStatusIdle    WorkerStatus = "IDLE"
	WorkerStatusBusy    WorkerStatus = "BUSY"
	WorkerStatusOffline WorkerStatus = "OFFLINE"
)

type Worker struct {
	WorkerID      string       `json:"workerId"`
	NodeID        string       `json:"nodeId"`
	Capabilities  []JobType    `json:"capabilities"`
	Status        WorkerStatus `json:"status"`
	LastHeartbeat time.Time    `json:"lastHeartbeat"`
	CreatedAt     time.Time    `json:"createdAt"`
}

type JobAttempt struct {
	AttemptID    string     `json:"attemptId"`
	JobID        string     `json:"jobId"`
	WorkerID     string     `json:"workerId,omitempty"`
	AttemptNumber int       `json:"attemptNumber"`
	Status       JobStatus  `json:"status"`
	ErrorDetails string     `json:"errorDetails,omitempty"`
	StartedAt    time.Time  `json:"startedAt"`
	CompletedAt  *time.Time `json:"completedAt,omitempty"`
}
