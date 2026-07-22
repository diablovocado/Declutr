import type {
  Conversation,
  Message,
  SendMessageResponse,
  FeedbackRequest,
} from '../types/copilot';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Copilot API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const VAULT_ID = 'vault-demo';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    conversationId: 'conv-japan-001',
    vaultId: VAULT_ID,
    title: 'Japan Trip & Passport Inquiries',
    summary: 'Discussion about passport validity, flight details, and Japanese entry visa requirements.',
    status: 'ACTIVE',
    messageCount: 2,
    lastMessageAt: new Date(Date.now() - 10 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    conversationId: 'conv-thesis-002',
    vaultId: VAULT_ID,
    title: 'PhD Thesis Chapter 4 Neural Networks',
    summary: 'PyTorch benchmark results, attention mechanisms, and graph neural network embeddings.',
    status: 'ACTIVE',
    messageCount: 4,
    lastMessageAt: new Date(Date.now() - 120 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    messageId: 'msg-u1',
    conversationId: 'conv-japan-001',
    vaultId: VAULT_ID,
    role: 'USER',
    content: 'What documents are related to my Japan trip and when does my passport expire?',
    tokensUsed: 18,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    confidence: 1.0,
  },
  {
    messageId: 'msg-a1',
    conversationId: 'conv-japan-001',
    vaultId: VAULT_ID,
    role: 'ASSISTANT',
    content: 'Based on your vault records, your document **"Japanese Visa & Passport Scan"** (PDF) contains your passport photo page and entry visa for Tokyo. Your US Passport is valid for 90-day tourist entry and **expires on September 25, 2025** (in 65 days).',
    tokensUsed: 142,
    confidence: 0.96,
    reasoningOverview: 'Grounded via exact entity match (Tokyo, Japan, Passport) and semantic vector search over document asset-passport-001.',
    citations: [
      {
        citationId: 'cit-001',
        assetId: 'asset-passport-001',
        title: 'Japanese Visa & Passport Scan',
        summary: 'Passport photo page and Japanese entry visa for Tokyo vacation 2025.',
        assetType: 'PDF',
        snippet: 'Passport number A987654321, issued by US Department of State. Expiration Date: 2025-09-25.',
        confidence: 0.98,
        matchedEntities: ['Tokyo', 'Japan', 'Passport'],
        matchedContexts: ['Japan Vacation'],
      },
    ],
    createdAt: new Date(Date.now() - 9 * 60000).toISOString(),
  },
];

export const CopilotService = {
  async getConversations(vaultId: string = VAULT_ID): Promise<Conversation[]> {
    try {
      const res = await apiFetch<{ conversations: Conversation[] }>(`${BASE_URL}/copilot/conversations?vaultId=${vaultId}`);
      return res.conversations ?? [];
    } catch {
      return MOCK_CONVERSATIONS;
    }
  },

  async startConversation(title: string, vaultId: string = VAULT_ID): Promise<Conversation> {
    try {
      return await apiFetch<Conversation>(`${BASE_URL}/copilot/conversations`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, title }),
      });
    } catch {
      return {
        conversationId: `conv-${Date.now()}`,
        vaultId,
        title,
        summary: 'New conversation session initialized.',
        status: 'ACTIVE',
        messageCount: 0,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const res = await apiFetch<{ messages: Message[] }>(`${BASE_URL}/copilot/messages?conversationId=${conversationId}`);
      return res.messages ?? [];
    } catch {
      return MOCK_MESSAGES;
    }
  },

  async sendMessage(question: string, conversationId?: string, vaultId: string = VAULT_ID): Promise<SendMessageResponse> {
    try {
      return await apiFetch<SendMessageResponse>(`${BASE_URL}/copilot/messages`, {
        method: 'POST',
        body: JSON.stringify({ vaultId, conversationId, question }),
      });
    } catch {
      // Mock synthesis fallback
      const userMsg: Message = {
        messageId: `msg-${Date.now()}-u`,
        conversationId: conversationId ?? 'conv-japan-001',
        vaultId,
        role: 'USER',
        content: question,
        tokensUsed: question.length,
        createdAt: new Date().toISOString(),
        confidence: 1.0,
      };

      const isPassport = question.toLowerCase().includes('passport') || question.toLowerCase().includes('japan');
      const asstMsg: Message = {
        messageId: `msg-${Date.now()}-a`,
        conversationId: conversationId ?? 'conv-japan-001',
        vaultId,
        role: 'ASSISTANT',
        content: isPassport
          ? 'Based on your vault document **"Japanese Visa & Passport Scan"** (PDF), your passport photo page and entry visa for Tokyo are on file. Your US Passport expires on **September 25, 2025** (in 65 days).'
          : 'According to your vault records in **"PhD Thesis Chapter 4"** (DOCX), your attention mechanisms and PyTorch benchmark evaluations are documented with high semantic confidence.',
        tokensUsed: 120,
        confidence: 0.95,
        reasoningOverview: 'Grounded via hybrid vector & entity search.',
        citations: MOCK_MESSAGES[1].citations,
        createdAt: new Date().toISOString(),
      };

      return {
        conversationId: conversationId ?? 'conv-japan-001',
        userMessage: userMsg,
        assistantMessage: asstMsg,
        citations: MOCK_MESSAGES[1].citations ?? [],
        intent: isPassport ? 'TIMELINE_QUERY' : 'SUMMARY',
        latencyMs: 18,
      };
    }
  },

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/copilot/conversations?conversationId=${conversationId}`, { method: 'DELETE' });
    } catch { /* mock */ }
  },

  async saveFeedback(messageId: string, rating: 'UPVOTE' | 'DOWNVOTE'): Promise<void> {
    try {
      await apiFetch(`${BASE_URL}/copilot/feedback`, {
        method: 'POST',
        body: JSON.stringify({ messageId, userRating: rating }),
      });
    } catch { /* mock */ }
  },
};
