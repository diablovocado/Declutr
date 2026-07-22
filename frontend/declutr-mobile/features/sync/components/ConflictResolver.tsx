import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function ConflictResolver() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚖️ Conflict Resolution</Text>
      <View style={styles.card}>
        <Text style={styles.title}>COLLECTION: Japan Vacation Notes</Text>
        <Text style={styles.sub}>Conflicting titles between Mobile & Web</Text>

        <TouchableOpacity style={styles.btnLocal}>
          <Text style={styles.btnText}>Use Mobile Version</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnMerge}>
          <Text style={styles.btnTextDark}>Execute 3-Way Field Merge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 8 },
  title: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  sub: { fontSize: 11, color: '#94a3b8' },
  btnLocal: { backgroundColor: '#38bdf822', borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#38bdf855' },
  btnMerge: { backgroundColor: '#4ade80', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: '700', color: '#38bdf8' },
  btnTextDark: { fontSize: 12, fontWeight: '800', color: '#090d16' },
});
