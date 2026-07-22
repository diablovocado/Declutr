'use client';

import React, { useEffect, useState } from 'react';
import type { InsightStats } from '../types/insights';
import { InsightsService } from '../services/insights-service';

export function ActivityFeed() {
  const [stats, setStats] = useState<InsightStats | null>(null);

  useEffect(() => {
    InsightsService.getStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div style={styles.card}>
      <div style={styles.title}>📊 Knowledge Growth Metrics</div>
      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <div style={styles.metricVal}>{stats.totalTimelineEvents}</div>
          <div style={styles.metricLbl}>Timeline Events</div>
        </div>
        <div style={styles.metricBox}>
          <div style={styles.metricVal}>{stats.totalActiveInsights}</div>
          <div style={styles.metricLbl}>Proactive Insights</div>
        </div>
        <div style={styles.metricBox}>
          <div style={styles.metricVal}>{stats.totalMilestones}</div>
          <div style={styles.metricLbl}>Vault Milestones</div>
        </div>
        <div style={styles.metricBox}>
          <div style={{ ...styles.metricVal, color: '#ef4444' }}>{stats.upcomingExpirations}</div>
          <div style={styles.metricLbl}>Expirations Pending</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', marginBottom: '24px' },
  title: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0', marginBottom: '16px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  metricBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px', textAlign: 'center' as const },
  metricVal: { fontSize: '20px', fontWeight: 800, color: '#6366f1' },
  metricLbl: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
};
