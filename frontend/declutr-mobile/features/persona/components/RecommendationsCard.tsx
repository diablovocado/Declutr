import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Recommendation {
  recommendationId: string;
  recommendationType: string;
  title: string;
  reason: string;
  confidence: number;
  evidence: string[];
  contributingSignals: string[];
}

const MOCK_RECS: Recommendation[] = [
  {
    recommendationId: 'rec-1',
    recommendationType: 'CONTINUE_PROJECT',
    title: 'Continue Thesis Chapter 4',
    reason: 'You have 14 recorded interactions with research materials this month.',
    confidence: 0.87,
    evidence: ['14 research interactions this month', 'Research dimension is RISING', 'Last accessed: 2 days ago'],
    contributingSignals: ["Research frequency: 14", 'Importance: 8.40'],
  },
  {
    recommendationId: 'rec-2',
    recommendationType: 'SUGGESTED_COLLECTION',
    title: 'Group Research into a Collection',
    reason: 'Your research materials span multiple topics. Grouping them improves discoverability.',
    confidence: 0.72,
    evidence: ['9 software files in vault', 'Multiple active research contexts'],
    contributingSignals: ["Software Development frequency: 9"],
  },
];

const typeColors: Record<string, string> = {
  CONTINUE_PROJECT: '#6366f1',
  RESUME_READING: '#0ea5e9',
  RELATED_DOCUMENT: '#8b5cf6',
  SUGGESTED_CONTEXT: '#f59e0b',
  SUGGESTED_COLLECTION: '#10b981',
  SUGGESTED_ARCHIVE: '#64748b',
  SUGGESTED_RELATIONSHIP: '#ec4899',
};

const typeLabels: Record<string, string> = {
  CONTINUE_PROJECT: 'Continue Project',
  RESUME_READING: 'Resume Reading',
  RELATED_DOCUMENT: 'Related Doc',
  SUGGESTED_CONTEXT: 'Suggested Context',
  SUGGESTED_COLLECTION: 'Collection',
  SUGGESTED_ARCHIVE: 'Archive',
  SUGGESTED_RELATIONSHIP: 'Relationship',
};

export function RecommendationsCard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🎯 Recommendations</Text>
      <Text style={styles.subtitle}>Personalised suggestions based on your vault activity.</Text>

      {MOCK_RECS.map((rec) => {
        const color = typeColors[rec.recommendationType] ?? '#6366f1';
        const label = typeLabels[rec.recommendationType] ?? rec.recommendationType;
        return (
          <View key={rec.recommendationId} style={styles.card}>
            {/* Type badge */}
            <View style={[styles.typeBadge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
              <Text style={[styles.typeBadgeText, { color }]}>{label}</Text>
            </View>

            {/* Title */}
            <Text style={styles.cardTitle}>{rec.title}</Text>

            {/* Confidence */}
            <View style={styles.confRow}>
              <View style={styles.confBar}>
                <View style={[styles.confFill, { width: `${rec.confidence * 100}%` as any, backgroundColor: color }]} />
              </View>
              <Text style={styles.confLabel}>{Math.round(rec.confidence * 100)}%</Text>
            </View>

            {/* Reason */}
            <Text style={styles.reason}>💬 {rec.reason}</Text>

            {/* Evidence */}
            <View style={styles.evidenceBlock}>
              {rec.evidence.map((e, i) => (
                <Text key={i} style={styles.evidenceItem}>• {e}</Text>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  typeBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#e2e8f0', marginBottom: 10 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  confBar: { flex: 1, backgroundColor: '#334155', borderRadius: 3, height: 4, overflow: 'hidden' },
  confFill: { height: 4, borderRadius: 3 },
  confLabel: { fontSize: 12, color: '#94a3b8', minWidth: 32 },
  reason: { fontSize: 13, color: '#94a3b8', lineHeight: 20, marginBottom: 10 },
  evidenceBlock: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10 },
  evidenceItem: { fontSize: 12, color: '#64748b', lineHeight: 18 },
});
