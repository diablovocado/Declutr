export type JobStatus = "QUEUED" | "WAITING" | "RUNNING" | "PAUSED" | "RETRYING" | "COMPLETED" | "CANCELLED" | "FAILED" | "SKIPPED";
export type JobType = "METADATA_EXTRACTION" | "THUMBNAIL_GENERATION" | "OCR" | "TEXT_EXTRACTION" | "PDF_PROCESSING" | "AUDIO_TRANSCRIPTION" | "VIDEO_PROCESSING" | "EMBEDDING_GENERATION" | "ENTITY_EXTRACTION" | "INTENT_ANALYSIS" | "RELATIONSHIP_DISCOVERY" | "SEARCH_INDEXING" | "VIRUS_SCAN";

export interface ProcessingJob {
  jobId: string;
  assetId: string;
  vaultId: string;
  jobType: JobType;
  status: JobStatus;
  priority: number;
  currentStage?: string;
  retryCount: number;
  maxRetries: number;
  failureReason?: string;
  workerId?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface ProcessingStats {
  queuedJobs: number;
  runningJobs: number;
  failedJobs: number;
  activeWorkers: number;
}

export const ProcessingService = {
  async getJobs(limit = 50, offset = 0): Promise<ProcessingJob[]> {
    // Mock implementation for UI development
    return [
      {
        jobId: "job_1",
        assetId: "ast_1",
        vaultId: "v_1",
        jobType: "METADATA_EXTRACTION",
        status: "COMPLETED",
        priority: 1,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        jobId: "job_2",
        assetId: "ast_1",
        vaultId: "v_1",
        jobType: "OCR",
        status: "RUNNING",
        priority: 1,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        jobId: "job_3",
        assetId: "ast_2",
        vaultId: "v_1",
        jobType: "EMBEDDING_GENERATION",
        status: "QUEUED",
        priority: 2,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  async getStats(): Promise<ProcessingStats> {
    return {
      queuedJobs: 142,
      runningJobs: 12,
      failedJobs: 3,
      activeWorkers: 5,
    };
  },

  async retryJob(jobId: string): Promise<void> {
    console.log(`Retrying job ${jobId}`);
  },

  async cancelJob(jobId: string): Promise<void> {
    console.log(`Cancelling job ${jobId}`);
  }
};
