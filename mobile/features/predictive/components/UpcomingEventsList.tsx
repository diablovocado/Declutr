import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileUpcomingItem {
  id: string;
  title: string;
  type: string;
}

export interface UpcomingEventsListProps {
  events: MobileUpcomingItem[];
}

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ events }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Life Events & Deadlines</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>📅 {item.title}</Text>
            <Text style={styles.type}>{item.type}</Text>
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
    padding: 10,
    marginVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 12,
  },
  type: {
    color: '#6366F1',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
