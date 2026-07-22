import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_RESTORES = [
  { id: 'rst-1', mode: 'FULL_VAULT', date: '2d ago', status: 'SUCCESS' },
];

export function RestoreHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 Restore History</Text>
      {MOCK_RESTORES.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.mode}>{r.mode}</Text>
          <Text style={styles.status}>{r.status} • {r.date}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between' },
  mode: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  status: { fontSize: 11, fontWeight: '700', color: '#4ade80' },
});
