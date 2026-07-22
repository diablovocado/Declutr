import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_AUDIT = [
  { id: '1', action: 'USER_LOGIN_SUCCESS', category: 'AUTH', time: '10m ago' },
  { id: '2', action: 'ASSET_UPLOAD', category: 'ASSET', time: '2h ago' },
];

export function AuditSummary() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Audit Trail</Text>
      {MOCK_AUDIT.map((a) => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.action}>{a.action}</Text>
          <Text style={styles.cat}>{a.category} • {a.time}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  action: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  cat: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
});
