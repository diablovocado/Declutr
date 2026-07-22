'use client';

import React, { useState, useEffect } from 'react';
import type { Milestone } from '../types/insights';
import { InsightsService } from '../services/insights-service';

export function MilestoneCards() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    InsightsService.getMilestones().then(setMilestones);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {milestones.map((ms) => {
          const isCompleted = ms.status === 'COMPLETED';
          const statusCol = isCompleted ? '#4ade80' : '#f59e0b';
          return (
            <div key={ms.milestoneId} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={{ ...styles.statusBadge, borderColor: statusCol + '44', color: statusCol, background: statusCol + '15' }}>
                  {ms.status}
                </span>
                {ms.dueDate && (
                  <span style={styles.dueDate}>Due: {new Date(ms.dueDate).toLocaleDateString()}</span>
                )}
              </div>
              <div style={styles.title}>{ms.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { border: '1px solid', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800 },
  dueDate: { fontSize: '11px', color: '#94a3b8' },
  title: { fontSize: '14px', fontWeight: 700, color: '#e2e8f0' },
};
