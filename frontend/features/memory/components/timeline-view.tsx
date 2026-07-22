'use client';

import React, { useEffect, useState } from 'react';
import type { Memory } from '../types/memory';
import { MemoryService } from '../services/memory-service';

const VAULT_ID = 'vault-demo';

const typeColors: Record<string, string> = {
  LONG_TERM: '#6366f1',
  WORKING: '#0ea5e9',
  SHORT_TERM: '#f59e0b',
  PINNED: '#4ade80',
  ARCHIVED: '#64748b',
  FORGOTTEN: '#374151',
};

export function TimelineView() {
  const [timeline, setTimeline] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MemoryService.getTimeline(VAULT_ID).then((res) => {
      setTimeline(res.timeline ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading memory timeline…</div>;
  if (timeline.length === 0) return <div style={styles.empty}>No memories recorded on timeline.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>⏳ Memory Timeline</span>
        <span style={styles.subtitle}>Chronological evolution of your vault's persistent knowledge.</span>
      </div>

      <div style={styles.timeline}>
        {timeline.map((mem, i) => {
          const color = typeColors[mem.memoryType] ?? '#6366f1';
          const dateStr = new Date(mem.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={mem.memoryId} style={styles.item}>
              <div style={styles.leftCol}>
                <span style={styles.date}>{dateStr}</span>
                <span style={{ ...styles.badge, background: `${color}22`, color, borderColor: `${color}44` }}>
                  {mem.memoryType}
                </span>
              </div>

              <div style={styles.lineCol}>
                <div style={{ ...styles.dot, background: color }} />
                {i < timeline.length - 1 && <div style={styles.line} />}
              </div>

              <div style={styles.rightCol}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>{mem.title}</span>
                    {mem.isPinned && <span style={styles.pinIcon}>📌 Pinned</span>}
                  </div>
                  <p style={styles.cardSummary}>{mem.summary}</p>
                  <div style={styles.metaRow}>
                    <span>Strength: {(mem.memoryStrength * 100).toFixed(0)}%</span>
                    <span>•</span>
                    <span>Frequency: {mem.frequency}×</span>
                    <span>•</span>
                    <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '840px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  header: { marginBottom: '32px' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#64748b' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '0px' },
  item: { display: 'flex', gap: '16px', minHeight: '100px' },
  leftCol: { width: '110px', textAlign: 'right' as const, paddingTop: '4px' },
  date: { fontSize: '12px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' },
  badge: { display: 'inline-block', border: '1px solid', borderRadius: '12px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 },
  lineCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' as const },
  dot: { width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #0f172a', zIndex: 1, marginTop: '6px' },
  line: { width: '2px', flex: 1, background: '#334155', marginTop: '4px' },
  rightCol: { flex: 1, paddingBottom: '24px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0' },
  pinIcon: { fontSize: '12px', color: '#4ade80', fontWeight: 600 },
  cardSummary: { fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: 1.5 },
  metaRow: { fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px' },
};
