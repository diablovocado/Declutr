"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WorkspaceItem {
  id: string;
  name: string;
  type?: "vault" | "collection" | "project" | "document" | "chat" | "search";
}

export interface WorkspaceContextType {
  activeVault: WorkspaceItem;
  activeCollection: WorkspaceItem | null;
  activeProject: WorkspaceItem | null;
  activeDocument: WorkspaceItem | null;
  activeChat: WorkspaceItem | null;
  activeSearch: string | null;
  recentContexts: WorkspaceItem[];
  switchVault: (vault: WorkspaceItem) => void;
  switchCollection: (collection: WorkspaceItem | null) => void;
  switchProject: (project: WorkspaceItem | null) => void;
  setActiveDocument: (doc: WorkspaceItem | null) => void;
  setActiveChat: (chat: WorkspaceItem | null) => void;
  setActiveSearch: (query: string | null) => void;
  clearActiveContext: () => void;
}

const defaultVault: WorkspaceItem = { id: "v_default", name: "My Life Vault", type: "vault" };

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceContextProvider({ children }: { children: React.ReactNode }) {
  const [activeVault, setActiveVault] = useState<WorkspaceItem>(defaultVault);
  const [activeCollection, setActiveCollection] = useState<WorkspaceItem | null>({
    id: "col_tax_2025",
    name: "Financial & Tax 2025",
    type: "collection",
  });
  const [activeProject, setActiveProject] = useState<WorkspaceItem | null>({
    id: "proj_tax_filing",
    name: "2025 Tax Filing",
    type: "project",
  });
  const [activeDocument, setActiveDocument] = useState<WorkspaceItem | null>({
    id: "file_demo_01",
    name: "Tax_Filing_Form_1040_2025.pdf",
    type: "document",
  });
  const [activeChat, setActiveChat] = useState<WorkspaceItem | null>({
    id: "c1",
    name: "Tax Return AI Chat",
    type: "chat",
  });
  const [activeSearch, setActiveSearch] = useState<string | null>("Tax form 2025");

  const [recentContexts, setRecentContexts] = useState<WorkspaceItem[]>([
    { id: "file_demo_01", name: "Tax_Filing_Form_1040_2025.pdf", type: "document" },
    { id: "col_tax_2025", name: "Financial & Tax 2025", type: "collection" },
    { id: "file_demo_02", name: "Cardiology_Prescription.pdf", type: "document" },
  ]);

  const pushRecentContext = (item: WorkspaceItem) => {
    setRecentContexts((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      return [item, ...filtered].slice(0, 5);
    });
  };

  const switchVault = (vault: WorkspaceItem) => {
    setActiveVault(vault);
    pushRecentContext(vault);
  };

  const switchCollection = (collection: WorkspaceItem | null) => {
    setActiveCollection(collection);
    if (collection) pushRecentContext(collection);
  };

  const switchProject = (project: WorkspaceItem | null) => {
    setActiveProject(project);
    if (project) pushRecentContext(project);
  };

  const setDoc = (doc: WorkspaceItem | null) => {
    setActiveDocument(doc);
    if (doc) pushRecentContext(doc);
  };

  const clearActiveContext = () => {
    setActiveCollection(null);
    setActiveProject(null);
    setActiveDocument(null);
    setActiveChat(null);
    setActiveSearch(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeVault,
        activeCollection,
        activeProject,
        activeDocument,
        activeChat,
        activeSearch,
        recentContexts,
        switchVault,
        switchCollection,
        switchProject,
        setActiveDocument: setDoc,
        setActiveChat,
        setActiveSearch,
        clearActiveContext,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceContextProvider");
  }
  return ctx;
}
