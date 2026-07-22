import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_SAVED = [
  { id: '1', name: 'Japan Trip Documents', query: 'Japan passport visa' },
  { id: '2', name: 'PhD Research Papers', query: 'PyTorch thesis neural' },
];

export function SavedSearches() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📌 Saved Searches</Text>
      {MOCK_SAVED.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.query}>"{item.query}"</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  card: { backgroundColor: '#0f172a', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#334155' },
  name: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  query: { fontSize: 11, color: '#94a3b8' },
});
