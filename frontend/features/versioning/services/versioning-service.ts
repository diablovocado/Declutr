import type {
  ResourceVersion,
  RecycleItem,
  VersionDiff,
  VersioningStats,
} from '../types/versioning';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Versioning API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_VERSIONS: ResourceVersion[] = [
  {
    versionId: 'ver-japan-v1',
    vaultId: VAULT_ID,
    resourceType: 'ASSET',
    resourceId: 'asset-passport-001',
    versionNumber: 1,
    changeType: 'CREATED',
    summary: 'Initial document upload: Japanese Visa Scan',
    checksum: 'sha256-abc123v1',
    createdBy: 'USER',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    versionId: 'ver-japan-v2',
    vaultId: VAULT_ID,
    resourceType: 'ASSET',
    resourceId: 'asset-passport-001',
    versionNumber: 2,
    changeType: 'AI_REGENERATED',
    summary: 'AI analysis regenerated: Extracted expiration date 2025-09-25',
    checksum: 'sha256-abc123v2',
    createdBy: 'AI_WORKER',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const MOCK_RECYCLE_ITEMS: RecycleItem[] = [
  {
    recycleId: 'recycle-old-draft-001',
    vaultId: VAULT_ID,
    resourceType: 'ASSET',
    resourceId: 'asset-old-itinerary',
    title: 'Draft Tokyo Itinerary 2024.docx',
    originalPath: '/Travel/Drafts/Tokyo.docx',
    deletedBy: 'USER',
    deletedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 86400000).toISOString(),
    isRestored: false,
  },
];

const MOCK_DIFF: VersionDiff = {
  diffId: 'diff-demo-001',
  sourceVersionId: 'ver-japan-v1',
  targetVersionId: 'ver-japan-v2',
  addedFields: { expirationDate: '2025-09-25', confidence: 0.98 },
  removedFields: {},
  modifiedFields: {
    status: { old: 'UNPROCESSED', new: 'ANALYZED' },
  },
  computedAt: new Date().toISOString(),
};

export const VersioningService = {
  async getVersions(vaultId: string = VAULT_ID, resourceId?: string): Promise<ResourceVersion[]> {
    try {
      const url = resourceId
        ? `${BASE_URL}/versions?vaultId=${vaultId}&resourceId=${resourceId}`
        : `${BASE_URL}/versions?vaultId=${vaultId}`;
      const res = await apiFetch<{ versions: ResourceVersion[] }>(url);
      return res.versions ?? [];
    } catch {
      return MOCK_VERSIONS;
    }
  },

  async compareVersions(sourceVersionId: string, targetVersionId: string): Promise<VersionDiff> {
    try {
      return await apiFetch<VersionDiff>(`${BASE_URL}/versions/compare`, {
        method: 'POST',
        body: JSON.stringify({ sourceVersionId, targetVersionId }),
      });
    } catch {
      return MOCK_DIFF;
    }
  },

  async restoreVersion(versionId: string, resourceId: string, vaultId: string = VAULT_ID): Promise<ResourceVersion> {
    try {
      return await apiFetch<ResourceVersion>(`${BASE_URL}/versions/restore`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, resourceId, versionId }),
      });
    } catch {
      return {
        versionId: `ver-restored-${Date.now()}`,
        vaultId,
        resourceType: 'ASSET',
        resourceId,
        versionNumber: 3,
        changeType: 'UPDATED',
        summary: `Restored to version ${versionId}`,
        checksum: 'sha256-restored',
        createdBy: 'USER',
        createdAt: new Date().toISOString(),
      };
    }
  },

  async getRecycleBin(vaultId: string = VAULT_ID): Promise<RecycleItem[]> {
    try {
      const res = await apiFetch<{ items: RecycleItem[] }>(`${BASE_URL}/recyclebin?vaultId=${vaultId}`);
      return res.items ?? [];
    } catch {
      return MOCK_RECYCLE_ITEMS;
    }
  },

  async restoreRecycleItem(recycleId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/recyclebin/restore?recycleId=${recycleId}`, { method: 'POST' });
    } catch { /* mock */ }
  },

  async purgeRecycleItem(recycleId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/recyclebin/purge?recycleId=${recycleId}`, { method: 'DELETE' });
    } catch { /* mock */ }
  },

  async getStats(vaultId: string = VAULT_ID): Promise<VersioningStats> {
    try {
      return await apiFetch<VersioningStats>(`${BASE_URL}/versions/stats?vaultId=${vaultId}`);
    } catch {
      return {
        vaultId,
        totalVersions: 2,
        totalSnapshots: 2,
        recycleBinCount: 1,
        totalRestores: 3,
        storageSavedBytes: 44040192,
      };
    }
  },
};
