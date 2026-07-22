'use client';

import React, { useEffect, useState } from 'react';
import type { Memory, MemoryStats, MemoryCluster } from '../types/memory';
import { MemoryService } from '../services/memory-service';

const VAULT_ID = 'vault-demo';

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  LONG_TERM:  { label: 'Long-Term',  color: '#6366f1', icon: '🧠' },
  WORKING:    { label: 'Working',    color: '#0ea5e9', icon: '⚡' },
  SHORT_TERM: { label: 'Short-Term', color: '#f59e0b', icon: '⏱' },
  PINNED:     { label: 'Pinned',     color: '#4ade80', icon: '📌' },
  ARCHIVED:   { label: 'Archived',   color: '#64748b', icon: '🗄' },
  FORGOTTEN:  { label: 'Forgotten',  color: '#374151', icon: '💨' },
  GENERATED:  { label: 'Generated',  color: '#c084fc', icon: '✨' },
  USER:       { label: 'User',       color: '#f472b6', icon: '👤' },
  AI:         { label: 'AI',         color: '#34d399', icon: '🤖' },
};

function StrengthBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={styles.strengthBarBg}>
      <div style={{ ...styles.strengthBarFill, width: `${Math.round(value * 100)}%`, background: color }} />
    </div>
  );
}

export function MemoryDashboard() {
  const [stats, setStats] = useState<{ stats: MemoryStats; clusters: MemoryCluster[] } | null>(null);
  const [strongest, setStrongest] = useState<Memory[]>([]);
  const [pinned, setPinned] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      MemoryService.getStats(VAULT_ID),
      MemoryService.getMemories(VAULT_ID),
      MemoryService.getMemories(VAULT_ID, 'PINNED'),
    ]).then(([s, m, p]) => {
      setStats(s);
      setStrongest(m.memories.slice(0, 6));
      setPinned(p.memories);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading knowledge memory…</div>;
  if (!stats) return null;

  const { stats: s, clusters } = stats;

  return (
    <div style={styles.container}>
      {/* Header Stats Row */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Memories', value: s.totalMemories, icon: '🧠', color: '#818cf8' },
          { label: 'Long-Term', value: s.longTerm, icon: '💎', color: '#6366f1' },
          { label: 'Working', value: s.working, icon: '⚡', color: '#0ea5e9' },
          { label: 'Pinned', value: s.pinned, icon: '📌', color: '#4ade80' },
          { label: 'Archived', value: s.archived, icon: '🗄', color: '#64748b' },
          { label: 'Avg Strength', value: `${(s.avgStrength * 100).toFixed(0)}%`, icon: '💪', color: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={styles.statIcon}>{stat.icon}</div>
            <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pinned Memories */}
      {pinned.length > 0 && (
        <>
          <div style={styles.sectionTitle}>📌 Pinned Memories</div>
          <div style={styles.pinnedRow}>
            {pinned.map((m) => (
              <div key={m.memoryId} style={styles.pinnedCard}>
                <div style={styles.pinnedTitle}>{m.title}</div>
                <div style={styles.pinnedReason}>{m.pinReason ?? 'Pinned by user'}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Strongest Memories */}
      <div style={styles.sectionTitle}>💎 Strongest Memories</div>
      <div style={styles.memoryGrid}>
        {strongest.filter((m) => !m.isArchived).map((m) => {
          const cfg = typeConfig[m.memoryType] ?? typeConfig['WORKING'];
          return (
            <div key={m.memoryId} style={styles.memCard}>
              <div style={styles.memCardHeader}>
                <span style={{ ...styles.typeBadge, background: cfg.color + '22', color: cfg.color, borderColor: cfg.color + '44' }}>
                  {cfg.icon} {cfg.label}
                </span>
                {m.isPinned && <span style={styles.pinIcon}>📌</span>}
              </div>
              <div style={styles.memTitle}>{m.title}</div>
              <div style={styles.memSummary}>{m.summary}</div>
              <div style={styles.memFooter}>
                <div style={styles.memStrengthRow}>
                  <StrengthBar value={m.memoryStrength} color={cfg.color} />
                  <span style={styles.memStrengthLabel}>{(m.memoryStrength * 100).toFixed(0)}%</span>
                </div>
                <span style={styles.memFreq}>{m.frequency}× accessed</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory Clusters */}
      {clusters.length > 0 && (
        <>
          <div style={styles.sectionTitle}>🗂 Memory Clusters</div>
          <div style={styles.clusterRow}>
            {clusters.map((cl) => (
              <div key={cl.clusterId} style={styles.clusterCard}>
                <div style={styles.clusterName}>{cl.clusterName}</div>
                <div style={styles.clusterMeta}>{cl.memberMemoryIds.length} memories · {(cl.cohesionScore * 100).toFixed(0)}% cohesion</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '960px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '32px' },
  statCard: { background: '#1e293b', borderRadius: '14px', padding: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '26px', fontWeight: 800 },
  statLabel: { fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', textAlign: 'center' as const },
  sectionTitle: { fontSize: '13px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '16px', marginTop: '8px' },
  pinnedRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '28px' },
  pinnedCard: { background: 'linear-gradient(135deg, #16423c, #0d2b27)', border: '1px solid #4ade8044', borderRadius: '12px', padding: '14px 18px', minWidth: '200px', flex: 1 },
  pinnedTitle: { fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' },
  pinnedReason: { fontSize: '12px', color: '#4ade80' },
  memoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' },
  memCard: { background: '#1e293b', borderRadius: '14px', padding: '18px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' },
  memCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { border: '1px solid', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 },
  pinIcon: { fontSize: '14px' },
  memTitle: { fontSize: '14px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 },
  memSummary: { fontSize: '12px', color: '#64748b', lineHeight: 1.6, flex: 1 },
  memFooter: { display: 'flex', flexDirection: 'column', gap: '6px' },
  memStrengthRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  strengthBarBg: { flex: 1, background: '#334155', borderRadius: '3px', height: '5px', overflow: 'hidden' },
  strengthBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s ease' },
  memStrengthLabel: { fontSize: '11px', color: '#94a3b8', minWidth: '28px' },
  memFreq: { fontSize: '11px', color: '#475569' },
  clusterRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' },
  clusterCard: { background: '#1e293b', borderRadius: '12px', padding: '12px 16px', border: '1px solid #334155' },
  clusterName: { fontSize: '13px', fontWeight: 700, color: '#e2e8f0', textTransform: 'capitalize' as const, marginBottom: '4px' },
  clusterMeta: { fontSize: '11px', color: '#64748b' },
};
