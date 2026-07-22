import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_WORKFLOWS = [
  { id: '1', name: 'Auto-tag Travel Documents', trigger: 'ASSET_UPLOADED', actions: 2, enabled: true },
  { id: '2', name: 'Document Expiration Alert', trigger: 'DOCUMENT_EXPIRING', actions: 1, enabled: true },
];

export function WorkflowList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>⚡ Active Automations (2)</Text>
      {MOCK_WORKFLOWS.map((wf) => (
        <View key={wf.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{wf.name}</Text>
            <Text style={[styles.badge, { color: wf.enabled ? '#4ade80' : '#64748b' }]}>
              {wf.enabled ? 'ACTIVE' : 'OFF'}
            </Text>
          </View>

          <Text style={styles.meta}>Trigger: {wf.trigger} • {wf.actions} Actions</Text>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>▶ Run Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', flex: 1 },
  badge: { fontSize: 10, fontWeight: '800' },
  meta: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  btn: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#334155' },
  btnText: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
});
