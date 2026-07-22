'use client';

import React, { useState } from 'react';
import type { Message, Citation } from '../types/copilot';

interface ChatInterfaceProps {
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => void;
  onSelectCitation: (citations: Citation[], confidence?: number, reasoning?: string) => void;
}

export function ChatInterface({
  messages,
  loading,
  onSend,
  onSelectCitation,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div style={styles.chatContainer}>
      {/* Messages Stream */}
      <div style={styles.messageFeed}>
        {messages.map((msg) => {
          const isUser = msg.role === 'USER';
          return (
            <div
              key={msg.messageId}
              style={{ ...styles.msgWrapper, alignSelf: isUser ? 'flex-end' : 'flex-start' }}
            >
              <div style={styles.roleHeader}>
                <span style={styles.roleLabel}>{isUser ? '👤 You' : '🤖 Declutr AI Copilot'}</span>
                {!isUser && msg.confidence > 0 && (
                  <span style={styles.confBadge}>{Math.round(msg.confidence * 100)}% Grounded</span>
                )}
              </div>

              <div style={{ ...styles.msgBubble, ...(isUser ? styles.userBubble : styles.asstBubble) }}>
                {msg.content}
              </div>

              {/* Citations Button */}
              {!isUser && msg.citations && msg.citations.length > 0 && (
                <button
                  style={styles.citationBadge}
                  onClick={() => onSelectCitation(msg.citations!, msg.confidence, msg.reasoningOverview)}
                >
                  📜 Grounded in {msg.citations.length} Vault Document(s) →
                </button>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={styles.loadingBubble}>
            <span style={styles.spinner}>⚡</span> Grounding answer strictly in your vault knowledge...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div style={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask AI Copilot anything about your vault data..."
          style={styles.input}
        />
        <button style={styles.sendBtn} onClick={handleSubmit} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  chatContainer: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a' },
  messageFeed: { flex: 1, padding: '20px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column', gap: '16px' },
  msgWrapper: { maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px' },
  roleHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' },
  roleLabel: { fontSize: '11px', fontWeight: 700, color: '#64748b' },
  confBadge: { background: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8033', borderRadius: '8px', padding: '2px 6px', fontSize: '10px', fontWeight: 700 },
  msgBubble: { borderRadius: '16px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.5 },
  userBubble: { background: '#6366f1', color: '#ffffff' },
  asstBubble: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
  citationBadge: { background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', borderRadius: '10px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '4px', width: 'fit-content' },
  loadingBubble: { alignSelf: 'flex-start', background: '#1e293b', color: '#94a3b8', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', border: '1px solid #334155' },
  spinner: { fontSize: '14px' },
  inputRow: { padding: '16px 20px', borderTop: '1px solid #334155', display: 'flex', gap: '10px', background: '#1e293b' },
  input: { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '10px 16px', color: '#e2e8f0', fontSize: '14px', outline: 'none' },
  sendBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
};
