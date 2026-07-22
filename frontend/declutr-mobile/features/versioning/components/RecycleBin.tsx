import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_ITEMS = [
  { id: '1', title: 'Draft Tokyo Itinerary 2024.docx', deleted: '7d ago' },
];

export function RecycleBin() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗑️ Recycle Bin</Text>
      {MOCK_ITEMS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>Deleted: {item.deleted}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  meta: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
});
