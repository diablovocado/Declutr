import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileGoal {
  id: string;
  title: string;
  schedule: string;
}

export interface GoalListProps {
  goals: MobileGoal[];
}

export const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Persistent Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>🎯 {item.title}</Text>
            <Text style={styles.schedule}>{item.schedule}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  schedule: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'monospace',
  },
});
