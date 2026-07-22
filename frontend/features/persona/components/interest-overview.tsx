'use client';

import React, { useEffect, useState } from 'react';
import type { PersonaInterest } from '../types/persona';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

const entityTypeColors: Record<string, { bg: string; text: string }> = {
  Topic: { bg: '#6366f122', text: '#818cf8' },
  Location: { bg: '#0ea5e922', text: '#38bdf8' },
  Person: { bg: '#10b98122', text: '#34d399' },
  Project: { bg: '#f59e0b22', text: '#fbbf24' },
  Organization: { bg: '#ec489922', text: '#f472b6' },
};

export function InterestOverview() {
  const [interests, setInterests] = useState<PersonaInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PersonaService.getPersona(VAULT_ID).then((res) => {
      setInterests(res.interests ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading interests…</div>;
  if (interests.length === 0) return <div style={styles.empty}>No interests detected yet.</div>;

  const sorted = [...interests].sort((a, b) => b.personalRelevance - a.personalRelevance);

  return (
    <div style={styles.container}>
      <div style={styles.title}>🌐 Interest Overview</div>
      <div style={styles.subtitle}>Long-term topics inferred from your vault activity.</div>

      <div style={styles.grid}>
        {sorted.map((interest) => {
          const colors = entityTypeColors[interest.entityType ?? 'Topic'] ?? entityTypeColors['Topic'];
          const size = 12 + Math.round(interest.personalRelevance * 8);
          return (
            <div key={interest.interestId} style={styles.bubble}>
              <div style={{ ...styles.bubbleInner, background: colors.bg, borderColor: colors.text + '44', color: colors.text, fontSize: `${size}px` }}>
                {interest.topic}
              </div>
              <div style={styles.bubbleMeta}>
                <span style={{ ...styles.entityType, color: colors.text }}>{interest.entityType ?? 'Topic'}</span>
                <span style={styles.score}>{(interest.personalRelevance * 100).toFixed(0)}%</span>
              </div>
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
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: '#64748b', marginBottom: '24px' },
  grid: { display: 'flex', flexWrap: 'wrap' as const, gap: '12px' },
  bubble: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  bubbleInner: { border: '1px solid', borderRadius: '12px', padding: '8px 18px', fontWeight: 600, transition: 'transform 0.2s', cursor: 'default' },
  bubbleMeta: { display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px' },
  entityType: { fontWeight: 600 },
  score: { color: '#475569' },
};
