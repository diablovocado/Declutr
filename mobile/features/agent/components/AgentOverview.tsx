import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AgentCard, MobileAgentItem } from './AgentCard';

export interface AgentOverviewProps {
  agents: MobileAgentItem[];
  onSelectAgent: (agent: MobileAgentItem) => void;
}

export const AgentOverview: React.FC<AgentOverviewProps> = ({ agents, onSelectAgent }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Autonomous Collaborators</Text>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AgentCard agent={item} onPress={() => onSelectAgent(item)} />
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
});
