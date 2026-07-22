'use client';

import React, { useState } from 'react';
import { NotificationCenter } from '../../features/notification/components/notification-center';
import { DigestView } from '../../features/notification/components/digest-view';
import { NotificationPreferencesView } from '../../features/notification/components/notification-preferences';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'CENTER' | 'DIGESTS' | 'PREFERENCES'>('CENTER');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Notification Center & Proactive Intelligence</h1>
        <p style={styles.subheading}>
          Contextual, explainable, and actionable proactive alerts across expirations, workflows, security, and vault memories.
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
            🔔 Notification Center
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'DIGESTS' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('DIGESTS')}
          >
            📰 Daily & Weekly Digests
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'PREFERENCES' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('PREFERENCES')}
          >
            ⚙️ Preferences & Channels
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'CENTER' && <NotificationCenter />}
        {activeTab === 'DIGESTS' && <DigestView />}
        {activeTab === 'PREFERENCES' && <NotificationPreferencesView />}
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
