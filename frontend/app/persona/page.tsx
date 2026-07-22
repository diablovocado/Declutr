'use client';

import React, { useState } from 'react';
import { PersonaDashboard } from '../features/persona/components/persona-dashboard';
import { RecommendationsPanel } from '../features/persona/components/recommendations-panel';
import { LearningInsights } from '../features/persona/components/learning-insights';
import { InterestOverview } from '../features/persona/components/interest-overview';
import { SignalSettings } from '../features/persona/components/signal-settings';
import { PrivacyControls } from '../features/persona/components/privacy-controls';

type Tab = 'dashboard' | 'recommendations' | 'insights' | 'interests' | 'signals' | 'privacy';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Persona', icon: '👤' },
  { id: 'recommendations', label: 'Recommendations', icon: '🎯' },
  { id: 'insights', label: 'Learning Insights', icon: '🧠' },
  { id: 'interests', label: 'Interests', icon: '🌐' },
  { id: 'signals', label: 'Signal Settings', icon: '⚙️' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
];

export default function PersonaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Reverse Persona</h1>
        <p style={styles.subheading}>
          Your private digital identity — built by you, for you. <span style={styles.privacyPill}>🔒 100% Private</span>
        </p>
      </div>

      {/* Tab Nav */}
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
        {activeTab === 'dashboard' && <PersonaDashboard />}
        {activeTab === 'recommendations' && <RecommendationsPanel />}
        {activeTab === 'insights' && <LearningInsights />}
        {activeTab === 'interests' && <InterestOverview />}
        {activeTab === 'signals' && <SignalSettings />}
        {activeTab === 'privacy' && <PrivacyControls />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { padding: '32px 24px 0', maxWidth: '900px', margin: '0 auto' },
  heading: { fontSize: '32px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px', background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheading: { fontSize: '15px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const, margin: 0 },
  privacyPill: { background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8044', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 },
  tabs: { display: 'flex', gap: '4px', padding: '20px 24px 0', maxWidth: '900px', margin: '0 auto', overflowX: 'auto' as const },
  tab: { background: 'transparent', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 500, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' as const, transition: 'all 0.15s' },
  tabActive: { background: '#1e293b', color: '#e2e8f0', fontWeight: 700 },
  content: { maxWidth: '900px', margin: '0 auto' },
};
