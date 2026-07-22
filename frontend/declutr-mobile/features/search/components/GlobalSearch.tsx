import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GlobalSearchProps {
  onSearch: (query: string) => void;
}

export function GlobalSearch({ onSearch }: GlobalSearchProps) {
  const [query, setQuery] = useState('passport Japan 2025');

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => onSearch(query)}
          placeholder="Search files, memories, contexts..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <TouchableOpacity style={styles.btn} onPress={() => onSearch(query)}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#334155', gap: 8 },
  icon: { fontSize: 16 },
  input: { flex: 1, color: '#e2e8f0', fontSize: 14 },
  btn: { backgroundColor: '#6366f1', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
});
