import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function BackupStatus() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Backup Status</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Automated Backup</Text>
        <Text style={styles.status}>Status: COMPLETED (Encrypted)</Text>
        <Text style={styles.meta}>Size: 180.0 MB • Integrity: VERIFIED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 4 },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  status: { fontSize: 12, fontWeight: '700', color: '#4ade80' },
  meta: { fontSize: 11, color: '#94a3b8' },
});
