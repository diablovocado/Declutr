"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated" | "refreshing" | "error";

export interface SessionUser {
  id: string;
  email: string;
  vaultId?: string;
  name?: string;
}

interface SessionContextType {
  user: SessionUser | null;
  status: SessionStatus;
  isAuthenticated: boolean;
  setUser: (user: SessionUser | null) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = "declutr_session_user";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  // Load persistent session on mount (survives page refreshes)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserState(parsed);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch (err) {
      console.error("Failed to restore session from storage:", err);
      setStatus("unauthenticated");
    }
  }, []);

  const setUser = useCallback((newUser: SessionUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setStatus("authenticated");
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setStatus("unauthenticated");
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus("loading");
    localStorage.removeItem(STORAGE_KEY);
    setUserState(null);
    setStatus("unauthenticated");
    window.location.href = "/login";
  }, []);

  const logoutAll = useCallback(async () => {
    setStatus("loading");
    localStorage.removeItem(STORAGE_KEY);
    setUserState(null);
    setStatus("unauthenticated");
    window.location.href = "/login";
  }, []);

  const refreshSession = useCallback(async () => {
    if (!user) return;
    setStatus("refreshing");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("authenticated");
  }, [user]);

  return (
    <SessionContext.Provider
      value={{
        user,
        status,
        isAuthenticated: !!user && status === "authenticated",
        setUser,
        logout,
        logoutAll,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
