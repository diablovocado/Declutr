import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_CITATIONS = [
  { id: '1', title: 'Japanese Visa & Passport Scan', type: 'PDF', snippet: 'Passport number A987654321, Expiration Date: 2025-09-25.' },
];

export function SourcePanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Grounded Evidence</Text>
      {MOCK_CITATIONS.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.badge}>{c.type}</Text>
          <Text style={styles.cardTitle}>{c.title}</Text>
          <Text style={styles.snippet}>"{c.snippet}"</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 13, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  card: { backgroundColor: '#0f172a', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#334155' },
  badge: { color: '#38bdf8', fontSize: 10, fontWeight: '700', marginBottom: 2 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  snippet: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },
});
