import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_SESSIONS = [
  { id: '1', name: 'MacBook Pro 16"', current: true, time: '1m ago' },
  { id: '2', name: 'iPhone 15 Pro', current: false, time: '1h ago' },
];

export function SessionList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>💻 Active Sessions (2)</Text>
      {MOCK_SESSIONS.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.name}>{s.name}</Text>
          <Text style={styles.time}>{s.current ? 'CURRENT' : s.time}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  time: { fontSize: 11, fontWeight: '800', color: '#4ade80' },
});
