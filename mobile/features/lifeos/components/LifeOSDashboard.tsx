import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectList, MobileProject } from './ProjectList';
import { GoalProgressCard, MobileGoalItem } from './GoalProgressCard';

export interface LifeOSDashboardProps {
  projects: MobileProject[];
  goals: MobileGoalItem[];
  healthScore: number;
}

export const LifeOSDashboard: React.FC<LifeOSDashboardProps> = ({ projects, goals, healthScore }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Life Health Score</Text>
        <Text style={styles.scoreNum}>{healthScore} / 100</Text>
      </View>
      <ProjectList projects={projects} />
      {goals.length > 0 && <GoalProgressCard goal={goals[0]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scoreCard: {
    backgroundColor: '#6366F120',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6366F140',
  },
  scoreTitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  scoreNum: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 4,
  },
});
