'use client';

import React, { useState, useEffect } from 'react';
import type { DigestReport } from '../types/notification';
import { NotificationService } from '../services/notification-service';

export function DigestView() {
  const [digests, setDigests] = useState<DigestReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NotificationService.getDigests().then((res) => {
      setDigests(res);
      setLoading(false);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📰 Proactive Digests & Summaries</h3>
      {loading ? (
        <div style={styles.loading}>Loading digest reports...</div>
      ) : digests.length === 0 ? (
        <div style={styles.empty}>No digest reports available yet.</div>
      ) : (
        <div style={styles.grid}>
          {digests.map((d) => (
            <div key={d.digestId} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{d.digestType} DIGEST</span>
                <span style={styles.date}>{new Date(d.generatedAt).toLocaleDateString()}</span>
              </div>
              <h4 style={styles.cardTitle}>{d.title}</h4>
              <p style={styles.summary}>{d.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { fontSize: '16px', fontWeight: 700, color: '#e2e8f0', margin: 0 },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { color: '#38bdf8', fontSize: '10px', fontWeight: 800, background: '#38bdf815', padding: '2px 8px', borderRadius: '6px', border: '1px solid #38bdf833' },
  date: { fontSize: '11px', color: '#64748b' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0', margin: 0 },
  summary: { fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4, margin: 0 },
};
