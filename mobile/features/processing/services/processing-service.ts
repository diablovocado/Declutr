export type JobStatus = "QUEUED" | "WAITING" | "RUNNING" | "PAUSED" | "RETRYING" | "COMPLETED" | "CANCELLED" | "FAILED" | "SKIPPED";
export type JobType = "METADATA_EXTRACTION" | "OCR" | "EMBEDDING_GENERATION" | "SEARCH_INDEXING";

export interface MobileProcessingJob {
  jobId: string;
  assetId: string;
  jobType: JobType;
  status: JobStatus;
  progressPercentage?: number;
}

export const ProcessingService = {
  async getActiveJobs(): Promise<MobileProcessingJob[]> {
    return [
      {
        jobId: "job_m1",
        assetId: "ast_m1",
        jobType: "OCR",
        status: "RUNNING",
        progressPercentage: 45,
      },
    ];
  }
};
