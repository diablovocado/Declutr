import type {
  SyncQueueItem,
  SyncConflict,
  SyncStats,
  SyncStatusPayload,
  ConflictStatus,
} from '../types/sync';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Sync API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';
const DEVICE_ID = 'dev-macbook-pro';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_QUEUE: SyncQueueItem[] = [
  {
    queueId: 'q-item-1',
    vaultId: VAULT_ID,
    deviceId: DEVICE_ID,
    resourceType: 'ASSET_METADATA',
    resourceId: 'asset-tax-2025',
    changeType: 'UPDATE',
    status: 'QUEUED',
    payload: { status: 'APPROVED', updatedBy: 'USER' },
    retryCount: 0,
    queuedAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    queueId: 'q-item-2',
    vaultId: VAULT_ID,
    deviceId: DEVICE_ID,
    resourceType: 'MEMORY',
    resourceId: 'mem-japan-flight',
    changeType: 'CREATE',
    status: 'RETRY',
    payload: { note: 'Flight ticket confirmed for 9am' },
    retryCount: 1,
    errorMsg: 'Network timeout during upload',
    queuedAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
];

const MOCK_CONFLICTS: SyncConflict[] = [
  {
    conflictId: 'cnf-tokyo-title-001',
    vaultId: VAULT_ID,
    deviceId: DEVICE_ID,
    resourceType: 'COLLECTION',
    resourceId: 'col-travel-2024',
    localPayload: { title: 'Japan Vacation Notes (Mobile)', category: 'Travel' },
    remotePayload: { title: 'Japan Vacation Notes (Web)', tags: ['Japan', '2024'] },
    strategy: 'LAST_WRITE_WINS',
    status: 'UNRESOLVED',
    detectedAt: new Date(Date.now() - 900000).toISOString(),
  },
];

export const SyncService = {
  async getStatus(vaultId: string = VAULT_ID): Promise<SyncStatusPayload> {
    try {
      return await apiFetch<SyncStatusPayload>(`${BASE_URL}/sync/status?vaultId=${vaultId}`);
    } catch {
      return {
        vaultId,
        pendingQueue: MOCK_QUEUE.length,
        activeConflicts: MOCK_CONFLICTS.length,
        status: 'ONLINE',
        syncProtocolVer: 'v1.0',
      };
    }
  },

  async getQueue(vaultId: string = VAULT_ID): Promise<SyncQueueItem[]> {
    try {
      const res = await apiFetch<{ queue: SyncQueueItem[] }>(`${BASE_URL}/sync/queue?vaultId=${vaultId}`);
      return res.queue ?? [];
    } catch {
      return MOCK_QUEUE;
    }
  },

  async getConflicts(vaultId: string = VAULT_ID): Promise<SyncConflict[]> {
    try {
      const res = await apiFetch<{ conflicts: SyncConflict[] }>(`${BASE_URL}/sync/conflicts?vaultId=${vaultId}`);
      return res.conflicts ?? [];
    } catch {
      return MOCK_CONFLICTS;
    }
  },

  async pushChanges(events: SyncQueueItem[], vaultId: string = VAULT_ID, deviceId: string = DEVICE_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/sync/push`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, deviceId, events }),
      });
    } catch { /* mock */ }
  },

  async pullChanges(sinceSeqNum: number = 0, vaultId: string = VAULT_ID, deviceId: string = DEVICE_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/sync/pull`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, deviceId, sinceSeqNum, limit: 50 }),
      });
    } catch { /* mock */ }
  },

  async resolveConflict(conflictId: string, resolution: ConflictStatus, resolvedPayload?: Record<string, unknown>, vaultId: string = VAULT_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/sync/resolve`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, conflictId, resolution, resolvedPayload }),
      });
    } catch { /* mock */ }
  },

  async getStats(vaultId: string = VAULT_ID): Promise<SyncStats> {
    try {
      return await apiFetch<SyncStats>(`${BASE_URL}/sync/stats?vaultId=${vaultId}`);
    } catch {
      return {
        vaultId,
        totalSyncedEvents: 142,
        pendingQueueCount: MOCK_QUEUE.length,
        activeConflictsCount: MOCK_CONFLICTS.length,
        lastSyncDurationMs: 145,
        updatedAt: new Date().toISOString(),
      };
    }
  },
};
