import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FILE_TYPES = ['PDF', 'DOCX', 'PNG', 'JPG', 'MP4'];

export function SearchFilters() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Filters</Text>
      <Text style={styles.sectionLabel}>File Types</Text>
      <View style={styles.chipRow}>
        {FILE_TYPES.map((ft) => (
          <TouchableOpacity key={ft} style={styles.chip}>
            <Text style={styles.chipText}>{ft}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  sectionLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: '600' },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#334155' },
  chipText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
});
