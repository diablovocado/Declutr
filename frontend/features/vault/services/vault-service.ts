export interface VaultData {
  vaultId: string;
  ownerId: string;
  displayName: string;
  description: string;
  storageUsageBytes: number;
  itemCount: number;
  collectionCount: number;
  workspaceStatus: "ACTIVE" | "ARCHIVED" | "LOCKED";
  encryptionStatus: "ENCRYPTED" | "DECRYPTING" | "UNENCRYPTED";
  defaultLanguage: string;
  defaultAiMode: string;
  defaultPrivacyMode: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "declutr_user_vault";

export const VaultService = {
  async getCurrentVault(): Promise<VaultData> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {}

    const defaultVault: VaultData = {
      vaultId: "v_life_" + Math.random().toString(36).substring(2, 9),
      ownerId: "usr_current",
      displayName: "My Life Vault",
      description: "Default Zero-Knowledge Personal Vault Workspace",
      storageUsageBytes: 0,
      itemCount: 0,
      collectionCount: 0,
      workspaceStatus: "ACTIVE",
      encryptionStatus: "ENCRYPTED",
      defaultLanguage: "en",
      defaultAiMode: "balanced",
      defaultPrivacyMode: "local_first",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVault));
    return defaultVault;
  },

  async updateVault(data: Partial<VaultData>): Promise<VaultData> {
    const current = await this.getCurrentVault();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
