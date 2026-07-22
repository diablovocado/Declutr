// Persona types matching the backend domain models

export type SignalType =
  | 'ASSET_OPEN'
  | 'SEARCH'
  | 'PIN'
  | 'UPLOAD'
  | 'EDIT'
  | 'CONTEXT_SWITCH'
  | 'RELATIONSHIP_EXPLORE'
  | 'COLLECTION_USE'
  | 'TIME_OF_DAY'
  | 'SEARCH_REFINEMENT'
  | 'DASHBOARD_USAGE'
  | 'FAVOURITE';

export type RecommendationType =
  | 'CONTINUE_PROJECT'
  | 'RESUME_READING'
  | 'RELATED_DOCUMENT'
  | 'SUGGESTED_CONTEXT'
  | 'SUGGESTED_COLLECTION'
  | 'SUGGESTED_ARCHIVE'
  | 'SUGGESTED_RELATIONSHIP';

export type ScoreTrend = 'RISING' | 'FALLING' | 'STABLE';

export interface PersonaKnowledgeModel {
  frequentEntities: string[];
  favouriteLocations: string[];
  recurringProjects: string[];
  longTermInterests: string[];
  activeContexts: string[];
  recurringContacts: string[];
  commonWorkflows: string[];
  frequentVaultAreas: string[];
}

export interface PersonaProfile {
  profileId: string;
  vaultId: string;
  personaType: string; // Traveller, Developer, Researcher, etc.
  confidenceScore: number;
  attributes: Record<string, PersonaScoreAttribute>;
  knowledgeModel: PersonaKnowledgeModel;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaScoreAttribute {
  importance: number;
  recency: number;
  frequency: number;
  confidence: number;
  trend: ScoreTrend;
}

export interface PersonaScore {
  scoreId: string;
  vaultId: string;
  dimension: string;
  importance: number;
  recency: number;
  frequency: number;
  confidence: number;
  decayRate: number;
  trend: ScoreTrend;
  lastSeenAt?: string;
  updatedAt: string;
}

export interface PersonaInterest {
  interestId: string;
  vaultId: string;
  topic: string;
  entityType?: string;
  frequencyScore: number;
  personalRelevance: number;
  lastSeenAt?: string;
  createdAt: string;
}

export interface PersonaRecommendation {
  recommendationId: string;
  vaultId: string;
  recommendationType: RecommendationType;
  title: string;
  reason: string;
  confidence: number;
  evidence: string[];
  relatedAssetIds: string[];
  contributingSignals: string[];
  isDismissed: boolean;
  createdAt: string;
}

export interface PersonaSettings {
  settingsId: string;
  vaultId: string;
  learningPaused: boolean;
  disabledSignalTypes: SignalType[];
  allowExport: boolean;
  dataRetentionDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaHistory {
  snapshotId: string;
  vaultId: string;
  personaType: string;
  snapshotData: Record<string, unknown>;
  snapshotReason: string;
  createdAt: string;
}

export interface PersonaExport {
  vaultId: string;
  exportedAt: string;
  profile: PersonaProfile;
  signals: PersonaSignal[];
  scores: PersonaScore[];
  interests: PersonaInterest[];
  recommendations: PersonaRecommendation[];
  settings: PersonaSettings;
  history: PersonaHistory[];
}

export interface PersonaSignal {
  signalId: string;
  vaultId: string;
  signalType: SignalType;
  assetId?: string;
  value?: string;
  weight: number;
  source: string;
  isDisabled: boolean;
  recordedAt: string;
}

export interface PersonaResponse {
  profile: PersonaProfile | null;
  scores: PersonaScore[];
  interests: PersonaInterest[];
}

export interface RecommendationsResponse {
  recommendations: PersonaRecommendation[];
  total: number;
}
