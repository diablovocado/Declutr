'use client';

import React, { useState } from 'react';
import { MemoryDashboard } from '../../features/memory/components/memory-dashboard';
import { TimelineView } from '../../features/memory/components/timeline-view';
import { PinnedMemories } from '../../features/memory/components/pinned-memories';
import { MemoryExplorer } from '../../features/memory/components/memory-explorer';

type Tab = 'dashboard' | 'timeline' | 'pinned' | 'explorer';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Knowledge Memory', icon: '🧠' },
  { id: 'timeline', label: 'Timeline', icon: '⏳' },
  { id: 'pinned', label: 'Pinned', icon: '📌' },
  { id: 'explorer', label: 'Explorer', icon: '🔍' },
];

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Memory Engine</h1>
        <p style={styles.subheading}>
          Declutr's core knowledge memory — evolving persistent intelligence that remembers what matters and fades what stales.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'dashboard' && <MemoryDashboard />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'pinned' && <PinnedMemories />}
        {activeTab === 'explorer' && <MemoryExplorer />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { padding: '32px 24px 0', maxWidth: '960px', margin: '0 auto' },
  heading: { fontSize: '32px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheading: { fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  tabs: { display: 'flex', gap: '4px', padding: '24px 24px 0', maxWidth: '960px', margin: '0 auto', borderBottom: '1px solid #1e293b' },
  tab: { background: 'transparent', border: 'none', borderRadius: '8px 8px 0 0', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' },
  tabActive: { background: '#1e293b', color: '#e2e8f0', borderBottom: '2px solid #6366f1' },
  content: { maxWidth: '960px', margin: '0 auto' },
};
