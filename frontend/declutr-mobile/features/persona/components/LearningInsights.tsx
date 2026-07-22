import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface LearningInsight {
  dimension: string;
  importance: number;
  frequency: number;
  confidence: number;
  trend: string;
}

const MOCK_INSIGHTS: LearningInsight[] = [
  { dimension: 'Research', importance: 8.4, frequency: 14, confidence: 0.87, trend: 'RISING' },
  { dimension: 'Software Development', importance: 5.2, frequency: 9, confidence: 0.72, trend: 'STABLE' },
  { dimension: 'Travel', importance: 3.1, frequency: 5, confidence: 0.55, trend: 'FALLING' },
];

const trendColor: Record<string, string> = { RISING: '#4ade80', FALLING: '#f87171', STABLE: '#94a3b8' };
const trendLabel: Record<string, string> = { RISING: '↑ Rising', FALLING: '↓ Falling', STABLE: '→ Stable' };

export function LearningInsights() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🧠 Learning Insights</Text>
      <Text style={styles.subtitle}>Every score is based on your real vault activity — nothing else.</Text>

      {MOCK_INSIGHTS.map((insight) => (
        <View key={insight.dimension} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.dimName}>{insight.dimension}</Text>
            <Text style={[styles.trend, { color: trendColor[insight.trend] }]}>{trendLabel[insight.trend]}</Text>
          </View>

          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${insight.confidence * 100}%` as any }]} />
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>Importance: {insight.importance.toFixed(1)}</Text>
            <Text style={styles.meta}>{insight.frequency} interactions</Text>
            <Text style={styles.meta}>{(insight.confidence * 100).toFixed(0)}% confident</Text>
          </View>
        </View>
      ))}

      <View style={styles.explainer}>
        <Text style={styles.explainerText}>
          📖 Scores decay over time. If you stop using a topic, its importance naturally fades. You remain in full control.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dimName: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  trend: { fontSize: 12, fontWeight: '700' },
  barBg: { backgroundColor: '#334155', borderRadius: 3, height: 5, marginBottom: 10, overflow: 'hidden' },
  barFill: { backgroundColor: '#6366f1', height: 5, borderRadius: 3 },
  metaRow: { flexDirection: 'row', gap: 12 },
  meta: { fontSize: 11, color: '#64748b' },
  explainer: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginTop: 8 },
  explainerText: { fontSize: 12, color: '#64748b', lineHeight: 18 },
});
