import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileSpecialistAgent {
  id: string;
  role: string;
  status: string;
  health: string;
}

export interface MultiAgentOverviewProps {
  agents: MobileSpecialistAgent[];
}

export const MultiAgentOverview: React.FC<MultiAgentOverviewProps> = ({ agents }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Specialist Agent Cluster</Text>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.role}>⚙️ {item.role}</Text>
            <Text style={styles.health}>{item.health}</Text>
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
    alignItems: 'center',
  },
  role: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: 'bold',
  },
  health: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
