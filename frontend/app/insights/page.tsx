'use client';

import React, { useState } from 'react';
import { TimelineView } from '../../features/insights/components/timeline-view';
import { InsightDashboard } from '../../features/insights/components/insight-dashboard';
import { MilestoneCards } from '../../features/insights/components/milestone-cards';
import { ActivityFeed } from '../../features/insights/components/activity-feed';
import { InsightsService } from '../../features/insights/services/insights-service';

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'INSIGHTS' | 'MILESTONES'>('TIMELINE');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await InsightsService.refreshInsights();
    setRefreshing(false);
    window.location.reload();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div>
            <h1 style={styles.heading}>Knowledge Insights & Timeline Intelligence</h1>
            <p style={styles.subheading}>
              Proactive temporal organization — automatically tracking life events, milestones, recurring patterns, and expiration warnings without requiring explicit searches.
            </p>
          </div>
          <button style={styles.refreshBtn} onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : '🔄 Scan Vault'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        <ActivityFeed />
        <MilestoneCards />

        {/* Navigation Tabs */}
        <div style={styles.tabsRow}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'TIMELINE' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('TIMELINE')}
          >
            📅 Chronological Timeline
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'INSIGHTS' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('INSIGHTS')}
          >
            💡 Proactive Insights
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'TIMELINE' ? <TimelineView /> : <InsightDashboard />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '40px' },
  header: { padding: '32px 24px 0', maxWidth: '1080px', margin: '0 auto' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' },
  heading: { fontSize: '30px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheading: { fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  refreshBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const },
  container: { maxWidth: '1080px', margin: '24px auto 0', padding: '0 24px' },
  tabsRow: { display: 'flex', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' },
  tabBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '6px 12px', borderRadius: '8px' },
  tabActive: { background: '#6366f122', color: '#818cf8' },
};
