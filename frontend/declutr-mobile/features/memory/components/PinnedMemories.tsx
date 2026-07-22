import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface PinnedItem {
  id: string;
  title: string;
  summary: string;
  reason: string;
}

const MOCK_PINNED: PinnedItem[] = [
  {
    id: 'p1',
    title: 'Thesis Chapter 4 — Neural Networks',
    summary: 'Deep learning chapter of PhD thesis with active research notes.',
    reason: 'Active PhD chapter',
  },
];

export function PinnedMemories() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>📌 Pinned Knowledge</Text>
      <Text style={styles.subtitle}>Memories marked as permanent and immune to decay.</Text>

      {MOCK_PINNED.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No pinned memories</Text>
        </View>
      ) : (
        MOCK_PINNED.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.badge}>📌 Permanent</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>Reason: {item.reason}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  header: { marginBottom: 8 },
  badge: { backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', fontSize: 10, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 6 },
  summary: { fontSize: 13, color: '#94a3b8', lineHeight: 18, marginBottom: 10 },
  reasonBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#1e293b' },
  reasonText: { fontSize: 11, color: '#4ade80' },
});
