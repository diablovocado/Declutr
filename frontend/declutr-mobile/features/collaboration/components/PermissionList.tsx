import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_MEMBERS = [
  { id: '1', email: 'owner@declutr.local', role: 'OWNER' },
  { id: '2', email: 'alex@travel.org', role: 'EDIT' },
];

export function PermissionList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Members & Roles</Text>
      {MOCK_MEMBERS.map((m) => (
        <View key={m.id} style={styles.card}>
          <Text style={styles.email}>{m.email}</Text>
          <Text style={styles.role}>{m.role}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between' },
  email: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  role: { fontSize: 11, fontWeight: '800', color: '#38bdf8' },
});
