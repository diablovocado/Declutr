import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface MobileAgentItem {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface AgentCardProps {
  agent: MobileAgentItem;
  onPress: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>🤖 {agent.name}</Text>
        <Text style={styles.status}>{agent.status}</Text>
      </View>
      <Text style={styles.type}>{agent.type}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  status: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  type: {
    color: '#6366F1',
    fontSize: 11,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
