import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface MemoryItem {
  memoryId: string;
  title: string;
  summary: string;
  memoryType: string;
  memoryStrength: number;
  isPinned: boolean;
  frequency: number;
}

const MOCK_FEED: MemoryItem[] = [
  { memoryId: 'm1', title: 'Japan Vacation 2025', summary: 'Three-week trip to Tokyo and Kyoto covering temples, food, and tech.', memoryType: 'LONG_TERM', memoryStrength: 0.88, isPinned: false, frequency: 14 },
  { memoryId: 'm2', title: 'Thesis Chapter 4 — Neural Networks', summary: 'Deep learning chapter of PhD thesis with active research notes.', memoryType: 'WORKING', memoryStrength: 0.84, isPinned: true, frequency: 22 },
  { memoryId: 'm3', title: 'Recurring Medical Visits — Dr. Sharma', summary: 'Monthly cardiology check-up schedule and prescriptions.', memoryType: 'LONG_TERM', memoryStrength: 0.79, isPinned: false, frequency: 8 },
  { memoryId: 'm4', title: 'Tax Filing 2024', summary: 'Annual tax filing documents and receipts.', memoryType: 'WORKING', memoryStrength: 0.61, isPinned: false, frequency: 5 },
];

const typeColors: Record<string, string> = {
  LONG_TERM: '#6366f1',
  WORKING: '#0ea5e9',
  SHORT_TERM: '#f59e0b',
  PINNED: '#4ade80',
  ARCHIVED: '#64748b',
};

export function MemoryFeed() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🧠 Knowledge Memory</Text>
      <Text style={styles.subtitle}>Persistent knowledge automatically formed from your vault activity.</Text>

      {MOCK_FEED.map((item) => {
        const color = typeColors[item.memoryType] ?? '#6366f1';
        return (
          <View key={item.memoryId} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
                <Text style={[styles.typeBadgeText, { color }]}>{item.memoryType}</Text>
              </View>
              {item.isPinned && <Text style={styles.pinIcon}>📌 Pinned</Text>}
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSummary}>{item.summary}</Text>

            <View style={styles.strengthRow}>
              <View style={styles.strengthBarBg}>
                <View style={[styles.strengthBarFill, { width: `${item.memoryStrength * 100}%` as any, backgroundColor: color }]} />
              </View>
              <Text style={styles.strengthText}>{Math.round(item.memoryStrength * 100)}%</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 18 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  pinIcon: { fontSize: 12, color: '#4ade80', fontWeight: '600' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 6 },
  cardSummary: { fontSize: 13, color: '#94a3b8', lineHeight: 18, marginBottom: 12 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strengthBarBg: { flex: 1, backgroundColor: '#334155', borderRadius: 3, height: 4, overflow: 'hidden' },
  strengthBarFill: { height: 4, borderRadius: 3 },
  strengthText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
});
