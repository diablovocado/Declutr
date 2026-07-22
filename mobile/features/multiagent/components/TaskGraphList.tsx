import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileGraphTask {
  id: string;
  role: string;
  action: string;
  status: string;
}

export interface TaskGraphListProps {
  tasks: MobileGraphTask[];
}

export const TaskGraphList: React.FC<TaskGraphListProps> = ({ tasks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Graph Execution DAG</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.status}>{item.status}</Text>
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
  role: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  action: {
    color: '#F8FAFC',
    fontSize: 13,
    marginTop: 2,
  },
  status: {
    color: '#10B981',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
    alignSelf: 'flex-end',
  },
});
