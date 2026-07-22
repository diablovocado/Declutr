import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface EmbeddingStatusProps {
  provider?: string;
  model?: string;
  dimensions?: number;
  totalVectors?: number;
  status?: string;
}

export function EmbeddingStatus({
  provider = 'OPENAI',
  model = 'text-embedding-3-small',
  dimensions = 1536,
  totalVectors = 142,
  status = 'HEALTHY',
}: EmbeddingStatusProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💎 Embedding Engine</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Pipeline Health</Text>
          <View style={styles.healthBadge}>
            <Text style={styles.healthText}>● {status}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Active Provider</Text>
          <Text style={styles.val}>{provider}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Active Model</Text>
          <Text style={styles.val}>{model}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dimensions</Text>
          <Text style={styles.val}>{dimensions}d</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Stored Vectors</Text>
          <Text style={styles.val}>{totalVectors}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 20, fontWeight: '800', color: '#e2e8f0', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: '#94a3b8' },
  val: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  healthBadge: { backgroundColor: 'rgba(74,222,128,0.15)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  healthText: { fontSize: 11, color: '#4ade80', fontWeight: '700' },
});
