import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MobileEvent {
  eventId: string;
  eventType: string;
  eventName: string;
  eventDate?: string;
  location?: string;
}

interface ContextTimelineProps {
  events?: MobileEvent[];
}

export function ContextTimeline({ events = [] }: ContextTimelineProps) {
  const mockEvents: MobileEvent[] = events.length > 0 ? events : [
    {
      eventId: '1',
      eventType: 'Flight',
      eventName: 'Flight JL005 to Tokyo',
      eventDate: '2026-07-15',
      location: 'Haneda Airport',
    },
    {
      eventId: '2',
      eventType: 'Purchase',
      eventName: 'AutoNation Down Payment Receipt',
      eventDate: '2026-07-10',
      location: 'San Jose, CA',
    },
    {
      eventId: '3',
      eventType: 'Hospital Visit',
      eventName: 'MRI Consultation',
      eventDate: '2026-07-02',
      location: 'St. Jude Hospital',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Timeline</Text>
      <View style={styles.timeline}>
        {mockEvents.map((ev) => (
          <View key={ev.eventId} style={styles.eventItem}>
            <View style={styles.dot} />
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{ev.eventName}</Text>
                <Text style={styles.eventType}>{ev.eventType}</Text>
              </View>
              {ev.eventDate && <Text style={styles.eventMeta}>{ev.eventDate}</Text>}
              {ev.location && <Text style={styles.eventMeta}>📍 {ev.location}</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  timeline: {
    paddingLeft: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#818cf8',
    marginTop: 6,
    marginRight: 10,
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  eventType: {
    fontSize: 10,
    color: '#818cf8',
    fontWeight: '600',
  },
  eventMeta: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
