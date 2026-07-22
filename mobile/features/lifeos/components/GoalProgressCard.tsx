import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MobileGoalItem {
  id: string;
  title: string;
  progress_pct: number;
}

export interface GoalProgressCardProps {
  goal: MobileGoalItem;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 {goal.title}</Text>
        <Text style={styles.progress}>{goal.progress_pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${goal.progress_pct}%` }]} />
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
    marginBottom: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progress: {
    color: '#6366F1',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  track: {
    backgroundColor: '#334155',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: '#6366F1',
    height: 6,
  },
});
