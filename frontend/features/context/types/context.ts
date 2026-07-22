export type ContextStatus = 'ACTIVE' | 'ARCHIVED' | 'MERGED' | 'UNREVIEWED';

export interface ContextItem {
  contextId: string;
  vaultId: string;
  name: string;
  type: string;
  summary: string;
  status: ContextStatus;
  confidenceScore: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ContextAsset {
  id: string;
  contextId: string;
  assetId: string;
  confidenceScore: number;
  evidence: string;
  reasoning: string;
  promptVersion: string;
  addedAt: string;
}

export interface ContextEvent {
  eventId: string;
  contextId: string;
  eventType: string;
  eventName: string;
  eventDate?: string;
  location?: string;
  confidenceScore: number;
  evidence: string;
  createdAt: string;
}

export interface IntentPrediction {
  predictionId: string;
  assetId: string;
  vaultId: string;
  intentTypeName: string;
  confidenceScore: number;
  evidence: string;
  reasoning: string;
  promptVersion: string;
  createdAt: string;
}

export interface ContextVersion {
  versionId: string;
  contextId: string;
  versionNumber: number;
  promptVersion: string;
  modelName: string;
  changesSummary: string;
  tokenUsage?: Record<string, any>;
  latencyMs: number;
  createdAt: string;
}

export interface ContextStats {
  totalContexts: number;
  activeContexts: number;
  totalEvents: number;
  intentBreakdown: Record<string, number>;
  averageConfidence: number;
}

export interface ContextDetail {
  context: ContextItem;
  assets: ContextAsset[];
  events: ContextEvent[];
  recentPredictions?: IntentPrediction[];
  versions?: ContextVersion[];
}
