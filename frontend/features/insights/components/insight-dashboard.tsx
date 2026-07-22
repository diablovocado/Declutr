'use client';

import React, { useState, useEffect } from 'react';
import type { KnowledgeInsight } from '../types/insights';
import { InsightsService } from '../services/insights-service';

export function InsightDashboard() {
  const [insights, setInsights] = useState<KnowledgeInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    InsightsService.getActiveInsights().then((res) => {
      setInsights(res);
      setLoading(false);
    });
  }, []);

  const handleDismiss = async (id: string) => {
    await InsightsService.dismissInsight(id);
    setInsights((prev) => prev.filter((item) => item.insightId !== id));
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loading}>Scanning vault for proactive insights...</div>
      ) : insights.length === 0 ? (
        <div style={styles.empty}>🎉 No active warnings or pending insights. Your vault is fully decluttered!</div>
      ) : (
        <div style={styles.list}>
          {insights.map((ins) => {
            const isWarning = ins.insightType === 'EXPIRATION_WARNING';
            return (
              <div
                key={ins.insightId}
                style={{
                  ...styles.card,
                  borderColor: isWarning ? '#ef444466' : '#334155',
                  background: isWarning ? '#ef44440a' : '#1e293b',
                }}
              >
                <div style={styles.cardTop}>
                  <div style={styles.titleRow}>
                    <span style={styles.icon}>{isWarning ? '⚠️' : '💡'}</span>
                    <span style={styles.title}>{ins.title}</span>
                  </div>
                  <button style={styles.dismissBtn} onClick={() => handleDismiss(ins.insightId)}>
                    Dismiss ✕
                  </button>
                </div>

                <div style={styles.summary}>{ins.summary}</div>

                {/* Explainability Rationale */}
                <div style={styles.whyBox}>
                  <span style={styles.whyLabel}><b>Why generated:</b> {ins.whyGenerated}</span>
                </div>

                {/* Evidence List */}
                {ins.evidence && ins.evidence.length > 0 && (
                  <div style={styles.evidenceRow}>
                    {ins.evidence.map((ev, i) => (
                      <span key={i} style={styles.evidenceChip}>📌 {ev}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { border: '1px solid', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  icon: { fontSize: '18px' },
  title: { fontSize: '16px', fontWeight: 700, color: '#e2e8f0' },
  dismissBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', fontWeight: 600 },
  summary: { fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 },
  whyBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px' },
  whyLabel: { fontSize: '12px', color: '#94a3b8' },
  evidenceRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
  evidenceChip: { background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', borderRadius: '8px', padding: '2px 8px', fontSize: '11px' },
};
