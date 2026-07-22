// Version History, Recovery & Time Machine TypeScript types

export type ResourceType =
  | 'ASSET'
  | 'METADATA'
  | 'AI_ANALYSIS'
  | 'CONTEXT'
  | 'RELATIONSHIP'
  | 'COLLECTION'
  | 'MEMORY'
  | 'WORKFLOW'
  | 'PREFERENCES';

export type ChangeType =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'MOVED'
  | 'RENAMED'
  | 'AI_REGENERATED'
  | 'PERMISSION_CHANGED'
  | 'WORKFLOW_EXECUTED'
  | 'SETTINGS_CHANGED';

export type SnapshotType = 'FULL' | 'INCREMENTAL' | 'DELTA' | 'COMPRESSED' | 'IMMUTABLE';

export interface ResourceVersion {
  versionId: string;
  vaultId: string;
  resourceType: ResourceType;
  resourceId: string;
  versionNumber: number;
  changeType: ChangeType;
  summary: string;
  checksum: string;
  storageRef?: string;
  createdBy: string;
  createdAt: string;
}

export interface VersionSnapshot {
  snapshotId: string;
  versionId: string;
  resourceId: string;
  snapshotType: SnapshotType;
  snapshotData: Record<string, unknown>;
  createdAt: string;
}

export interface RecycleItem {
  recycleId: string;
  vaultId: string;
  resourceType: ResourceType;
  resourceId: string;
  title: string;
  originalPath?: string;
  deletedBy: string;
  deletedAt: string;
  expiresAt?: string;
  isRestored: boolean;
  restoredAt?: string;
}

export interface VersionDiff {
  diffId: string;
  sourceVersionId: string;
  targetVersionId: string;
  addedFields: Record<string, unknown>;
  removedFields: Record<string, unknown>;
  modifiedFields: Record<string, { old: unknown; new: unknown }>;
  computedAt: string;
}

export interface VersioningStats {
  vaultId: string;
  totalVersions: number;
  totalSnapshots: number;
  recycleBinCount: number;
  totalRestores: number;
  storageSavedBytes: number;
}
