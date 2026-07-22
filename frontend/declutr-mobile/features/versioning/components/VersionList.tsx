import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_VERSIONS = [
  { id: 'ver-japan-v2', verNum: 2, type: 'AI_REGENERATED', summary: 'AI analysis regenerated: Extracted expiration date', time: '2d ago' },
  { id: 'ver-japan-v1', verNum: 1, type: 'CREATED', summary: 'Initial document upload: Japanese Visa Scan', time: '7d ago' },
];

export function VersionList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>🕒 Resource Timeline (2)</Text>
      {MOCK_VERSIONS.map((v) => (
        <View key={v.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.badge}>v{v.verNum}</Text>
            <Text style={styles.type}>{v.type}</Text>
            <Text style={styles.time}>{v.time}</Text>
          </View>
          <Text style={styles.summary}>{v.summary}</Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>↩️ Restore v{v.verNum}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155', gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { fontSize: 11, fontWeight: '800', color: '#818cf8' },
  type: { fontSize: 10, fontWeight: '700', color: '#4ade80' },
  time: { fontSize: 11, color: '#64748b', marginLeft: 'auto' },
  summary: { fontSize: 13, color: '#e2e8f0' },
  btn: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#334155', marginTop: 4 },
  btnText: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
});
