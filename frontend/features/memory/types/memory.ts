// Memory Engine TypeScript types

export type MemoryType =
  | 'SHORT_TERM'
  | 'WORKING'
  | 'LONG_TERM'
  | 'ARCHIVED'
  | 'FORGOTTEN'
  | 'PINNED'
  | 'GENERATED'
  | 'USER'
  | 'AI';

export type SourceType = 'ASSET' | 'ENTITY' | 'RELATIONSHIP' | 'CONTEXT' | 'PERSONA';

export type MemoryEventType =
  | 'FORMED'
  | 'STRENGTHENED'
  | 'DECAYED'
  | 'PINNED'
  | 'ARCHIVED'
  | 'MERGED'
  | 'ACCESSED'
  | 'RESET';

export interface Memory {
  memoryId: string;
  vaultId: string;
  title: string;
  summary: string;
  memoryType: MemoryType;
  importanceScore: number;
  confidence: number;
  recency: number;
  frequency: number;
  memoryStrength: number;
  decayRate: number;
  isPinned: boolean;
  isArchived: boolean;
  pinReason?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemorySource {
  sourceId: string;
  memoryId: string;
  sourceType: SourceType;
  sourceRefId: string;
  contributionWeight: number;
  createdAt: string;
}

export interface MemoryScore {
  scoreId: string;
  memoryId: string;
  importance: number;
  recency: number;
  frequency: number;
  confidence: number;
  decayFactor: number;
  compositeStrength: number;
  scoredAt: string;
}

export interface MemoryEvent {
  eventId: string;
  memoryId: string;
  eventType: MemoryEventType;
  eventData: Record<string, unknown>;
  occurredAt: string;
}

export interface MemoryDetail {
  memory: Memory;
  sources: MemorySource[];
  scores: MemoryScore[];
  events: MemoryEvent[];
}

export interface MemoryStats {
  vaultId: string;
  totalMemories: number;
  pinned: number;
  longTerm: number;
  working: number;
  archived: number;
  forgotten: number;
  avgStrength: number;
  typeBreakdown: Record<string, number>;
}

export interface MemoryCluster {
  clusterId: string;
  vaultId: string;
  clusterName: string;
  clusterType: string;
  memberMemoryIds: string[];
  cohesionScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemorySettings {
  settingsId: string;
  vaultId: string;
  memoryLearningEnabled: boolean;
  autoArchiveThreshold: number;
  autoForgetThreshold: number;
  defaultDecayRate: number;
  maxWorkingMemories: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemoriesResponse {
  memories: Memory[];
  total: number;
}

export interface TimelineResponse {
  timeline: Memory[];
  total: number;
}

export interface StatsResponse {
  stats: MemoryStats;
  clusters: MemoryCluster[];
}
