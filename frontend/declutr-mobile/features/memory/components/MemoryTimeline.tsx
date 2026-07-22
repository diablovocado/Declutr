import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  type: string;
  strength: number;
}

const MOCK_TIMELINE: TimelineItem[] = [
  { id: '1', date: 'May 15, 2025', title: 'Japan Vacation 2025', summary: 'Flight bookings and hotel confirmations recorded.', type: 'LONG_TERM', strength: 0.88 },
  { id: '2', date: 'Apr 02, 2025', title: 'Thesis Chapter 4', summary: 'Neural network architecture draft uploaded.', type: 'WORKING', strength: 0.84 },
  { id: '3', date: 'Jan 10, 2025', title: 'Cardiology Visit', summary: 'Prescriptions and lab results filed.', type: 'LONG_TERM', strength: 0.79 },
];

export function MemoryTimeline() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>⏳ Memory Timeline</Text>
      <Text style={styles.subtitle}>Chronological memory formation history.</Text>

      <View style={styles.timeline}>
        {MOCK_TIMELINE.map((item, index) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.leftCol}>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.lineCol}>
              <View style={styles.dot} />
              {index < MOCK_TIMELINE.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.rightCol}>
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.summary}>{item.summary}</Text>
                <Text style={styles.meta}>{item.type} · {Math.round(item.strength * 100)}% strength</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  timeline: { paddingLeft: 4 },
  item: { flexDirection: 'row', minHeight: 90, gap: 12 },
  leftCol: { width: 85 },
  date: { fontSize: 11, fontWeight: '600', color: '#94a3b8', marginTop: 2 },
  lineCol: { alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366f1', marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: '#334155', marginTop: 4 },
  rightCol: { flex: 1, paddingBottom: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  summary: { fontSize: 12, color: '#94a3b8', lineHeight: 16, marginBottom: 6 },
  meta: { fontSize: 10, color: '#64748b' },
});
