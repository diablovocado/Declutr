import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProcessingProgressProps {
  currentJob?: string;
  processedChunks?: number;
  totalChunks?: number;
  strategy?: string;
}

export function ProcessingProgress({
  currentJob = 'Vectorising Document #001',
  processedChunks = 14,
  totalChunks = 14,
  strategy = 'SEMANTIC',
}: ProcessingProgressProps) {
  const progress = totalChunks > 0 ? (processedChunks / totalChunks) * 100 : 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Vector Processing Progress</Text>
      <View style={styles.card}>
        <Text style={styles.jobText}>{currentJob}</Text>
        <Text style={styles.strategyText}>Strategy: {strategy}</Text>

        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${progress}%` as any }]} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{processedChunks} / {totalChunks} chunks processed</Text>
          <Text style={styles.metaPct}>{Math.round(progress)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0f172a', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#e2e8f0', marginBottom: 10 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#334155' },
  jobText: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  strategyText: { fontSize: 12, color: '#38bdf8', marginBottom: 12, fontWeight: '600' },
  barBg: { backgroundColor: '#0f172a', borderRadius: 4, height: 6, marginBottom: 8, overflow: 'hidden' },
  barFill: { backgroundColor: '#10a37f', height: 6, borderRadius: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 11, color: '#64748b' },
  metaPct: { fontSize: 11, color: '#4ade80', fontWeight: '700' },
});
