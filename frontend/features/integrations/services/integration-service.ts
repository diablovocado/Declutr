import type {
  ConnectorMarketplaceItem,
  Connector,
  SyncJob,
  ConnectorLog,
  HealthCheckResult,
  ConnectorType,
} from '../types/integrations';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Integrations API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_MARKETPLACE: ConnectorMarketplaceItem[] = [
  { typeKey: 'GOOGLE_DRIVE', name: 'Google Drive', description: 'Import PDF, Docs, and media from Google Drive folders.', category: 'STORAGE', icon: '📁', supportedAuth: ['OAUTH2', 'OAUTH_PKCE'] },
  { typeKey: 'DROPBOX', name: 'Dropbox', description: 'Sync files and documents from your Dropbox accounts.', category: 'STORAGE', icon: '📦', supportedAuth: ['OAUTH2'] },
  { typeKey: 'NOTION', name: 'Notion Workspace', description: 'Import Notion pages, databases, and structured notes.', category: 'PRODUCTIVITY', icon: '📝', supportedAuth: ['PERSONAL_ACCESS_TOKEN', 'OAUTH2'] },
  { typeKey: 'GITHUB', name: 'GitHub Repositories', description: 'Index code, issues, PRs, and markdown documentation.', category: 'CODE', icon: '🐙', supportedAuth: ['PERSONAL_ACCESS_TOKEN', 'OAUTH2'] },
  { typeKey: 'S3', name: 'Amazon S3 / R2', description: 'Connect AWS S3 or Cloudflare R2 object storage buckets.', category: 'STORAGE', icon: '🪣', supportedAuth: ['API_KEY', 'SERVICE_ACCOUNT'] },
  { typeKey: 'WEBDAV', name: 'WebDAV / Nextcloud', description: 'Import from personal WebDAV servers and Nextcloud instances.', category: 'STORAGE', icon: '🌐', supportedAuth: ['API_KEY', 'PERSONAL_ACCESS_TOKEN'] },
];

const MOCK_INSTALLED: Connector[] = [
  { connectorId: 'conn-gdrive-001', vaultId: VAULT_ID, typeKey: 'GOOGLE_DRIVE', name: 'Google Drive (Personal)', category: 'STORAGE', status: 'CONNECTED', isEnabled: true, installedAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { connectorId: 'conn-webdav-002', vaultId: VAULT_ID, typeKey: 'WEBDAV', name: 'Nextcloud Home WebDAV', category: 'STORAGE', status: 'CONNECTED', isEnabled: true, installedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
];

const MOCK_LOGS: ConnectorLog[] = [
  { logId: 'l1', connectorId: 'conn-gdrive-001', level: 'INFO', message: 'Connector initialized and OAuth2 tokens validated.', createdAt: new Date(Date.now() - 600000).toISOString() },
  { logId: 'l2', connectorId: 'conn-gdrive-001', level: 'INFO', message: 'Full import job finished: 12 assets ingested into vault.', createdAt: new Date(Date.now() - 300000).toISOString() },
];

export const IntegrationService = {
  async getIntegrations(vaultId: string = VAULT_ID): Promise<{ marketplace: ConnectorMarketplaceItem[]; installed: Connector[] }> {
    try {
      return await apiFetch<{ marketplace: ConnectorMarketplaceItem[]; installed: Connector[] }>(`${BASE_URL}/integrations?vaultId=${vaultId}`);
    } catch {
      return { marketplace: MOCK_MARKETPLACE, installed: MOCK_INSTALLED };
    }
  },

  async installConnector(typeKey: ConnectorType, name: string, category: string, vaultId: string = VAULT_ID): Promise<Connector> {
    try {
      return await apiFetch<Connector>(`${BASE_URL}/integrations/install`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, typeKey, name, category }),
      });
    } catch {
      return {
        connectorId: `conn-${Date.now()}`,
        vaultId,
        typeKey,
        name,
        category,
        status: 'CONNECTED',
        isEnabled: true,
        installedAt: new Date().toISOString(),
      };
    }
  },

  async toggleConnector(connectorId: string, enable: boolean, vaultId: string = VAULT_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/integrations/enable`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, connectorId, enable }),
      });
    } catch { /* mock */ }
  },

  async triggerSync(connectorId: string, vaultId: string = VAULT_ID): Promise<SyncJob> {
    try {
      return await apiFetch<SyncJob>(`${BASE_URL}/integrations/sync`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, connectorId, jobType: 'FULL_IMPORT' }),
      });
    } catch {
      return {
        jobId: `job-${Date.now()}`,
        connectorId,
        vaultId,
        jobType: 'FULL_IMPORT',
        status: 'COMPLETED',
        itemsProcessed: 12,
        bytesTransferred: 10485760,
        startedAt: new Date().toISOString(),
      };
    }
  },

  async getHealthStatus(connectorId: string): Promise<HealthCheckResult> {
    try {
      return await apiFetch<HealthCheckResult>(`${BASE_URL}/integrations/status?connectorId=${connectorId}`);
    } catch {
      return { connectorId, status: 'HEALTHY', latencyMs: 38, checkedAt: new Date().toISOString() };
    }
  },

  async getLogs(connectorId: string): Promise<ConnectorLog[]> {
    try {
      const res = await apiFetch<{ logs: ConnectorLog[] }>(`${BASE_URL}/integrations/logs?connectorId=${connectorId}`);
      return res.logs ?? [];
    } catch {
      return MOCK_LOGS;
    }
  },
};
