import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function WorkflowDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙️ Workflow Details</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Auto-tag Travel Documents</Text>
        <Text style={styles.text}>Trigger: ASSET_UPLOADED</Text>
        <Text style={styles.text}>Condition: fileType EQUALS PDF AND entity CONTAINS Japan</Text>
        <Text style={styles.text}>Action 1: APPLY_TAGS (Travel, Passport)</Text>
        <Text style={styles.text}>Action 2: NOTIFY_USER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  text: { fontSize: 12, color: '#94a3b8' },
});
