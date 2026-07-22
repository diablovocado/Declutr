'use client';

import React from 'react';
import type { Conversation } from '../types/copilot';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <div style={styles.sidebar}>
      <button style={styles.newChatBtn} onClick={onNewChat}>
        ✨ New Vault Conversation
      </button>

      <div style={styles.sectionTitle}>💬 Conversation History</div>

      <div style={styles.list}>
        {conversations.map((conv) => {
          const active = activeId === conv.conversationId;
          return (
            <div
              key={conv.conversationId}
              style={{ ...styles.card, ...(active ? styles.cardActive : {}) }}
              onClick={() => onSelect(conv)}
            >
              <div style={styles.cardHeader}>
                <span style={styles.title}>{conv.title}</span>
                <button
                  style={styles.delBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.conversationId);
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={styles.summary}>{conv.summary}</div>
              <div style={styles.metaRow}>
                <span>{conv.messageCount} messages</span>
                <span>{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: { width: '280px', background: '#1e293b', borderRight: '1px solid #334155', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' },
  newChatBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' as const },
  sectionTitle: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' as const, flex: 1 },
  card: { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' },
  cardActive: { borderColor: '#6366f1', background: '#6366f115' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '13px', fontWeight: 700, color: '#e2e8f0' },
  delBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer' },
  summary: { fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 },
  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' },
};
