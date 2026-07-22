// Knowledge Insights & Timeline Engine TypeScript types

export type TimelineEventType =
  | 'LIFE'
  | 'PROJECT'
  | 'TRAVEL'
  | 'MEDICAL'
  | 'EDUCATION'
  | 'FINANCIAL'
  | 'LEGAL'
  | 'PURCHASE'
  | 'SUBSCRIPTION'
  | 'CUSTOM';

export type InsightType =
  | 'EXPIRATION_WARNING'
  | 'RECURRING_EXPENSE'
  | 'FREQUENT_PLACE'
  | 'IMPORTANT_DOC'
  | 'MISSING_DOC'
  | 'INACTIVE_PROJECT'
  | 'TRENDING_INTEREST'
  | 'KNOWLEDGE_GROWTH'
  | 'REPEATED_PATTERN';

export type MilestoneType =
  | 'PASSPORT_EXPIRATION'
  | 'VISA_COMPLETED'
  | 'TAX_FILED'
  | 'ADMISSION_COMPLETED'
  | 'MEDICAL_COMPLETED'
  | 'PROJECT_MILESTONE'
  | 'TRAVEL_COMPLETED';

export type MilestoneStatus = 'PENDING' | 'UPCOMING' | 'COMPLETED' | 'EXPIRED';

export interface TimelineEvent {
  eventId: string;
  vaultId: string;
  eventType: TimelineEventType;
  title: string;
  summary: string;
  eventTimestamp: string;
  importance: number;
  confidence: number;
  relatedAssets?: string[];
  relatedEntities?: string[];
  relatedContexts?: string[];
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineGroup {
  groupId: string;
  vaultId: string;
  groupName: string;
  groupType: string;
  eventIds: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface KnowledgeInsight {
  insightId: string;
  vaultId: string;
  insightType: InsightType;
  title: string;
  summary: string;
  whyGenerated: string;
  evidence: string[];
  relatedAssets?: string[];
  relatedEntities?: string[];
  importance: number;
  confidence: number;
  isDismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  milestoneId: string;
  vaultId: string;
  milestoneType: MilestoneType;
  title: string;
  status: MilestoneStatus;
  dueDate?: string;
  relatedAssetId?: string;
  importance: number;
  createdAt: string;
}

export interface InsightStats {
  vaultId: string;
  totalTimelineEvents: number;
  totalActiveInsights: number;
  totalMilestones: number;
  upcomingExpirations: number;
  typeBreakdown: Record<string, number>;
}

export interface InsightPreferences {
  preferenceId: string;
  vaultId: string;
  enabledTypes: string[];
  minConfidence: number;
  autoRefresh: boolean;
  createdAt: string;
  updatedAt: string;
}
