import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IntentSummaryCardProps {
  intentName?: string;
  confidenceScore?: number;
  evidence?: string;
  reasoning?: string;
}

export function IntentSummaryCard({
  intentName = 'Travel',
  confidenceScore = 0.96,
  evidence = 'Flight JL005 confirmation & Shinjuku Prince Hotel receipt.',
  reasoning = 'Inferred travel reservation purpose with matching destination dates.',
}: IntentSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>INFERRED INTENT</Text>
      <View style={styles.header}>
        <Text style={styles.intentName}>{intentName}</Text>
        <Text style={styles.confidence}>
          {Math.round(confidenceScore * 100)}% Conf
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Evidence:</Text>
      <Text style={styles.evidence}>"{evidence}"</Text>
      <Text style={styles.sectionTitle}>Reasoning:</Text>
      <Text style={styles.reasoning}>{reasoning}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  confidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  evidence: {
    fontSize: 12,
    color: '#cbd5e1',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  reasoning: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
});
