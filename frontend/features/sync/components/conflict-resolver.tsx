'use client';

import React, { useState, useEffect } from 'react';
import type { SyncConflict, ConflictStatus } from '../types/sync';
import { SyncService } from '../services/sync-service';

export function ConflictResolverComponent() {
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConflicts = async () => {
    setLoading(true);
    const list = await SyncService.getConflicts();
    setConflicts(list);
    setLoading(false);
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const handleResolve = async (conflictId: string, resolution: ConflictStatus) => {
    await SyncService.resolveConflict(conflictId, resolution);
    loadConflicts();
  };

  if (loading) return <div style={styles.loading}>Checking for sync conflicts...</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>⚖️ Unresolved Sync Conflicts ({conflicts.length})</h3>

      {conflicts.length === 0 ? (
        <div style={styles.empty}>✨ No active sync conflicts! All changes are fully reconciled.</div>
      ) : (
        <div style={styles.conflictList}>
          {conflicts.map((c) => (
            <div key={c.conflictId} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.resBadge}>{c.resourceType}</span>
                <span style={styles.resId}>{c.resourceId}</span>
                <span style={styles.strat}>Strategy: {c.strategy}</span>
              </div>

              {/* Side by side payloads */}
              <div style={styles.grid}>
                <div style={styles.payloadBox}>
                  <h4 style={styles.boxTitle}>📱 Local Version (Mobile/Device)</h4>
                  <pre style={styles.pre}>{JSON.stringify(c.localPayload, null, 2)}</pre>
                  <button style={styles.btnLocal} onClick={() => handleResolve(c.conflictId, 'RESOLVED_LOCAL')}>
                    Accept Local Version
                  </button>
                </div>

                <div style={styles.payloadBox}>
                  <h4 style={styles.boxTitle}>☁️ Remote Server Version</h4>
                  <pre style={styles.pre}>{JSON.stringify(c.remotePayload, null, 2)}</pre>
                  <button style={styles.btnRemote} onClick={() => handleResolve(c.conflictId, 'RESOLVED_REMOTE')}>
                    Accept Remote Version
                  </button>
                </div>
              </div>

              <div style={styles.mergeRow}>
                <button style={styles.btnMerge} onClick={() => handleResolve(c.conflictId, 'RESOLVED_MERGE')}>
                  🔀 Execute Field-Level 3-Way Merge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', color: '#4ade80', fontSize: '14px', fontWeight: 700, border: '1px solid #334155' },
  conflictList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  resBadge: { background: '#f59e0b15', color: '#f59e0b', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 900, border: '1px solid #f59e0b33' },
  resId: { fontSize: '14px', fontWeight: 700, color: '#e2e8f0', flex: 1 },
  strat: { fontSize: '11px', color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  payloadBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' },
  boxTitle: { fontSize: '13px', fontWeight: 800, color: '#cbd5e1', margin: 0 },
  pre: { fontSize: '12px', color: '#38bdf8', margin: 0, overflowX: 'auto', background: '#090d16', padding: '10px', borderRadius: '8px' },
  btnLocal: { background: '#38bdf822', border: '1px solid #38bdf855', color: '#38bdf8', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  btnRemote: { background: '#6366f122', border: '1px solid #6366f155', color: '#818cf8', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  mergeRow: { display: 'flex', justifyContent: 'center' },
  btnMerge: { background: 'linear-gradient(135deg, #4ade80, #34d399)', color: '#090d16', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' },
};
