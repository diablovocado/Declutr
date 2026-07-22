'use client';

import React, { useState, useEffect } from 'react';
import type { SyncStatusPayload, SyncStats } from '../types/sync';
import { SyncService } from '../services/sync-service';

export function SyncCenterComponent() {
  const [status, setStatus] = useState<SyncStatusPayload | null>(null);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadMetrics = async () => {
    const [st, stts] = await Promise.all([
      SyncService.getStatus(),
      SyncService.getStats(),
    ]);
    setStatus(st);
    setStats(stts);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    await SyncService.pushChanges([]);
    await SyncService.pullChanges();
    await loadMetrics();
    setSyncing(false);
  };

  return (
    <div style={styles.container}>
      {/* Network Status Header */}
      <div style={styles.networkBanner}>
        <div style={styles.netInfo}>
          <div style={{ ...styles.netDot, background: isOnline ? '#4ade80' : '#ef4444' }} />
          <span style={styles.netState}>{isOnline ? 'ONLINE & CONNECTED' : 'OFFLINE MODE'}</span>
        </div>

        <button style={styles.btnToggle} onClick={() => setIsOnline(!isOnline)}>
          {isOnline ? 'Simulate Offline Mode' : 'Restore Connectivity'}
        </button>
      </div>

      {/* Sync Control Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>🔄 Sync Engine Controls</h3>
            <p style={styles.cardSub}>Bidirectional background delta streaming & change tracking</p>
          </div>
          <button style={styles.btnSync} onClick={handleSyncNow} disabled={syncing}>
            {syncing ? 'Syncing...' : '⚡ Trigger Manual Sync'}
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{stats?.totalSyncedEvents ?? 0}</span>
            <span style={styles.statLbl}>Total Synced Events</span>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statVal, color: '#f59e0b' }}>{status?.pendingQueue ?? 0}</span>
            <span style={styles.statLbl}>Pending Offline Queue</span>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statVal, color: (status?.activeConflicts ?? 0) > 0 ? '#ef4444' : '#4ade80' }}>
              {status?.activeConflicts ?? 0}
            </span>
            <span style={styles.statLbl}>Active Conflicts</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{stats?.lastSyncDurationMs ?? 0}ms</span>
            <span style={styles.statLbl}>Last Sync Latency</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  networkBanner: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  netInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  netDot: { width: '12px', height: '12px', borderRadius: '50%', boxShadow: '0 0 10px rgba(74, 222, 128, 0.4)' },
  netState: { fontSize: '15px', fontWeight: 800, color: '#e2e8f0' },
  btnToggle: { background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  cardSub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0' },
  btnSync: { background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', border: 'none', borderRadius: '12px', color: '#fff', padding: '12px 20px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' },
  statVal: { fontSize: '24px', fontWeight: 900, color: '#818cf8' },
  statLbl: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 },
};
