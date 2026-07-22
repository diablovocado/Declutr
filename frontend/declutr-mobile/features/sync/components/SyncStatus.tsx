import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SyncStatus() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔄 Sync Engine Status</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.lbl}>Pending Queue:</Text>
          <Text style={styles.val}>1 item</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.lbl}>Active Conflicts:</Text>
          <Text style={styles.valWarn}>1 conflict</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.lbl}>Sync Protocol:</Text>
          <Text style={styles.val}>v1.0 (WebSockets/Polling)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lbl: { fontSize: 12, color: '#94a3b8' },
  val: { fontSize: 12, fontWeight: '700', color: '#e2e8f0' },
  valWarn: { fontSize: 12, fontWeight: '800', color: '#f59e0b' },
});
