'use client';

import React, { useState } from 'react';
import { SyncCenterComponent } from '../../features/sync/components/sync-center';
import { ConflictResolverComponent } from '../../features/sync/components/conflict-resolver';
import { SyncQueueViewerComponent } from '../../features/sync/components/sync-queue-viewer';

export default function SyncPage() {
  const [activeTab, setActiveTab] = useState<'CENTER' | 'CONFLICTS' | 'QUEUE'>('CENTER');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Offline-First Sync Engine & Conflict Resolution</h1>
        <p style={styles.subheading}>
          Bidirectional change tracking, local database queuing, automatic background delta streaming, and field-level 3-way conflict resolution.
        </p>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Navigation Tabs */}
        <div style={styles.tabsRow}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'CENTER' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('CENTER')}
          >
            🔄 Sync Center & Status
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'CONFLICTS' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('CONFLICTS')}
          >
            ⚖️ Conflict Resolver
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'QUEUE' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('QUEUE')}
          >
            📥 Offline Operations Queue
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'CENTER' && <SyncCenterComponent />}
        {activeTab === 'CONFLICTS' && <ConflictResolverComponent />}
        {activeTab === 'QUEUE' && <SyncQueueViewerComponent />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '40px' },
  header: { padding: '32px 24px 0', maxWidth: '1080px', margin: '0 auto' },
  heading: { fontSize: '30px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheading: { fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  container: { maxWidth: '1080px', margin: '24px auto 0', padding: '0 24px' },
  tabsRow: { display: 'flex', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' },
  tabBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '6px 12px', borderRadius: '8px' },
  tabActive: { background: '#6366f122', color: '#818cf8' },
};
