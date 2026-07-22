import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_INSIGHTS = [
  { id: '1', title: 'Passport Renewal Warning', summary: 'US Passport expires within 65 days.', why: 'Document expiration date Sep 2025.' },
  { id: '2', title: 'Monthly Subscription Pattern', summary: 'Atorvastatin refill occurs every 30 days.', why: '30-day recurring prescription cycle detected.' },
];

export function InsightsDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>💡 Proactive Insights</Text>
      {MOCK_INSIGHTS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <View style={styles.whyBox}>
            <Text style={styles.whyText}>💡 {item.why}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  summary: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  whyBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#334155' },
  whyText: { fontSize: 11, color: '#e2e8f0' },
});
