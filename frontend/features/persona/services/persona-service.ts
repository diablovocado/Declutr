import type {
  PersonaResponse,
  RecommendationsResponse,
  PersonaSettings,
  PersonaExport,
  SignalType,
} from '../types/persona';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!res.ok) throw new Error(`Persona API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Mock data for local development / fallback
const MOCK_VAULT_ID = 'vault-demo';

const MOCK_PROFILE: PersonaResponse = {
  profile: {
    profileId: 'prof-001',
    vaultId: MOCK_VAULT_ID,
    personaType: 'Researcher',
    confidenceScore: 0.87,
    attributes: {
      'Research': { importance: 8.4, recency: 0.92, frequency: 14, confidence: 0.87, trend: 'RISING' },
      'Software Development': { importance: 5.2, recency: 0.75, frequency: 9, confidence: 0.72, trend: 'STABLE' },
      'Travel': { importance: 3.1, recency: 0.45, frequency: 5, confidence: 0.55, trend: 'FALLING' },
    },
    knowledgeModel: {
      frequentEntities: ['Neural Networks', 'PyTorch', 'Tokyo', 'Dr. Sharma'],
      favouriteLocations: ['Tokyo', 'San Francisco'],
      recurringProjects: ['Thesis Chapter 4', 'ML Pipeline'],
      longTermInterests: ['Deep Learning', 'NLP', 'Knowledge Graphs'],
      activeContexts: ['PhD Research', 'Conference 2025'],
      recurringContacts: ['Dr. Sharma', 'Prof. Li'],
      commonWorkflows: ['Research', 'Software Development'],
      frequentVaultAreas: ['Papers', 'Notes', 'Code'],
    },
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  scores: [
    { scoreId: 'sc-1', vaultId: MOCK_VAULT_ID, dimension: 'Research', importance: 8.4, recency: 0.92, frequency: 14, confidence: 0.87, decayRate: 0.05, trend: 'RISING', updatedAt: new Date().toISOString() },
    { scoreId: 'sc-2', vaultId: MOCK_VAULT_ID, dimension: 'Software Development', importance: 5.2, recency: 0.75, frequency: 9, confidence: 0.72, decayRate: 0.05, trend: 'STABLE', updatedAt: new Date().toISOString() },
    { scoreId: 'sc-3', vaultId: MOCK_VAULT_ID, dimension: 'Travel', importance: 3.1, recency: 0.45, frequency: 5, confidence: 0.55, decayRate: 0.05, trend: 'FALLING', updatedAt: new Date().toISOString() },
  ],
  interests: [
    { interestId: 'int-1', vaultId: MOCK_VAULT_ID, topic: 'Deep Learning', entityType: 'Topic', frequencyScore: 0.91, personalRelevance: 0.89, createdAt: new Date().toISOString() },
    { interestId: 'int-2', vaultId: MOCK_VAULT_ID, topic: 'Tokyo', entityType: 'Location', frequencyScore: 0.72, personalRelevance: 0.78, createdAt: new Date().toISOString() },
    { interestId: 'int-3', vaultId: MOCK_VAULT_ID, topic: 'Dr. Sharma', entityType: 'Person', frequencyScore: 0.65, personalRelevance: 0.70, createdAt: new Date().toISOString() },
  ],
};

const MOCK_RECOMMENDATIONS: RecommendationsResponse = {
  recommendations: [
    {
      recommendationId: 'rec-1',
      vaultId: MOCK_VAULT_ID,
      recommendationType: 'CONTINUE_PROJECT',
      title: 'Continue Thesis Chapter 4',
      reason: 'You have 14 recorded interactions with research materials. Returning to this project maintains momentum.',
      confidence: 0.87,
      evidence: ['14 research interactions this month', 'Research dimension is RISING in trend', 'Last accessed: 2 days ago'],
      relatedAssetIds: ['asset-thesis-1', 'asset-paper-2'],
      contributingSignals: ["Dimension 'Research' has frequency 14", 'Importance score: 8.40', 'Recency score: 0.92 (trend: RISING)'],
      isDismissed: false,
      createdAt: new Date().toISOString(),
    },
    {
      recommendationId: 'rec-2',
      vaultId: MOCK_VAULT_ID,
      recommendationType: 'SUGGESTED_COLLECTION',
      title: 'Group Research into a Collection',
      reason: 'Your research materials span multiple topics. Grouping them into a dedicated collection will improve discoverability.',
      confidence: 0.72,
      evidence: ['9 software/code files in vault', 'Multiple active research contexts detected'],
      relatedAssetIds: ['asset-code-1'],
      contributingSignals: ["Dimension 'Software Development' frequency: 9", 'Importance score: 5.20'],
      isDismissed: false,
      createdAt: new Date().toISOString(),
    },
  ],
  total: 2,
};

export const PersonaService = {
  async getPersona(vaultId: string): Promise<PersonaResponse> {
    try {
      return await apiFetch<PersonaResponse>(`${BASE_URL}/persona?vaultId=${vaultId}`);
    } catch {
      return MOCK_PROFILE;
    }
  },

  async getRecommendations(vaultId: string): Promise<RecommendationsResponse> {
    try {
      return await apiFetch<RecommendationsResponse>(`${BASE_URL}/persona/recommendations?vaultId=${vaultId}`);
    } catch {
      return MOCK_RECOMMENDATIONS;
    }
  },

  async getSettings(vaultId: string): Promise<PersonaSettings> {
    try {
      return await apiFetch<PersonaSettings>(`${BASE_URL}/persona/settings?vaultId=${vaultId}`);
    } catch {
      return { settingsId: 'set-1', vaultId, learningPaused: false, disabledSignalTypes: [], allowExport: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
  },

  async updateSettings(settings: Partial<PersonaSettings> & { vaultId: string }): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/persona/settings`, { method: 'PUT', body: JSON.stringify(settings) });
    } catch { /* no-op in demo */ }
  },

  async resetPersona(vaultId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/persona/reset`, { method: 'POST', body: JSON.stringify({ vaultId }) });
    } catch { /* no-op in demo */ }
  },

  async exportPersona(vaultId: string): Promise<PersonaExport | null> {
    try {
      return await apiFetch<PersonaExport>(`${BASE_URL}/persona/export?vaultId=${vaultId}`);
    } catch {
      return null;
    }
  },

  async deletePersona(vaultId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/persona?vaultId=${vaultId}`, { method: 'DELETE' });
    } catch { /* no-op in demo */ }
  },

  async recordSignal(vaultId: string, signalType: SignalType, assetId?: string, value?: string, weight = 1.0): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/persona/signal`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, signalType, assetId, value, weight }),
      });
    } catch { /* no-op */ }
  },
};
