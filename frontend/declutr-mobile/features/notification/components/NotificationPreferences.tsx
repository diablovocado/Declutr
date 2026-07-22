import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NotificationPreferences() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙️ Channels</Text>
      <View style={styles.card}>
        <Text style={styles.row}>In-App Notifications: ON</Text>
        <Text style={styles.row}>Email Alerts: OFF</Text>
        <Text style={styles.row}>Push Notifications: OFF</Text>
        <Text style={styles.row}>Digest Frequency: DAILY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155', gap: 6 },
  row: { fontSize: 13, color: '#e2e8f0' },
});
