'use client';

import React from 'react';
import type { Citation } from '../types/copilot';

interface CitationViewerProps {
  citations: Citation[];
  confidence?: number;
  reasoningOverview?: string;
}

export function CitationViewer({ citations, confidence, reasoningOverview }: CitationViewerProps) {
  if (citations.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>📜 Grounded Evidence Panel</span>
        {confidence !== undefined && (
          <span style={styles.confidenceText}>{Math.round(confidence * 100)}% Confidence</span>
        )}
      </div>

      {reasoningOverview && (
        <div style={styles.reasoningBox}>
          💡 <b>Reasoning:</b> {reasoningOverview}
        </div>
      )}

      <div style={styles.list}>
        {citations.map((c) => (
          <div key={c.citationId} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.badge}>{c.assetType}</span>
              <span style={styles.cardTitle}>{c.title}</span>
            </div>
            <div style={styles.snippet}>"{c.snippet}"</div>

            <div style={styles.pillsRow}>
              {c.matchedEntities && c.matchedEntities.map((e) => (
                <span key={e} style={styles.entityPill}>👤 {e}</span>
              ))}
              {c.matchedContexts && c.matchedContexts.map((ctx) => (
                <span key={ctx} style={styles.contextPill}>🌐 {ctx}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '13px', fontWeight: 700, color: '#e2e8f0' },
  confidenceText: { fontSize: '11px', color: '#4ade80', fontWeight: 700 },
  reasoningBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '8px' },
  badge: { background: '#1e293b', color: '#38bdf8', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' },
  cardTitle: { fontSize: '12px', fontWeight: 700, color: '#e2e8f0' },
  snippet: { fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.4 },
  pillsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const },
  entityPill: { background: '#a855f715', color: '#c084fc', border: '1px solid #a855f733', borderRadius: '8px', padding: '2px 6px', fontSize: '10px' },
  contextPill: { background: '#6366f115', color: '#818cf8', border: '1px solid #6366f133', borderRadius: '8px', padding: '2px 6px', fontSize: '10px' },
};
