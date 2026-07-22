'use client';

import React, { useState, useEffect } from 'react';
import type { SyncQueueItem } from '../types/sync';
import { SyncService } from '../services/sync-service';

export function SyncQueueViewerComponent() {
  const [items, setItems] = useState<SyncQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    setLoading(true);
    const list = await SyncService.getQueue();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📥 Offline Sync Operation Queue ({items.length})</h3>

      {loading ? (
        <div style={styles.loading}>Loading pending queue items...</div>
      ) : items.length === 0 ? (
        <div style={styles.empty}>Queue is empty. All offline changes are synced!</div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.queueId} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.statusBadge}>{item.status}</span>
                <span style={styles.changeType}>{item.changeType}</span>
                <span style={styles.res}>{item.resourceType} ({item.resourceId})</span>
                <span style={styles.time}>{new Date(item.queuedAt).toLocaleTimeString()}</span>
              </div>
              {item.errorMsg && <div style={styles.errorBox}>⚠️ Retry Error: {item.errorMsg}</div>}
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
  empty: { textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', color: '#94a3b8' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusBadge: { background: '#f59e0b15', color: '#f59e0b', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 900, border: '1px solid #f59e0b33' },
  changeType: { fontSize: '12px', fontWeight: 900, color: '#818cf8' },
  res: { fontSize: '13px', fontWeight: 700, color: '#e2e8f0', flex: 1 },
  time: { fontSize: '11px', color: '#64748b' },
  errorBox: { fontSize: '12px', color: '#ef4444', background: '#ef444415', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ef444433' },
};
