import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface MobilePrediction {
  id: string;
  title: string;
  description: string;
  confidence: number;
  action: string;
}

export interface RecommendationCardProps {
  prediction: MobilePrediction;
  onAccept: () => void;
  onDismiss: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ prediction, onAccept, onDismiss }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ {prediction.title}</Text>
        <Text style={styles.conf}>{(prediction.confidence * 100).toFixed(0)}%</Text>
      </View>
      <Text style={styles.desc}>{prediction.description}</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
          <Text style={styles.acceptText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  conf: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  desc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  dismissBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dismissText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  acceptBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
