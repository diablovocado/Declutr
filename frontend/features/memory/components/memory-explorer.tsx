'use client';

import React, { useEffect, useState } from 'react';
import type { Memory, MemoryType } from '../types/memory';
import { MemoryService } from '../services/memory-service';

const VAULT_ID = 'vault-demo';

const ALL_TYPES: MemoryType[] = [
  'LONG_TERM',
  'WORKING',
  'SHORT_TERM',
  'PINNED',
  'ARCHIVED',
];

export function MemoryExplorer() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    MemoryService.getMemories(VAULT_ID).then((res) => {
      setMemories(res.memories ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMsg = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 2500);
  };

  const handleRefresh = async () => {
    await MemoryService.refreshMemory(VAULT_ID);
    showMsg('⚡ Triggered memory decay & consolidation cycle');
    loadData();
  };

  const handleReset = async () => {
    if (confirm('Reset entire memory model for this vault? All non-pinned memories will be cleared.')) {
      await MemoryService.resetMemory(VAULT_ID);
      showMsg('🔄 Memory model reset');
      loadData();
    }
  };

  const handlePin = async (id: string) => {
    await MemoryService.pinMemory(id, 'Pinned from Memory Explorer');
    showMsg('📌 Memory pinned');
    loadData();
  };

  const handleArchive = async (id: string) => {
    await MemoryService.archiveMemory(id);
    showMsg('🗄 Memory archived');
    loadData();
  };

  const handleDelete = async (id: string) => {
    await MemoryService.deleteMemory(id);
    showMsg('🗑 Memory deleted');
    loadData();
  };

  const filtered = memories.filter((m) => {
    const matchesType = filterType === 'ALL' || m.memoryType === filterType;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.title}>🔍 Memory Explorer</div>
          <div style={styles.subtitle}>Filter, search, and manage all persistent knowledge memories in your vault.</div>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.btnSecondary} onClick={handleRefresh}>⚡ Cycle Decay</button>
          <button style={styles.btnDanger} onClick={handleReset}>🔄 Reset Model</button>
        </div>
      </div>

      {actionMsg && <div style={styles.toast}>{actionMsg}</div>}

      {/* Filter Row */}
      <div style={styles.filterRow}>
        <input
          type="text"
          placeholder="Search memories…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.typeTabs}>
          <button
            style={{ ...styles.typeTab, ...(filterType === 'ALL' ? styles.typeTabActive : {}) }}
            onClick={() => setFilterType('ALL')}
          >
            All
          </button>
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              style={{ ...styles.typeTab, ...(filterType === t ? styles.typeTabActive : {}) }}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      {loading ? (
        <div style={styles.loading}>Loading memories…</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No memories match your filter criteria.</div>
      ) : (
        <div style={styles.list}>
          {filtered.map((m) => (
            <div key={m.memoryId} style={styles.item}>
              <div style={styles.itemMain}>
                <div style={styles.itemHeader}>
                  <span style={styles.itemTitle}>{m.title}</span>
                  <span style={styles.typeChip}>{m.memoryType}</span>
                </div>
                <div style={styles.itemSummary}>{m.summary}</div>
                <div style={styles.itemMeta}>
                  <span>Strength: {(m.memoryStrength * 100).toFixed(0)}%</span>
                  <span>Importance: {(m.importanceScore * 100).toFixed(0)}%</span>
                  <span>Recency: {(m.recency * 100).toFixed(0)}%</span>
                  <span>Accessed: {m.frequency}×</span>
                </div>
              </div>
              <div style={styles.itemActions}>
                {!m.isPinned && (
                  <button style={styles.actionBtn} onClick={() => handlePin(m.memoryId)}>📌 Pin</button>
                )}
                {!m.isArchived && (
                  <button style={styles.actionBtn} onClick={() => handleArchive(m.memoryId)}>🗄 Archive</button>
                )}
                <button style={{ ...styles.actionBtn, color: '#f87171' }} onClick={() => handleDelete(m.memoryId)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0' },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '2px' },
  btnRow: { display: 'flex', gap: '8px' },
  btnSecondary: { background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  btnDanger: { background: '#7f1d1d22', border: '1px solid #7f1d1d', color: '#f87171', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  toast: { background: '#0ea5e922', border: '1px solid #0ea5e944', color: '#38bdf8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', marginBottom: '16px' },
  filterRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '20px' },
  searchInput: { flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', color: '#e2e8f0', fontSize: '13px', minWidth: '200px' },
  typeTabs: { display: 'flex', gap: '4px' },
  typeTab: { background: 'transparent', border: 'none', color: '#64748b', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  typeTabActive: { background: '#334155', color: '#e2e8f0' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
  itemMain: { flex: 1 },
  itemHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  itemTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0' },
  typeChip: { background: '#0f172a', border: '1px solid #334155', color: '#818cf8', borderRadius: '6px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 },
  itemSummary: { fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: 1.4 },
  itemMeta: { display: 'flex', gap: '12px', fontSize: '11px', color: '#64748b' },
  itemActions: { display: 'flex', flexDirection: 'column', gap: '6px' },
  actionBtn: { background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' },
};
