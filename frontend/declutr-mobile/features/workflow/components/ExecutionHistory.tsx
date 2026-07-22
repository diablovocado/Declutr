import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_RUNS = [
  { id: 'run-001', trigger: 'ASSET_UPLOADED', status: 'SUCCESS', duration: '42ms' },
  { id: 'run-002', trigger: 'DOCUMENT_EXPIRING', status: 'SUCCESS', duration: '30ms' },
];

export function ExecutionHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Execution Runs</Text>
      {MOCK_RUNS.map((r) => (
        <View key={r.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.runId}>{r.id}</Text>
            <Text style={styles.status}>{r.status}</Text>
          </View>
          <Text style={styles.text}>{r.trigger} • {r.duration}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  runId: { fontSize: 13, fontWeight: '700', color: '#38bdf8' },
  status: { fontSize: 10, fontWeight: '800', color: '#4ade80' },
  text: { fontSize: 11, color: '#94a3b8' },
});
