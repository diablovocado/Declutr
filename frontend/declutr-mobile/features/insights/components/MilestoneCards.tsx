import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_MILESTONES = [
  { id: '1', title: 'US Passport Renewal Due', status: 'UPCOMING' },
  { id: '2', title: 'Tax Return Filing 2024 Completed', status: 'COMPLETED' },
];

export function MilestoneCards() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Milestones</Text>
      {MOCK_MILESTONES.map((item) => {
        const isComp = item.status === 'COMPLETED';
        return (
          <View key={item.id} style={styles.card}>
            <Text style={[styles.badge, { color: isComp ? '#4ade80' : '#f59e0b' }]}>{item.status}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { fontSize: 10, fontWeight: '800' },
  title: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
});
