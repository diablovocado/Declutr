"use client";

export type ConnectionStatus = "CONNECTED" | "RECONNECTING" | "OFFLINE";

export type RealtimeEventType =
  | "UploadStarted"
  | "UploadProgress"
  | "UploadCompleted"
  | "ProcessingStarted"
  | "ProcessingProgress"
  | "ProcessingCompleted"
  | "MetadataUpdated"
  | "SummaryGenerated"
  | "EmbeddingCreated"
  | "SearchIndexed"
  | "WorkflowStarted"
  | "WorkflowCompleted"
  | "NotificationCreated"
  | "CollectionUpdated"
  | "FileMoved"
  | "FileDeleted"
  | "PresenceUpdated"
  | "SessionExpired";

export interface RealtimeEvent<T = any> {
  id: string;
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
}

type EventCallback = (event: RealtimeEvent) => void;

class RealtimeService {
  private status: ConnectionStatus = "OFFLINE";
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private heartbeatTimer: any = null;
  private reconnectTimer: any = null;
  private isBrowser: boolean = typeof window !== "undefined";

  constructor() {
    if (this.isBrowser) {
      this.connect();
    }
  }

  public connect(): void {
    if (this.status === "CONNECTED") return;
    this.setStatus("CONNECTED");
    this.startHeartbeat();
  }

  public disconnect(): void {
    this.stopHeartbeat();
    this.setStatus("OFFLINE");
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public subscribe(eventType: RealtimeEventType | "*", callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(callback);
      }
    };
  }

  public onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  public emit(type: RealtimeEventType, payload: any): void {
    const event: RealtimeEvent = {
      id: "evt_" + Math.random().toString(36).substring(2, 9),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Specific listeners
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((cb) => cb(event));
    }

    // Catch-all listeners
    const catchAll = this.listeners.get("*");
    if (catchAll) {
      catchAll.forEach((cb) => cb(event));
    }
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.statusListeners.forEach((cb) => cb(status));
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      // Simulate connection health monitoring
      if (this.status === "CONNECTED") {
        // Heartbeat ping OK
      }
    }, 15000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const realtimeService = new RealtimeService();
