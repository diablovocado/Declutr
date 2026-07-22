import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_CONVS = [
  { id: '1', title: 'Japan Trip & Passport Inquiries', date: 'Today' },
  { id: '2', title: 'PhD Thesis Chapter 4 Neural Networks', date: 'Yesterday' },
];

export function ConversationHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 History</Text>
      {MOCK_CONVS.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 13, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  card: { backgroundColor: '#0f172a', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#334155' },
  name: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  date: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
});
