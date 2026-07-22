'use client';

import React, { useState } from 'react';
import { VersionHistoryPanel } from '../../features/versioning/components/version-history-panel';
import { DiffViewer } from '../../features/versioning/components/diff-viewer';
import { RecycleBin } from '../../features/versioning/components/recycle-bin';

export default function VersioningPage() {
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'DIFF' | 'RECYCLE'>('TIMELINE');
  const [sourceVersion, setSourceVersion] = useState('ver-japan-v1');
  const [targetVersion, setTargetVersion] = useState('ver-japan-v2');

  const handleCompare = (v1: string, v2: string) => {
    setSourceVersion(v1);
    setTargetVersion(v2);
    setActiveTab('DIFF');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Version History, Recovery & Time Machine</h1>
        <p style={styles.subheading}>
          Inspect historical resource versions, compare field-level diffs, restore past states, and recover soft-deleted items safely.
        </p>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Navigation Tabs */}
        <div style={styles.tabsRow}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'TIMELINE' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('TIMELINE')}
          >
            🕒 Resource Timeline
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'DIFF' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('DIFF')}
          >
            🔍 Compare Diff Engine
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'RECYCLE' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('RECYCLE')}
          >
            🗑️ Recycle Bin (Soft Delete)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'TIMELINE' && <VersionHistoryPanel onCompareVersions={handleCompare} />}
        {activeTab === 'DIFF' && <DiffViewer sourceVersionId={sourceVersion} targetVersionId={targetVersion} />}
        {activeTab === 'RECYCLE' && <RecycleBin />}
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
