'use client';

import React from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTIONS = [
  'What documents are related to my Japan trip?',
  'When does my passport expire?',
  'Summarize my PhD thesis chapter on neural networks.',
  'What cardiology prescriptions did Dr. Sharma renew?',
];

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div style={styles.container}>
      <span style={styles.label}>💡 Suggested Vault Questions:</span>
      <div style={styles.chipsRow}>
        {SUGGESTIONS.map((q, i) => (
          <button key={i} style={styles.chip} onClick={() => onSelect(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  label: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const },
  chipsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
  chip: { background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', textAlign: 'left' as const },
};
