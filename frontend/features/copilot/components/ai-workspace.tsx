'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, Message, Citation } from '../types/copilot';
import { ConversationSidebar } from './conversation-sidebar';
import { ChatInterface } from './chat-interface';
import { CitationViewer } from './citation-viewer';
import { SuggestedQuestions } from './suggested-questions';
import { CopilotService } from '../services/copilot-service';

export function AIWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState<{ citations: Citation[]; confidence?: number; reasoning?: string } | null>(null);

  useEffect(() => {
    CopilotService.getConversations().then((res) => {
      setConversations(res);
      if (res.length > 0) {
        setActiveConv(res[0]);
        CopilotService.getMessages(res[0].conversationId).then(setMessages);
      }
    });
  }, []);

  const handleSelectConv = async (conv: Conversation) => {
    setActiveConv(conv);
    const msgs = await CopilotService.getMessages(conv.conversationId);
    setMessages(msgs);
    if (msgs.length > 1 && msgs[1].citations) {
      setSelectedCitations({
        citations: msgs[1].citations,
        confidence: msgs[1].confidence,
        reasoning: msgs[1].reasoningOverview,
      });
    }
  };

  const handleNewChat = async () => {
    const newConv = await CopilotService.startConversation('New Vault Session');
    setConversations((prev) => [newConv, ...prev]);
    setActiveConv(newConv);
    setMessages([]);
    setSelectedCitations(null);
  };

  const handleDeleteConv = async (id: string) => {
    await CopilotService.deleteConversation(id);
    const updated = conversations.filter((c) => c.conversationId !== id);
    setConversations(updated);
    if (activeConv?.conversationId === id) {
      if (updated.length > 0) {
        handleSelectConv(updated[0]);
      } else {
        setActiveConv(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (text: string) => {
    setLoading(true);
    const resp = await CopilotService.sendMessage(text, activeConv?.conversationId);
    setMessages((prev) => [...prev, resp.userMessage, resp.assistantMessage]);
    setSelectedCitations({
      citations: resp.citations,
      confidence: resp.assistantMessage.confidence,
      reasoning: resp.assistantMessage.reasoningOverview,
    });
    setLoading(false);
  };

  return (
    <div style={styles.workspace}>
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConv?.conversationId ?? null}
        onSelect={handleSelectConv}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConv}
      />

      <div style={styles.centerArea}>
        <div style={styles.header}>
          <h2 style={styles.title}>🤖 Declutr AI Copilot</h2>
          <span style={styles.subtitle}>Personal intelligence grounded strictly in your vault</span>
        </div>

        {messages.length === 0 && (
          <div style={styles.suggestedBox}>
            <SuggestedQuestions onSelect={handleSend} />
          </div>
        )}

        <ChatInterface
          messages={messages}
          loading={loading}
          onSend={handleSend}
          onSelectCitation={(c, conf, r) => setSelectedCitations({ citations: c, confidence: conf, reasoning: r })}
        />
      </div>

      {selectedCitations && (
        <CitationViewer
          citations={selectedCitations.citations}
          confidence={selectedCitations.confidence}
          reasoningOverview={selectedCitations.reasoning}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  workspace: { display: 'flex', height: 'calc(100vh - 64px)', background: '#0f172a', overflow: 'hidden' },
  centerArea: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%' },
  header: { padding: '16px 20px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  subtitle: { fontSize: '12px', color: '#64748b' },
  suggestedBox: { padding: '16px 20px 0' },
};
