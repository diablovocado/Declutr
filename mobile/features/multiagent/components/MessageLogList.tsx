import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileMessage {
  id: string;
  sender: string;
  receiver: string;
  type: string;
}

export interface MessageLogListProps {
  messages: MobileMessage[];
}

export const MessageLogList: React.FC<MessageLogListProps> = ({ messages }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Structured Message Bus Log</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.msg}>{item.sender} ➔ {item.receiver}</Text>
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
  msg: {
    color: '#F8FAFC',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  type: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
