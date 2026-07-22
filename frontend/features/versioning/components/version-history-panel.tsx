'use client';

import React, { useState, useEffect } from 'react';
import type { ResourceVersion, VersioningStats } from '../types/versioning';
import { VersioningService } from '../services/versioning-service';

interface VersionHistoryPanelProps {
  onCompareVersions?: (v1: string, v2: string) => void;
}

export function VersionHistoryPanel({ onCompareVersions }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<ResourceVersion[]>([]);
  const [stats, setStats] = useState<VersioningStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [list, st] = await Promise.all([
      VersioningService.getVersions(),
      VersioningService.getStats(),
    ]);
    setVersions(list);
    setStats(st);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (ver: ResourceVersion) => {
    await VersioningService.restoreVersion(ver.versionId, ver.resourceId);
    loadData();
  };

  return (
    <div style={styles.container}>
      {/* Metric Cards */}
      {stats && (
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{stats.totalVersions}</div>
            <div style={styles.metricLbl}>Recorded Versions</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#4ade80' }}>{stats.totalSnapshots}</div>
            <div style={styles.metricLbl}>Full Snapshots</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#f59e0b' }}>{stats.recycleBinCount}</div>
            <div style={styles.metricLbl}>Recycle Bin Items</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#38bdf8' }}>{stats.totalRestores}</div>
            <div style={styles.metricLbl}>Restores Performed</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>🕒 Resource Time Machine Timeline</span>
      </div>

      {/* Version List */}
      {loading ? (
        <div style={styles.loading}>Loading version timeline...</div>
      ) : versions.length === 0 ? (
        <div style={styles.empty}>No resource versions recorded yet.</div>
      ) : (
        <div style={styles.list}>
          {versions.map((ver, idx) => (
            <div key={ver.versionId} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.badgeRow}>
                  <span style={styles.versionBadge}>v{ver.versionNumber}</span>
                  <span style={styles.typeBadge}>{ver.changeType}</span>
                  <span style={styles.resType}>{ver.resourceType}</span>
                </div>
                <span style={styles.date}>{new Date(ver.createdAt).toLocaleString()}</span>
              </div>

              <h4 style={styles.title}>{ver.summary}</h4>
              <span style={styles.checksum}>Checksum: {ver.checksum} • By: {ver.createdBy}</span>

              <div style={styles.actionRow}>
                <button style={styles.restoreBtn} onClick={() => handleRestore(ver)}>
                  ↩️ Restore to Version {ver.versionNumber}
                </button>
                {idx > 0 && (
                  <button
                    style={styles.compareBtn}
                    onClick={() => onCompareVersions && onCompareVersions(versions[idx - 1].versionId, ver.versionId)}
                  >
                    🔍 Compare with v{versions[idx - 1].versionNumber}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  metricCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px', textAlign: 'center' as const },
  metricVal: { fontSize: '24px', fontWeight: 800, color: '#6366f1' },
  metricLbl: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#e2e8f0' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  versionBadge: { background: '#6366f122', color: '#818cf8', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 800, border: '1px solid #6366f144' },
  typeBadge: { background: '#4ade8015', color: '#4ade80', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800, border: '1px solid #4ade8033' },
  resType: { fontSize: '11px', color: '#94a3b8', fontWeight: 600 },
  date: { fontSize: '11px', color: '#64748b' },
  title: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0', margin: 0 },
  checksum: { fontSize: '11px', color: '#64748b' },
  actionRow: { display: 'flex', gap: '10px', marginTop: '4px' },
  restoreBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  compareBtn: { background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
};
