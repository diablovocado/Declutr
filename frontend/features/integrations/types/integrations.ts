// Integration Platform & Connector Framework TypeScript types

export type ConnectorType =
  | 'GOOGLE_DRIVE'
  | 'DROPBOX'
  | 'ONEDRIVE'
  | 'GOOGLE_PHOTOS'
  | 'GOOGLE_CALENDAR'
  | 'GMAIL'
  | 'OUTLOOK'
  | 'NOTION'
  | 'SLACK'
  | 'GITHUB'
  | 'GITLAB'
  | 'BOX'
  | 'S3'
  | 'WEBDAV'
  | 'CUSTOM';

export type AuthType =
  | 'OAUTH2'
  | 'OAUTH_PKCE'
  | 'API_KEY'
  | 'PERSONAL_ACCESS_TOKEN'
  | 'SERVICE_ACCOUNT';

export type ConnectorStatus = 'CONFIGURED' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
export type SyncDirection = 'IMPORT_ONLY' | 'EXPORT_ONLY' | 'BIDIRECTIONAL';

export interface ConnectorMarketplaceItem {
  typeKey: ConnectorType;
  name: string;
  description: string;
  category: string;
  icon: string;
  supportedAuth: AuthType[];
}

export interface Connector {
  connectorId: string;
  vaultId: string;
  typeKey: ConnectorType;
  name: string;
  category: string;
  status: ConnectorStatus;
  isEnabled: boolean;
  installedAt: string;
}

export interface ConnectorConfig {
  configId: string;
  connectorId: string;
  syncDirection: SyncDirection;
  autoSyncIntervalMins: number;
  syncFolder: string;
  settings: Record<string, unknown>;
  updatedAt: string;
}

export interface SyncJob {
  jobId: string;
  connectorId: string;
  vaultId: string;
  jobType: string;
  status: string;
  itemsProcessed: number;
  bytesTransferred: number;
  startedAt: string;
  completedAt?: string;
}

export interface ConnectorLog {
  logId: string;
  connectorId: string;
  level: string;
  message: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface HealthCheckResult {
  connectorId: string;
  status: HealthStatus;
  latencyMs: number;
  checkedAt: string;
  errorMsg?: string;
}
