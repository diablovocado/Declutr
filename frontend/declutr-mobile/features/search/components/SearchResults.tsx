import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface SearchItem {
  id: string;
  title: string;
  summary: string;
  assetType: string;
  score: number;
  whyMatched: string;
  strategies: string[];
}

const MOCK_RESULTS: SearchItem[] = [
  { id: '1', title: 'Japanese Visa & Passport Scan', summary: 'Passport photo page and Japanese entry visa for Tokyo vacation 2025.', assetType: 'PDF', score: 0.94, whyMatched: 'Matched via exact keyword match in title & entity (Tokyo, Japan)', strategies: ['KEYWORD', 'VECTOR', 'ENTITY'] },
  { id: '2', title: 'PhD Thesis Chapter 4 — Neural Networks', summary: 'Deep learning models and PyTorch benchmark results.', assetType: 'DOCX', score: 0.86, whyMatched: 'Matched entity (PyTorch, Neural Networks) & semantic vector match', strategies: ['VECTOR', 'ENTITY'] },
];

export function SearchResults() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>🔍 Results (2 found)</Text>

      {MOCK_RESULTS.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.badge}>{item.assetType}</Text>
            <Text style={styles.scoreText}>{Math.round(item.score * 100)}% Match</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>

          <View style={styles.explainBox}>
            <Text style={styles.explainText}>💡 {item.whyMatched}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: { backgroundColor: '#0f172a', color: '#38bdf8', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  scoreText: { color: '#4ade80', fontSize: 12, fontWeight: '800' },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  summary: { fontSize: 12, color: '#94a3b8', lineHeight: 16, marginBottom: 8 },
  explainBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#334155' },
  explainText: { fontSize: 11, color: '#e2e8f0' },
});
