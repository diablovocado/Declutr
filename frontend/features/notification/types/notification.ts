// Notification Center & Proactive Intelligence TypeScript types

export type NotificationType =
  | 'INFORMATION'
  | 'SUCCESS'
  | 'WARNING'
  | 'CRITICAL'
  | 'REMINDER'
  | 'RECOMMENDATION'
  | 'AI_INSIGHT'
  | 'WORKFLOW'
  | 'SECURITY'
  | 'SYSTEM';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ActionType =
  | 'NONE'
  | 'OPEN_ASSET'
  | 'VIEW_CONTEXT'
  | 'RUN_WORKFLOW'
  | 'RETRY_JOB'
  | 'DISMISS'
  | 'PIN'
  | 'ARCHIVE'
  | 'SNOOZE';

export type DigestType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface Notification {
  notificationId: string;
  vaultId: string;
  type: NotificationType;
  priority: PriorityLevel;
  title: string;
  message: string;
  summary?: string;
  relatedAssets?: string[];
  relatedContext?: Record<string, unknown>;
  relatedWorkflow?: Record<string, unknown>;
  actionType: ActionType;
  isRead: boolean;
  readAt?: string;
  isDismissed: boolean;
  dismissedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  preferenceId: string;
  vaultId: string;
  enabledTypes: NotificationType[];
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  desktopEnabled: boolean;
  digestFrequency: DigestType;
  createdAt: string;
  updatedAt: string;
}

export interface DigestReport {
  digestId: string;
  vaultId: string;
  digestType: DigestType;
  title: string;
  summary: string;
  contentData: Record<string, unknown>;
  generatedAt: string;
}

export interface NotificationStats {
  vaultId: string;
  totalNotifications: number;
  unreadCount: number;
  urgentCount: number;
  readRate: number;
}
