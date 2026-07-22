import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function ManualBackup() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚡ Manual Backup</Text>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>📦 Start Immediate Encrypted Backup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  btn: { backgroundColor: '#6366f1', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
