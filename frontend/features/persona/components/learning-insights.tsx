'use client';

import React, { useEffect, useState } from 'react';
import type { PersonaScore } from '../types/persona';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

export function LearningInsights() {
  const [scores, setScores] = useState<PersonaScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PersonaService.getPersona(VAULT_ID).then((res) => {
      setScores(res.scores ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading learning insights…</div>;

  const sorted = [...scores].sort((a, b) => b.importance - a.importance);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>🧠 Learning Insights</span>
        <span style={styles.subtitle}>Every score is based on your real interactions, nothing else.</span>
      </div>

      {sorted.length === 0 ? (
        <div style={styles.empty}>No learning data yet — continue using your vault.</div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHead}>
            <span>Dimension</span>
            <span>Importance</span>
            <span>Recency</span>
            <span>Interactions</span>
            <span>Confidence</span>
            <span>Trend</span>
          </div>
          {sorted.map((sc) => (
            <div key={sc.scoreId} style={styles.tableRow}>
              <span style={styles.dimension}>{sc.dimension}</span>
              <span style={styles.cell}>{sc.importance.toFixed(1)}</span>
              <span style={styles.cell}>{(sc.recency * 100).toFixed(0)}%</span>
              <span style={styles.cell}>{sc.frequency}</span>
              <span style={styles.cell}>
                <div style={styles.confMini}>
                  <div style={{ ...styles.confMiniBar, width: `${sc.confidence * 100}%` }} />
                </div>
                {(sc.confidence * 100).toFixed(0)}%
              </span>
              <span style={{ ...styles.trendBadge, ...trendStyle(sc.trend) }}>
                {trendLabel(sc.trend)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.explainer}>
        <b>📖 How this works</b><br />
        Importance is calculated from weighted interaction frequency. Recency decays exponentially over time — if you stop accessing a topic, it naturally fades. You are always in control.
      </div>
    </div>
  );
}

function trendStyle(trend: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    RISING: { background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8044' },
    FALLING: { background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' },
    STABLE: { background: '#94a3b822', color: '#94a3b8', border: '1px solid #94a3b844' },
  };
  return map[trend] ?? map['STABLE'];
}

function trendLabel(trend: string): string {
  const map: Record<string, string> = { RISING: '↑ Rising', FALLING: '↓ Falling', STABLE: '→ Stable' };
  return map[trend] ?? trend;
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  header: { marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' },
  table: { background: '#1e293b', borderRadius: '14px', overflow: 'hidden', border: '1px solid #334155', marginBottom: '24px' },
  tableHead: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '12px', padding: '12px 20px', background: '#0f172a', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '12px', padding: '14px 20px', borderTop: '1px solid #334155', alignItems: 'center' },
  dimension: { fontSize: '14px', fontWeight: 600, color: '#e2e8f0' },
  cell: { fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' },
  confMini: { display: 'inline-block', background: '#334155', borderRadius: '3px', height: '4px', width: '40px', overflow: 'hidden', marginRight: '4px' },
  confMiniBar: { background: '#6366f1', height: '100%', borderRadius: '3px' },
  trendBadge: { borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' as const },
  explainer: { background: '#0f172a', borderRadius: '12px', padding: '16px 20px', fontSize: '13px', color: '#64748b', lineHeight: 1.7, border: '1px solid #1e293b' },
};
