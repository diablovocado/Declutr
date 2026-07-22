import type {
  TimelineEvent,
  TimelineGroup,
  KnowledgeInsight,
  Milestone,
  InsightStats,
  InsightPreferences,
  TimelineEventType,
} from '../types/insights';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Insights API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_EVENTS: TimelineEvent[] = [
  {
    eventId: 'evt-001',
    vaultId: VAULT_ID,
    eventType: 'TRAVEL',
    title: 'Japan Vacation 2025 Flight Booking',
    summary: 'Flight ticket and hotel reservations filed for Tokyo trip.',
    eventTimestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    importance: 0.88,
    confidence: 0.95,
    relatedAssets: ['asset-passport-001'],
    relatedEntities: ['Tokyo', 'Japan'],
    relatedContexts: ['Japan Vacation'],
    generatedBy: 'SYSTEM',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-002',
    vaultId: VAULT_ID,
    eventType: 'EDUCATION',
    title: 'PhD Thesis Chapter 4 Completed',
    summary: 'Neural networks benchmark draft finalized.',
    eventTimestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
    importance: 0.84,
    confidence: 0.90,
    relatedAssets: ['asset-thesis-002'],
    relatedEntities: ['PyTorch', 'Neural Networks'],
    relatedContexts: ['PhD Thesis'],
    generatedBy: 'SYSTEM',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-003',
    vaultId: VAULT_ID,
    eventType: 'MEDICAL',
    title: 'Cardiology Visit with Dr. Sharma',
    summary: 'Prescription renewed and ECG report filed.',
    eventTimestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
    importance: 0.79,
    confidence: 0.92,
    relatedAssets: ['asset-medical-003'],
    relatedEntities: ['Dr. Sharma', 'Cardiology'],
    relatedContexts: ['Medical Treatment'],
    generatedBy: 'SYSTEM',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-004',
    vaultId: VAULT_ID,
    eventType: 'FINANCIAL',
    title: 'Annual Tax Return Filed 2024',
    summary: 'Form 1040 filed with IRS receipts.',
    eventTimestamp: new Date(Date.now() - 120 * 86400000).toISOString(),
    importance: 0.61,
    confidence: 0.85,
    relatedAssets: ['asset-tax-004'],
    relatedEntities: ['IRS', 'Form 1040'],
    relatedContexts: ['Tax Filing'],
    generatedBy: 'SYSTEM',
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_INSIGHTS: KnowledgeInsight[] = [
  {
    insightId: 'ins-001',
    vaultId: VAULT_ID,
    insightType: 'EXPIRATION_WARNING',
    title: 'Passport Renewal Needed Soon',
    summary: 'Your US Passport expires in 65 days. Renewal recommended before upcoming travel.',
    whyGenerated: 'Passport expiration date detected in document "Japanese Visa & Passport Scan" (expires Sep 2025).',
    evidence: ['Asset: Japanese Visa & Passport Scan', 'Expiration Date: 2025-09-25'],
    relatedAssets: ['asset-passport-001'],
    relatedEntities: ['Passport'],
    importance: 0.95,
    confidence: 0.98,
    isDismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    insightId: 'ins-002',
    vaultId: VAULT_ID,
    insightType: 'RECURRING_EXPENSE',
    title: 'Monthly Subscription Pattern Detected',
    summary: 'Atorvastatin 20mg medication refill occurs every 30 days.',
    whyGenerated: 'Cardiology consultation notes indicate 30-day recurring prescription cycle with Dr. Sharma.',
    evidence: ['Prescription: Atorvastatin 20mg', 'Cycle: 30 days'],
    relatedAssets: ['asset-medical-003'],
    relatedEntities: ['Dr. Sharma'],
    importance: 0.78,
    confidence: 0.90,
    isDismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    insightId: 'ins-003',
    vaultId: VAULT_ID,
    insightType: 'FREQUENT_PLACE',
    title: 'Top Travel Destination: Tokyo, Japan',
    summary: 'Tokyo is your most referenced travel location across 6 vault documents.',
    whyGenerated: 'Location entity "Tokyo" matched across flight bookings, hotel receipts, and itineraries.',
    evidence: ['Entities: Tokyo, Japan', 'Document count: 6'],
    relatedEntities: ['Tokyo', 'Japan'],
    importance: 0.72,
    confidence: 0.88,
    isDismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_MILESTONES: Milestone[] = [
  {
    milestoneId: 'ms-001',
    vaultId: VAULT_ID,
    milestoneType: 'PASSPORT_EXPIRATION',
    title: 'US Passport Renewal Due',
    status: 'UPCOMING',
    dueDate: new Date(Date.now() + 65 * 86400000).toISOString(),
    relatedAssetId: 'asset-passport-001',
    importance: 0.95,
    createdAt: new Date().toISOString(),
  },
  {
    milestoneId: 'ms-002',
    vaultId: VAULT_ID,
    milestoneType: 'TAX_FILED',
    title: 'Tax Return Filing 2024 Completed',
    status: 'COMPLETED',
    relatedAssetId: 'asset-tax-004',
    importance: 0.80,
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
];

export const InsightsService = {
  async getTimeline(eventType?: TimelineEventType, vaultId: string = VAULT_ID): Promise<{ timeline: TimelineEvent[]; groups: TimelineGroup[] }> {
    try {
      const url = eventType
        ? `${BASE_URL}/insights/timeline?vaultId=${vaultId}&eventType=${eventType}`
        : `${BASE_URL}/insights/timeline?vaultId=${vaultId}`;
      const res = await apiFetch<{ timeline: TimelineEvent[]; groups: TimelineGroup[] }>(url);
      return { timeline: res.timeline ?? [], groups: res.groups ?? [] };
    } catch {
      let filtered = [...MOCK_EVENTS];
      if (eventType) {
        filtered = filtered.filter((e) => e.eventType === eventType);
      }
      return { timeline: filtered, groups: [] };
    }
  },

  async getActiveInsights(vaultId: string = VAULT_ID): Promise<KnowledgeInsight[]> {
    try {
      const res = await apiFetch<{ insights: KnowledgeInsight[] }>(`${BASE_URL}/insights?vaultId=${vaultId}`);
      return res.insights ?? [];
    } catch {
      return MOCK_INSIGHTS;
    }
  },

  async dismissInsight(insightId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/insights/dismiss`, {
        method: 'POST',
        body: JSON.stringify({ insightId }),
      });
    } catch { /* mock */ }
  },

  async getMilestones(vaultId: string = VAULT_ID): Promise<Milestone[]> {
    try {
      const res = await apiFetch<{ milestones: Milestone[] }>(`${BASE_URL}/insights/milestones?vaultId=${vaultId}`);
      return res.milestones ?? [];
    } catch {
      return MOCK_MILESTONES;
    }
  },

  async refreshInsights(vaultId: string = VAULT_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/insights/refresh`, {
        method: 'POST',
        body: JSON.stringify({ vaultId }),
      });
    } catch { /* mock */ }
  },

  async getStats(vaultId: string = VAULT_ID): Promise<InsightStats> {
    try {
      return await apiFetch<InsightStats>(`${BASE_URL}/insights/stats?vaultId=${vaultId}`);
    } catch {
      return {
        vaultId,
        totalTimelineEvents: 4,
        totalActiveInsights: 3,
        totalMilestones: 2,
        upcomingExpirations: 1,
        typeBreakdown: { EXPIRATION_WARNING: 1, RECURRING_EXPENSE: 1, FREQUENT_PLACE: 1 },
      };
    }
  },
};
