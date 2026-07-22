// Declutr AI Copilot TypeScript types

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type IntentCategory = 'SUMMARY' | 'TIMELINE_QUERY' | 'MEMORY_RECALL' | 'ENTITY_EXPLORE' | 'GENERAL_QA';

export interface Citation {
  citationId: string;
  assetId: string;
  title: string;
  summary: string;
  assetType: string;
  snippet: string;
  confidence: number;
  matchedEntities?: string[];
  matchedContexts?: string[];
}

export interface Message {
  messageId: string;
  conversationId: string;
  vaultId: string;
  role: MessageRole;
  content: string;
  tokensUsed: number;
  citations?: Citation[];
  confidence: number;
  reasoningOverview?: string;
  createdAt: string;
}

export interface Conversation {
  conversationId: string;
  vaultId: string;
  title: string;
  summary: string;
  status: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  citations: Citation[];
  intent: string;
  latencyMs: number;
}

export interface FeedbackRequest {
  messageId: string;
  userRating: 'UPVOTE' | 'DOWNVOTE';
  comment?: string;
}
