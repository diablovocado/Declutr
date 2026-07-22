/**
 * Official Declutr Extension SDK
 */

export interface ExtensionContext {
  extensionId: string;
  version: string;
  permissions: string[];
}

export interface ExtensionManifestSpec {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
  type: string;
  permissions: string[];
}

export class DeclutrExtension {
  private context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  // Vault API
  public async getVaults(): Promise<any[]> {
    this.verifyPermission("vault.read");
    return [{ id: "vault-1", name: "Default Vault" }];
  }

  // Search Provider API
  public async registerSearchProvider(providerName: string, queryFn: (q: string) => Promise<any[]>): Promise<void> {
    this.verifyPermission("search.query");
    console.log(`Registered search provider: ${providerName}`);
  }

  // AI Grounded Provider API
  public async generateAIResponse(prompt: string): Promise<string> {
    this.verifyPermission("ai.generate");
    return `AI Extension Response for: ${prompt}`;
  }

  // Workflow Trigger API
  public async triggerWorkflowAction(actionId: string, payload: any): Promise<boolean> {
    this.verifyPermission("workflow.execute");
    return true;
  }

  // Notification API
  public async sendNotification(title: string, message: string): Promise<void> {
    this.verifyPermission("notification.send");
    console.log(`Notification sent: ${title} - ${message}`);
  }

  private verifyPermission(permission: string) {
    if (!this.context.permissions.includes(permission) && !this.context.permissions.includes("admin.manage")) {
      throw new Error(`Extension Permission Error: '${permission}' not granted`);
    }
  }
}
