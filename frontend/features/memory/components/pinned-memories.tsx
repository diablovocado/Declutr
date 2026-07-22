'use client';

import React, { useEffect, useState } from 'react';
import type { Memory } from '../types/memory';
import { MemoryService } from '../services/memory-service';

const VAULT_ID = 'vault-demo';

export function PinnedMemories() {
  const [pinned, setPinned] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MemoryService.getMemories(VAULT_ID, 'PINNED').then((res) => {
      setPinned(res.memories ?? []);
      setLoading(false);
    });
  }, []);

  const unpin = async (id: string) => {
    await MemoryService.archiveMemory(id);
    setPinned((prev) => prev.filter((m) => m.memoryId !== id));
  };

  if (loading) return <div style={styles.loading}>Loading pinned memories…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>📌 Pinned Knowledge</span>
        <span style={styles.subtitle}>Memories explicitly marked by you as permanent and immune to decay.</span>
      </div>

      {pinned.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📌</div>
          <div style={styles.emptyTitle}>No Pinned Memories</div>
          <div style={styles.emptyDesc}>Pin important notes, legal documents, or critical project context to prevent automatic fading over time.</div>
        </div>
      ) : (
        <div style={styles.grid}>
          {pinned.map((mem) => (
            <div key={mem.memoryId} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.pinBadge}>📌 Permanent</span>
                <button style={styles.unpinBtn} onClick={() => unpin(mem.memoryId)}>Unpin</button>
              </div>
              <div style={styles.cardTitle}>{mem.title}</div>
              <p style={styles.cardSummary}>{mem.summary}</p>
              {mem.pinReason && (
                <div style={styles.reasonBox}>
                  <b>Reason:</b> {mem.pinReason}
                </div>
              )}
              <div style={styles.footer}>
                <span>Strength: {(mem.memoryStrength * 100).toFixed(0)}%</span>
                <span>Created {new Date(mem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '840px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  header: { marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#64748b' },
  emptyCard: { background: '#1e293b', border: '1px border-dashed #334155', borderRadius: '16px', padding: '40px', textAlign: 'center' as const },
  emptyIcon: { fontSize: '40px', marginBottom: '12px' },
  emptyTitle: { fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' },
  emptyDesc: { fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #4ade8044', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pinBadge: { background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8044', borderRadius: '12px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 },
  unpinBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0' },
  cardSummary: { fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5, flex: 1 },
  reasonBox: { background: '#0f172a', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#4ade80', border: '1px solid #1e293b' },
  footer: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' },
};
