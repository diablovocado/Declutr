'use client';

import React, { useEffect, useState } from 'react';
import type { PersonaRecommendation, RecommendationType } from '../types/persona';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

const typeConfig: Record<RecommendationType, { label: string; color: string; icon: string }> = {
  CONTINUE_PROJECT: { label: 'Continue Project', color: '#6366f1', icon: '▶' },
  RESUME_READING: { label: 'Resume Reading', color: '#0ea5e9', icon: '📖' },
  RELATED_DOCUMENT: { label: 'Related Document', color: '#8b5cf6', icon: '📄' },
  SUGGESTED_CONTEXT: { label: 'Suggested Context', color: '#f59e0b', icon: '🗂️' },
  SUGGESTED_COLLECTION: { label: 'Suggested Collection', color: '#10b981', icon: '📦' },
  SUGGESTED_ARCHIVE: { label: 'Suggested Archive', color: '#64748b', icon: '🗄️' },
  SUGGESTED_RELATIONSHIP: { label: 'Suggested Relationship', color: '#ec4899', icon: '🔗' },
};

export function RecommendationsPanel() {
  const [recs, setRecs] = useState<PersonaRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PersonaService.getRecommendations(VAULT_ID).then((res) => {
      setRecs(res.recommendations ?? []);
      setLoading(false);
    });
  }, []);

  const dismiss = (id: string) => setRecs((prev) => prev.filter((r) => r.recommendationId !== id));

  if (loading) return <div style={styles.loading}>Generating recommendations…</div>;
  if (recs.length === 0) return <div style={styles.empty}>No recommendations yet — keep using your vault.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>🎯 Recommendations</span>
        <span style={styles.count}>{recs.length} personalised</span>
      </div>
      <div style={styles.list}>
        {recs.map((rec) => {
          const cfg = typeConfig[rec.recommendationType] ?? { label: rec.recommendationType, color: '#6366f1', icon: '💡' };
          return (
            <div key={rec.recommendationId} style={styles.card}>
              {/* Header row */}
              <div style={styles.cardHeader}>
                <span style={{ ...styles.typeBadge, background: `${cfg.color}22`, color: cfg.color, borderColor: `${cfg.color}44` }}>
                  {cfg.icon} {cfg.label}
                </span>
                <button style={styles.dismissBtn} onClick={() => dismiss(rec.recommendationId)}>×</button>
              </div>

              {/* Title */}
              <div style={styles.cardTitle}>{rec.title}</div>

              {/* Confidence bar */}
              <div style={styles.confRow}>
                <div style={styles.confBar}>
                  <div style={{ ...styles.confFill, width: `${Math.round(rec.confidence * 100)}%`, background: cfg.color }} />
                </div>
                <span style={styles.confLabel}>{Math.round(rec.confidence * 100)}% confidence</span>
              </div>

              {/* Reason */}
              <div style={styles.reason}>💬 {rec.reason}</div>

              {/* Evidence */}
              {rec.evidence.length > 0 && (
                <div style={styles.evidenceBlock}>
                  <div style={styles.evidenceTitle}>Supporting evidence</div>
                  {rec.evidence.map((e, i) => (
                    <div key={i} style={styles.evidenceItem}>• {e}</div>
                  ))}
                </div>
              )}

              {/* Contributing signals */}
              {rec.contributingSignals.length > 0 && (
                <div style={styles.signalRow}>
                  {rec.contributingSignals.slice(0, 2).map((s, i) => (
                    <span key={i} style={styles.signalChip}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '860px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0' },
  count: { background: '#6366f122', color: '#818cf8', border: '1px solid #6366f144', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600 },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px', transition: 'border-color 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  typeBadge: { border: '1px solid', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600 },
  dismissBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '0 4px' },
  cardTitle: { fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px' },
  confRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  confBar: { flex: 1, background: '#334155', borderRadius: '4px', height: '5px', overflow: 'hidden' },
  confFill: { height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' },
  confLabel: { fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' as const },
  reason: { fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '12px' },
  evidenceBlock: { background: '#0f172a', borderRadius: '8px', padding: '12px', marginBottom: '12px' },
  evidenceTitle: { fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '8px' },
  evidenceItem: { fontSize: '13px', color: '#64748b', lineHeight: 1.7 },
  signalRow: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px' },
  signalChip: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', color: '#475569' },
};
