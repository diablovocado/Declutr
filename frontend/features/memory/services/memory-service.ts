import type {
  MemoriesResponse,
  TimelineResponse,
  MemoryDetail,
  StatsResponse,
  MemorySettings,
  Memory,
} from '../types/memory';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Memory API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MEMORIES: Memory[] = [
  {
    memoryId: 'mem-001', vaultId: VAULT_ID, title: 'Japan Vacation 2025',
    summary: 'Three-week trip to Tokyo and Kyoto covering temples, food, and technology districts.',
    memoryType: 'LONG_TERM', importanceScore: 0.92, confidence: 0.87, recency: 0.85,
    frequency: 14, memoryStrength: 0.88, decayRate: 0.02, isPinned: false, isArchived: false,
    lastAccessedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    memoryId: 'mem-002', vaultId: VAULT_ID, title: 'Thesis Chapter 4 — Neural Networks',
    summary: 'Deep learning chapter of PhD thesis. Multiple revisions and research sessions.',
    memoryType: 'WORKING', importanceScore: 0.88, confidence: 0.82, recency: 0.95,
    frequency: 22, memoryStrength: 0.84, decayRate: 0.03, isPinned: true, isArchived: false,
    pinReason: 'Active PhD chapter',
    lastAccessedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    memoryId: 'mem-003', vaultId: VAULT_ID, title: 'Recurring Medical Visits — Dr. Sharma',
    summary: 'Monthly cardiology check-up schedule. Multiple visit records and prescriptions.',
    memoryType: 'LONG_TERM', importanceScore: 0.95, confidence: 0.90, recency: 0.70,
    frequency: 8, memoryStrength: 0.79, decayRate: 0.01, isPinned: false, isArchived: false,
    lastAccessedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    memoryId: 'mem-004', vaultId: VAULT_ID, title: 'Tax Filing 2024',
    summary: 'Annual tax filing documents, receipts, and bank statements.',
    memoryType: 'WORKING', importanceScore: 0.80, confidence: 0.75, recency: 0.55,
    frequency: 5, memoryStrength: 0.61, decayRate: 0.04, isPinned: false, isArchived: false,
    lastAccessedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    memoryId: 'mem-005', vaultId: VAULT_ID, title: 'Old University Notes 2019',
    summary: 'Undergraduate lecture notes, now mostly outdated.',
    memoryType: 'ARCHIVED', importanceScore: 0.30, confidence: 0.40, recency: 0.08,
    frequency: 2, memoryStrength: 0.09, decayRate: 0.05, isPinned: false, isArchived: true,
    lastAccessedAt: new Date(Date.now() - 400 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 500 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 400 * 86400000).toISOString(),
  },
  {
    memoryId: 'mem-006', vaultId: VAULT_ID, title: 'ML Pipeline Project',
    summary: 'Machine learning data pipeline for real-time inference.',
    memoryType: 'WORKING', importanceScore: 0.75, confidence: 0.70, recency: 0.80,
    frequency: 11, memoryStrength: 0.68, decayRate: 0.03, isPinned: false, isArchived: false,
    lastAccessedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const MOCK_STATS = {
  stats: {
    vaultId: VAULT_ID, totalMemories: 6, pinned: 1, longTerm: 2,
    working: 3, archived: 1, forgotten: 0, avgStrength: 0.65,
    typeBreakdown: { LONG_TERM: 2, WORKING: 3, ARCHIVED: 1 },
  },
  clusters: [
    { clusterId: 'cl-1', vaultId: VAULT_ID, clusterName: 'research', clusterType: 'TOPIC', memberMemoryIds: ['mem-002', 'mem-006'], cohesionScore: 0.72, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { clusterId: 'cl-2', vaultId: VAULT_ID, clusterName: 'medical', clusterType: 'TOPIC', memberMemoryIds: ['mem-003'], cohesionScore: 0.55, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { clusterId: 'cl-3', vaultId: VAULT_ID, clusterName: 'travel', clusterType: 'TOPIC', memberMemoryIds: ['mem-001'], cohesionScore: 0.61, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const MemoryService = {
  async getMemories(vaultId: string, type?: string): Promise<MemoriesResponse> {
    try {
      const url = type
        ? `${BASE_URL}/memory?vaultId=${vaultId}&type=${type}`
        : `${BASE_URL}/memory?vaultId=${vaultId}`;
      return await apiFetch<MemoriesResponse>(url);
    } catch {
      const filtered = type ? MOCK_MEMORIES.filter((m) => m.memoryType === type) : MOCK_MEMORIES;
      return { memories: filtered, total: filtered.length };
    }
  },

  async getTimeline(vaultId: string): Promise<TimelineResponse> {
    try {
      return await apiFetch<TimelineResponse>(`${BASE_URL}/memory/timeline?vaultId=${vaultId}`);
    } catch {
      const sorted = [...MOCK_MEMORIES].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return { timeline: sorted, total: sorted.length };
    }
  },

  async getDetail(memoryId: string): Promise<MemoryDetail | null> {
    try {
      return await apiFetch<MemoryDetail>(`${BASE_URL}/memory/detail?memoryId=${memoryId}`);
    } catch {
      const mem = MOCK_MEMORIES.find((m) => m.memoryId === memoryId);
      if (!mem) return null;
      return { memory: mem, sources: [], scores: [], events: [] };
    }
  },

  async getStats(vaultId: string): Promise<StatsResponse> {
    try {
      return await apiFetch<StatsResponse>(`${BASE_URL}/memory/stats?vaultId=${vaultId}`);
    } catch {
      return MOCK_STATS;
    }
  },

  async getSettings(vaultId: string): Promise<MemorySettings> {
    try {
      return await apiFetch<MemorySettings>(`${BASE_URL}/memory/settings?vaultId=${vaultId}`);
    } catch {
      return {
        settingsId: 'set-1', vaultId, memoryLearningEnabled: true,
        autoArchiveThreshold: 0.1, autoForgetThreshold: 0.01, defaultDecayRate: 0.03,
        maxWorkingMemories: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
    }
  },

  async pinMemory(memoryId: string, reason: string): Promise<void> {
    try { await apiFetch(`${BASE_URL}/memory/pin`, { method: 'POST', body: JSON.stringify({ memoryId, reason }) }); }
    catch { /* demo */ }
  },

  async archiveMemory(memoryId: string): Promise<void> {
    try { await apiFetch(`${BASE_URL}/memory/archive`, { method: 'POST', body: JSON.stringify({ memoryId }) }); }
    catch { /* demo */ }
  },

  async refreshMemory(vaultId: string): Promise<void> {
    try { await apiFetch(`${BASE_URL}/memory/refresh`, { method: 'POST', body: JSON.stringify({ vaultId }) }); }
    catch { /* demo */ }
  },

  async resetMemory(vaultId: string): Promise<void> {
    try { await apiFetch(`${BASE_URL}/memory/reset`, { method: 'POST', body: JSON.stringify({ vaultId }) }); }
    catch { /* demo */ }
  },

  async deleteMemory(memoryId: string): Promise<void> {
    try { await apiFetch(`${BASE_URL}/memory?memoryId=${memoryId}`, { method: 'DELETE' }); }
    catch { /* demo */ }
  },
};
