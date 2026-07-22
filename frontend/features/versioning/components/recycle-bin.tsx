'use client';

import React, { useState, useEffect } from 'react';
import type { RecycleItem } from '../types/versioning';
import { VersioningService } from '../services/versioning-service';

export function RecycleBin() {
  const [items, setItems] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    setLoading(true);
    const res = await VersioningService.getRecycleBin();
    setItems(res);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRestore = async (id: string) => {
    await VersioningService.restoreRecycleItem(id);
    setItems((prev) => prev.filter((i) => i.recycleId !== id));
  };

  const handlePurge = async (id: string) => {
    await VersioningService.purgeRecycleItem(id);
    setItems((prev) => prev.filter((i) => i.recycleId !== id));
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🗑️ Vault Recycle Bin (Soft Delete)</h3>

      {loading ? (
        <div style={styles.loading}>Loading recycle bin items...</div>
      ) : items.length === 0 ? (
        <div style={styles.empty}>Recycle bin is empty.</div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.recycleId} style={styles.card}>
              <div style={styles.header}>
                <span style={styles.typeBadge}>{item.resourceType}</span>
                <span style={styles.date}>Deleted: {new Date(item.deletedAt).toLocaleDateString()}</span>
              </div>
              <h4 style={styles.cardTitle}>{item.title}</h4>
              {item.originalPath && <span style={styles.path}>Original: {item.originalPath}</span>}

              <div style={styles.actionRow}>
                <button style={styles.restoreBtn} onClick={() => handleRestore(item.recycleId)}>
                  ↩️ Restore Item
                </button>
                <button style={styles.purgeBtn} onClick={() => handlePurge(item.recycleId)}>
                  🔥 Permanent Purge
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
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { background: '#ef444415', color: '#ef4444', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800, border: '1px solid #ef444433' },
  date: { fontSize: '11px', color: '#64748b' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0', margin: 0 },
  path: { fontSize: '11px', color: '#64748b' },
  actionRow: { display: 'flex', gap: '10px', marginTop: '4px' },
  restoreBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  purgeBtn: { background: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
};
