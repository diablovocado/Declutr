import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export interface ContextItem {
  contextId: string;
  name: string;
  type: string;
  summary: string;
  confidenceScore: number;
}

interface ContextsScreenProps {
  contexts?: ContextItem[];
  onSelectContext?: (contextId: string) => void;
}

export function ContextsScreen({ contexts = [], onSelectContext }: ContextsScreenProps) {
  const mockContexts: ContextItem[] = contexts.length > 0 ? contexts : [
    {
      contextId: 'ctx_1',
      name: 'Japan Vacation',
      type: 'Trip',
      summary: 'Flight ticket JL005, Shinjuku Prince Hotel, and Suica receipts.',
      confidenceScore: 0.98,
    },
    {
      contextId: 'ctx_2',
      name: 'Buying a Car',
      type: 'Purchase',
      summary: 'AutoNation sales contract and loan transfer details.',
      confidenceScore: 0.94,
    },
    {
      contextId: 'ctx_3',
      name: 'Medical Treatment',
      type: 'Health Care',
      summary: 'St. Jude Hospital visit log and MRI order.',
      confidenceScore: 0.92,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Context Engine</Text>
      <Text style={styles.headerSubtitle}>Auto-grouped real-world contexts</Text>

      <View style={styles.list}>
        {mockContexts.map((item) => (
          <TouchableOpacity
            key={item.contextId}
            style={styles.card}
            onPress={() => onSelectContext?.(item.contextId)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.badge}>{item.type}</Text>
            </View>
            <Text style={styles.summary}>{item.summary}</Text>
            <Text style={styles.confidence}>
              {Math.round(item.confidenceScore * 100)}% Confidence
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  badge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#818cf8',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  summary: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 10,
  },
  confidence: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34d399',
  },
});
