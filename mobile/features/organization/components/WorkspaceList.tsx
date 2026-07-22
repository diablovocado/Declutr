import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileWorkspace {
  id: string;
  name: string;
  type: string;
}

export interface WorkspaceListProps {
  workspaces: MobileWorkspace[];
}

export const WorkspaceList: React.FC<WorkspaceListProps> = ({ workspaces }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organization Workspaces</Text>
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.wsName}>📁 {item.name}</Text>
            <Text style={styles.wsType}>{item.type}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wsName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  wsType: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
