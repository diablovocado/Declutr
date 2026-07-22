import type {
  Notification,
  NotificationPreferences,
  DigestReport,
  NotificationStats,
  ActionType,
} from '../types/notification';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Notification API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notificationId: 'notif-exp-001',
    vaultId: VAULT_ID,
    type: 'WARNING',
    priority: 'URGENT',
    title: 'Passport Expiring Soon (65 Days)',
    message: 'Your US Passport expires on September 25, 2025. Renewal recommended before upcoming international travel.',
    summary: 'Passport renewal milestone alert generated from Japanese Visa & Passport Scan.',
    relatedAssets: ['asset-passport-001'],
    actionType: 'OPEN_ASSET',
    isRead: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    notificationId: 'notif-wf-002',
    vaultId: VAULT_ID,
    type: 'WORKFLOW',
    priority: 'MEDIUM',
    title: 'Workflow Completed: Auto-tag Travel Documents',
    message: "Workflow successfully processed document 'Japanese Visa & Passport Scan' and applied tags: Travel, Passport.",
    summary: 'Automation rule executed in 45ms.',
    actionType: 'RUN_WORKFLOW',
    isRead: true,
    readAt: new Date(Date.now() - 90 * 60000).toISOString(),
    isDismissed: false,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    notificationId: 'notif-sec-003',
    vaultId: VAULT_ID,
    type: 'SECURITY',
    priority: 'HIGH',
    title: 'Zero-Knowledge Encryption Key Rotation Suggested',
    message: 'It has been 90 days since your zero-knowledge vault master key was rotated.',
    summary: 'Recommended periodic security key rotation for enhanced vault protection.',
    actionType: 'VIEW_CONTEXT',
    isRead: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
  },
];

const MOCK_DIGESTS: DigestReport[] = [
  {
    digestId: 'digest-daily-001',
    vaultId: VAULT_ID,
    digestType: 'DAILY',
    title: 'Daily Intelligence Summary',
    summary: 'Today: 3 new memories formed, 1 document expiring alert, 2 workflows executed, 100% success rate.',
    contentData: { newMemories: 3, expirations: 1, workflowRuns: 2 },
    generatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    digestId: 'digest-weekly-002',
    vaultId: VAULT_ID,
    digestType: 'WEEKLY',
    title: 'Weekly Vault Recap',
    summary: 'This Week: 14 assets ingested, 8 entity relationships discovered, Passport renewal milestone flagged.',
    contentData: { assetsIngested: 14, relationships: 8 },
    generatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

export const NotificationService = {
  async getNotifications(vaultId: string = VAULT_ID): Promise<Notification[]> {
    try {
      const res = await apiFetch<{ notifications: Notification[] }>(`${BASE_URL}/notifications?vaultId=${vaultId}`);
      return res.notifications ?? [];
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  async markRead(notificationIds?: string[], vaultId: string = VAULT_ID): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/notifications/read`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, notificationIds }),
      });
    } catch { /* mock */ }
  },

  async dismissNotification(notificationId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/notifications/dismiss?notificationId=${notificationId}`, { method: 'POST' });
    } catch { /* mock */ }
  },

  async executeAction(notificationId: string, actionType: ActionType): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/notifications/action`, {
        method: 'POST',
        body: JSON.stringify({ notificationId, actionType }),
      });
    } catch { /* mock */ }
  },

  async getDigests(vaultId: string = VAULT_ID): Promise<DigestReport[]> {
    try {
      const res = await apiFetch<{ digests: DigestReport[] }>(`${BASE_URL}/notifications/digests?vaultId=${vaultId}`);
      return res.digests ?? [];
    } catch {
      return MOCK_DIGESTS;
    }
  },

  async getPreferences(vaultId: string = VAULT_ID): Promise<NotificationPreferences> {
    try {
      return await apiFetch<NotificationPreferences>(`${BASE_URL}/notifications/preferences?vaultId=${vaultId}`);
    } catch {
      return {
        preferenceId: 'pref-demo',
        vaultId,
        enabledTypes: ['INFORMATION', 'SUCCESS', 'WARNING', 'CRITICAL', 'REMINDER', 'RECOMMENDATION', 'AI_INSIGHT', 'WORKFLOW', 'SECURITY', 'SYSTEM'],
        inAppEnabled: true,
        emailEnabled: false,
        pushEnabled: false,
        desktopEnabled: false,
        digestFrequency: 'DAILY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async updatePreferences(prefs: NotificationPreferences): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        body: JSON.stringify(prefs),
      });
    } catch { /* mock */ }
  },

  async getStats(vaultId: string = VAULT_ID): Promise<NotificationStats> {
    try {
      return await apiFetch<NotificationStats>(`${BASE_URL}/notifications/stats?vaultId=${vaultId}`);
    } catch {
      return {
        vaultId,
        totalNotifications: 3,
        unreadCount: 2,
        urgentCount: 2,
        readRate: 0.33,
      };
    }
  },
};
