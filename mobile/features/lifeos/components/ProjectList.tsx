import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileProject {
  id: string;
  name: string;
  status: string;
}

export interface ProjectListProps {
  projects: MobileProject[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>📂 {item.name}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: 'bold',
  },
  status: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
