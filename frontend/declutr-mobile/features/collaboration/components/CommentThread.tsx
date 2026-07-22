import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_COMMENTS = [
  { id: '1', user: 'Alex Travel', text: 'Uploaded the Tokyo Metro map PDF!' },
];

export function CommentThread() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>💬 Discussion</Text>
      {MOCK_COMMENTS.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.user}>{c.user}</Text>
          <Text style={styles.text}>{c.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155', gap: 4 },
  user: { fontSize: 12, fontWeight: '700', color: '#38bdf8' },
  text: { fontSize: 13, color: '#cbd5e1' },
});
