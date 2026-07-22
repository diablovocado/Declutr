"use client";

export type UserPresenceStatus = "ONLINE" | "IDLE" | "OFFLINE";

export interface UserPresence {
  userId: string;
  userName: string;
  status: UserPresenceStatus;
  device: string;
  lastActive: string;
  activeVaultId: string;
}

type PresenceCallback = (presences: UserPresence[]) => void;

class PresenceService {
  private currentPresence: UserPresence = {
    userId: "usr_me",
    userName: "Maithili Pawar",
    status: "ONLINE",
    device: typeof navigator !== "undefined" ? navigator.userAgent : "Desktop Web",
    lastActive: new Date().toISOString(),
    activeVaultId: "v_default",
  };

  private listeners: Set<PresenceCallback> = new Set();
  private idleTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initActivityTracker();
    }
  }

  public getPresence(): UserPresence {
    return this.currentPresence;
  }

  public setStatus(status: UserPresenceStatus): void {
    this.currentPresence.status = status;
    this.currentPresence.lastActive = new Date().toISOString();
    this.notify();
  }

  public subscribe(callback: PresenceCallback): () => void {
    this.listeners.add(callback);
    callback([this.currentPresence]);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb([this.currentPresence]));
  }

  private initActivityTracker(): void {
    const resetTimer = () => {
      if (this.currentPresence.status === "IDLE") {
        this.setStatus("ONLINE");
      }
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.setStatus("IDLE");
      }, 300000); // 5 mins idle
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
  }
}

export const presenceService = new PresenceService();
