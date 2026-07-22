import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function VersionDetail() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Version Detail (v2)</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Japanese Visa & Passport Scan</Text>
        <Text style={styles.text}>Change: AI_REGENERATED</Text>
        <Text style={styles.text}>Checksum: sha256-abc123v2</Text>
        <Text style={styles.text}>Author: AI_WORKER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  text: { fontSize: 12, color: '#94a3b8' },
});
