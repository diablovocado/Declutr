import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface MemoryDetailsProps {
  title?: string;
  summary?: string;
  memoryType?: string;
  importance?: number;
  confidence?: number;
  recency?: number;
  strength?: number;
  frequency?: number;
  sourcesCount?: number;
}

export function MemoryDetails({
  title = 'Japan Vacation 2025',
  summary = 'Three-week trip to Tokyo and Kyoto covering temples, food, and tech districts.',
  memoryType = 'LONG_TERM',
  importance = 0.92,
  confidence = 0.87,
  recency = 0.85,
  strength = 0.88,
  frequency = 14,
  sourcesCount = 3,
}: MemoryDetailsProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🔍 Memory Details</Text>

      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={styles.typeBadge}>{memoryType}</Text>
          <Text style={styles.strengthBadge}>{Math.round(strength * 100)}% Strength</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>

        <Text style={styles.sectionHeader}>Scoring Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Importance</Text>
            <Text style={styles.metricVal}>{Math.round(importance * 100)}%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Recency</Text>
            <Text style={styles.metricVal}>{Math.round(recency * 100)}%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={styles.metricVal}>{Math.round(confidence * 100)}%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Frequency</Text>
            <Text style={styles.metricVal}>{frequency}×</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Contributing Sources</Text>
        <Text style={styles.sourcesText}>• Formed from {sourcesCount} contributing sources (contexts, entities, assets)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#334155' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  typeBadge: { backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, fontSize: 11, fontWeight: '700' },
  strengthBadge: { backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, fontSize: 11, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  summary: { fontSize: 13, color: '#94a3b8', lineHeight: 20, marginBottom: 20 },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricItem: { backgroundColor: '#0f172a', borderRadius: 10, padding: 10, alignItems: 'center', flex: 1, marginHorizontal: 2, borderWidth: 1, borderColor: '#1e293b' },
  metricLabel: { fontSize: 10, color: '#64748b', marginBottom: 4 },
  metricVal: { fontSize: 14, fontWeight: '700', color: '#e2e8f0' },
  sourcesText: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },
});
