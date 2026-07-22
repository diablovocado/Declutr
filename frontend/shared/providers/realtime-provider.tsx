"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { realtimeService, ConnectionStatus, RealtimeEventType, RealtimeEvent } from "../../services/realtime-service";
import { presenceService, UserPresence } from "../../services/presence-service";

export interface RealtimeContextType {
  connectionStatus: ConnectionStatus;
  userPresence: UserPresence;
  subscribe: (eventType: RealtimeEventType | "*", callback: (evt: RealtimeEvent) => void) => () => void;
  emit: (type: RealtimeEventType, payload: any) => void;
  ariaAnnouncement: string;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(realtimeService.getStatus());
  const [userPresence, setUserPresence] = useState<UserPresence>(presenceService.getPresence());
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  useEffect(() => {
    const unsubStatus = realtimeService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    const unsubPresence = presenceService.subscribe((presences) => {
      if (presences.length > 0) {
        setUserPresence(presences[0]);
      }
    });

    // Listen to critical events for ARIA Announcements
    const unsubEvents = realtimeService.subscribe("*", (evt) => {
      if (evt.type === "ProcessingCompleted") {
        setAriaAnnouncement(`Processing completed for ${evt.payload?.fileName || "document"}.`);
      } else if (evt.type === "NotificationCreated") {
        setAriaAnnouncement(`Notification: ${evt.payload?.title || "New notification"}.`);
      }
    });

    return () => {
      unsubStatus();
      unsubPresence();
      unsubEvents();
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        connectionStatus,
        userPresence,
        subscribe: (eventType, callback) => realtimeService.subscribe(eventType, callback),
        emit: (type, payload) => realtimeService.emit(type, payload),
        ariaAnnouncement,
      }}
    >
      {/* Accessible ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return ctx;
}
