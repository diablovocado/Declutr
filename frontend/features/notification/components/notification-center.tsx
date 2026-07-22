'use client';

import React, { useState, useEffect } from 'react';
import type { Notification, NotificationStats, PriorityLevel } from '../types/notification';
import { NotificationService } from '../services/notification-service';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [list, st] = await Promise.all([
      NotificationService.getNotifications(),
      NotificationService.getStats(),
    ]);
    setNotifications(list);
    setStats(st);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAllRead = async () => {
    await NotificationService.markRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setStats((prev) => (prev ? { ...prev, unreadCount: 0 } : null));
  };

  const handleDismiss = async (id: string) => {
    await NotificationService.dismissNotification(id);
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
  };

  const handleAction = async (id: string, action: Notification['actionType']) => {
    await NotificationService.executeAction(id, action);
    loadData();
  };

  const filtered = notifications.filter((n) => {
    if (filterPriority === 'ALL') return true;
    return n.priority === filterPriority;
  });

  return (
    <div style={styles.container}>
      {/* Metric Badges */}
      {stats && (
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricVal}>{stats.totalNotifications}</div>
            <div style={styles.metricLbl}>Total Alerts</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#f59e0b' }}>{stats.unreadCount}</div>
            <div style={styles.metricLbl}>Unread Alerts</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#ef4444' }}>{stats.urgentCount}</div>
            <div style={styles.metricLbl}>High / Urgent</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricVal, color: '#4ade80' }}>{Math.round(stats.readRate * 100)}%</div>
            <div style={styles.metricLbl}>Read Rate</div>
          </div>
        </div>
      )}

      {/* Filter Row & Mark All Read */}
      <div style={styles.filterRow}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Priority Filter:</span>
          {(['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              style={{ ...styles.filterBtn, ...(filterPriority === p ? styles.filterActive : {}) }}
              onClick={() => setFilterPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <button style={styles.markReadBtn} onClick={handleMarkAllRead}>
          ✓ Mark All Read
        </button>
      </div>

      {/* Notification Cards */}
      {loading ? (
        <div style={styles.loading}>Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No notifications matching your filter.</div>
      ) : (
        <div style={styles.list}>
          {filtered.map((n) => {
            const isUrgent = n.priority === 'URGENT' || n.priority === 'HIGH';
            return (
              <div key={n.notificationId} style={{ ...styles.card, borderColor: isUrgent ? '#ef444444' : '#334155', background: n.isRead ? '#1e293b99' : '#1e293b' }}>
                <div style={styles.cardHeader}>
                  <div style={styles.typeBadgeRow}>
                    <span style={{ ...styles.priorityBadge, color: isUrgent ? '#ef4444' : '#38bdf8', background: isUrgent ? '#ef444415' : '#38bdf815' }}>
                      {n.priority}
                    </span>
                    <span style={styles.typeTag}>{n.type}</span>
                    {!n.isRead && <span style={styles.unreadDot} />}
                  </div>
                  <span style={styles.dateText}>{new Date(n.createdAt).toLocaleTimeString()}</span>
                </div>

                <h4 style={styles.title}>{n.title}</h4>
                <p style={styles.message}>{n.message}</p>
                {n.summary && <div style={styles.summaryBox}>💡 {n.summary}</div>}

                <div style={styles.actionsRow}>
                  {n.actionType !== 'NONE' && (
                    <button style={styles.actionBtn} onClick={() => handleAction(n.notificationId, n.actionType)}>
                      ⚡ {n.actionType.replace('_', ' ')}
                    </button>
                  )}
                  <button style={styles.dismissBtn} onClick={() => handleDismiss(n.notificationId)}>
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  metricCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px', textAlign: 'center' as const },
  metricVal: { fontSize: '24px', fontWeight: 800, color: '#6366f1' },
  metricLbl: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn: { background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  filterActive: { background: '#6366f122', borderColor: '#6366f1', color: '#818cf8' },
  markReadBtn: { background: '#0f172a', border: '1px solid #334155', color: '#4ade80', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { border: '1px solid', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeBadgeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  priorityBadge: { borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800, border: '1px solid #ffffff15' },
  typeTag: { fontSize: '11px', color: '#94a3b8', fontWeight: 600 },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' },
  dateText: { fontSize: '11px', color: '#64748b' },
  title: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0', margin: 0 },
  message: { fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4, margin: 0 },
  summaryBox: { background: '#0f172a', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#94a3b8', border: '1px solid #334155' },
  actionsRow: { display: 'flex', gap: '10px', marginTop: '4px' },
  actionBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  dismissBtn: { background: 'transparent', border: '1px solid #334155', color: '#64748b', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' },
};
