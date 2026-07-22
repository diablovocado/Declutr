'use client';

import React, { useState, useEffect } from 'react';
import type { TimelineEvent, TimelineEventType } from '../types/insights';
import { InsightsService } from '../services/insights-service';

const EVENT_TYPES: { label: string; value: TimelineEventType | 'ALL' }[] = [
  { label: 'All Events', value: 'ALL' },
  { label: '✈️ Travel', value: 'TRAVEL' },
  { label: '🎓 Education', value: 'EDUCATION' },
  { label: '🏥 Medical', value: 'MEDICAL' },
  { label: '💼 Financial', value: 'FINANCIAL' },
  { label: '📁 Projects', value: 'PROJECT' },
];

export function TimelineView() {
  const [selectedType, setSelectedType] = useState<TimelineEventType | 'ALL'>('ALL');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filter = selectedType === 'ALL' ? undefined : selectedType;
    InsightsService.getTimeline(filter).then((res) => {
      setEvents(res.timeline);
      setLoading(false);
    });
  }, [selectedType]);

  return (
    <div style={styles.container}>
      {/* Event Type Filter Chips */}
      <div style={styles.filterRow}>
        {EVENT_TYPES.map((t) => {
          const active = selectedType === t.value;
          return (
            <button
              key={t.value}
              style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
              onClick={() => setSelectedType(t.value)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div style={styles.loading}>Loading chronological timeline...</div>
      ) : events.length === 0 ? (
        <div style={styles.empty}>No timeline events found for this filter.</div>
      ) : (
        <div style={styles.timelineStream}>
          {events.map((ev, index) => {
            const dateStr = new Date(ev.eventTimestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            return (
              <div key={ev.eventId} style={styles.timelineNode}>
                {/* Left Date Spine */}
                <div style={styles.spineCol}>
                  <div style={styles.dateText}>{dateStr}</div>
                  <div style={styles.spineDot} />
                  {index < events.length - 1 && <div style={styles.spineLine} />}
                </div>

                {/* Event Card */}
                <div style={styles.eventCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.eventTypeBadge}>{ev.eventType}</span>
                    <span style={styles.confidenceText}>{Math.round(ev.confidence * 100)}% Confidence</span>
                  </div>
                  <div style={styles.eventTitle}>{ev.title}</div>
                  <div style={styles.eventSummary}>{ev.summary}</div>

                  {/* Entities & Contexts */}
                  <div style={styles.tagsRow}>
                    {ev.relatedEntities && ev.relatedEntities.map((ent) => (
                      <span key={ent} style={styles.entityTag}>👤 {ent}</span>
                    ))}
                    {ev.relatedContexts && ev.relatedContexts.map((ctx) => (
                      <span key={ctx} style={styles.contextTag}>🌐 {ctx}</span>
                    ))}
                  </div>
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
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
  chip: { background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  chipActive: { background: '#6366f122', borderColor: '#6366f1', color: '#818cf8' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  timelineStream: { display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' as const },
  timelineNode: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  spineCol: { width: '110px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' as const, paddingTop: '4px' },
  dateText: { fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' },
  spineDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', border: '2px solid #0f172a' },
  spineLine: { position: 'absolute' as const, right: '4px', top: '20px', bottom: '-20px', width: '2px', background: '#334155' },
  eventCard: { flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  eventTypeBadge: { background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 },
  confidenceText: { fontSize: '11px', color: '#4ade80', fontWeight: 700 },
  eventTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0' },
  eventSummary: { fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 },
  tagsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginTop: '4px' },
  entityTag: { background: '#a855f715', color: '#c084fc', border: '1px solid #a855f733', borderRadius: '12px', padding: '2px 8px', fontSize: '11px' },
  contextTag: { background: '#6366f115', color: '#818cf8', border: '1px solid #6366f133', borderRadius: '12px', padding: '2px 8px', fontSize: '11px' },
};
