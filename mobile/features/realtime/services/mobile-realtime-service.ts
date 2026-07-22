type RealtimeStatus = 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';

export interface MobileRealtimeEvent {
  type: string;
  payload: any;
  timestamp: string;
}

type EventCallback = (event: MobileRealtimeEvent) => void;

class MobileRealtimeService {
  private status: RealtimeStatus = 'CONNECTED';
  private listeners: Map<string, Set<EventCallback>> = new Map();

  public getStatus(): RealtimeStatus {
    return this.status;
  }

  public subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) set.delete(callback);
    };
  }

  public emit(type: string, payload: any): void {
    const event: MobileRealtimeEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach((cb) => cb(event));
    }
  }
}

export const mobileRealtimeService = new MobileRealtimeService();
