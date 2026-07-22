// Offline-First Sync Engine & Conflict Resolution TypeScript types

export type QueueStatus =
  | 'QUEUED'
  | 'UPLOADING'
  | 'DOWNLOADING'
  | 'RETRY'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type SyncChangeType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'MOVE'
  | 'RENAME'
  | 'PERMISSION_CHANGE';

export type ConflictStrategy =
  | 'LAST_WRITE_WINS'
  | 'FIELD_LEVEL_MERGE'
  | 'VERSION_BASED_MERGE'
  | 'MANUAL_RESOLUTION';

export type ConflictStatus =
  | 'UNRESOLVED'
  | 'RESOLVED_LOCAL'
  | 'RESOLVED_REMOTE'
  | 'RESOLVED_MERGE';

export interface SyncQueueItem {
  queueId: string;
  vaultId: string;
  deviceId: string;
  resourceType: string;
  resourceId: string;
  changeType: SyncChangeType;
  status: QueueStatus;
  payload: Record<string, unknown>;
  retryCount: number;
  errorMsg?: string;
  queuedAt: string;
  updatedAt: string;
}

export interface SyncEvent {
  eventId: string;
  vaultId: string;
  deviceId: string;
  sequenceNum: number;
  resourceType: string;
  resourceId: string;
  changeType: SyncChangeType;
  payload: Record<string, unknown>;
  checksum: string;
  createdAt: string;
}

export interface SyncConflict {
  conflictId: string;
  vaultId: string;
  deviceId: string;
  resourceType: string;
  resourceId: string;
  localPayload: Record<string, unknown>;
  remotePayload: Record<string, unknown>;
  strategy: ConflictStrategy;
  status: ConflictStatus;
  resolvedPayload?: Record<string, unknown>;
  detectedAt: string;
  resolvedAt?: string;
}

export interface DeviceState {
  stateId: string;
  vaultId: string;
  deviceId: string;
  lastPushedSeq: number;
  lastPulledSeq: number;
  lastSyncAt: string;
  isOnline: boolean;
}

export interface SyncStats {
  vaultId: string;
  totalSyncedEvents: number;
  pendingQueueCount: number;
  activeConflictsCount: number;
  lastSyncDurationMs: number;
  updatedAt: string;
}

export interface SyncStatusPayload {
  vaultId: string;
  pendingQueue: number;
  activeConflicts: number;
  status: string;
  syncProtocolVer: string;
}
