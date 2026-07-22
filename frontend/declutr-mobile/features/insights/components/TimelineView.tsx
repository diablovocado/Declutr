import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const MOCK_EVENTS = [
  { id: '1', title: 'Japan Vacation 2025 Flight Booking', date: 'Jul 2025', type: 'TRAVEL', summary: 'Flight ticket and hotel reservations filed for Tokyo trip.' },
  { id: '2', title: 'PhD Thesis Chapter 4 Completed', date: 'Jun 2025', type: 'EDUCATION', summary: 'Neural networks benchmark draft finalized.' },
  { id: '3', title: 'Cardiology Visit with Dr. Sharma', date: 'May 2025', type: 'MEDICAL', summary: 'Prescription renewed and ECG report filed.' },
];

export function TimelineView() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>📅 Chronological Timeline</Text>
      {MOCK_EVENTS.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.badge}>{item.type}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: { backgroundColor: '#0f172a', color: '#38bdf8', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  date: { color: '#94a3b8', fontSize: 11 },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  summary: { fontSize: 12, color: '#94a3b8', lineHeight: 16 },
});
