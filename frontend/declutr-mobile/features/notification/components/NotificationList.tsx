import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_NOTIFS = [
  { id: '1', title: 'Passport Expiring Soon (65 Days)', priority: 'URGENT', type: 'WARNING', time: '30m ago' },
  { id: '2', title: 'Workflow Completed: Auto-tag', priority: 'MEDIUM', type: 'WORKFLOW', time: '2h ago' },
  { id: '3', title: 'Encryption Key Rotation Suggested', priority: 'HIGH', type: 'SECURITY', time: '5h ago' },
];

export function NotificationList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>🔔 Notifications (3)</Text>
      {MOCK_NOTIFS.map((n) => {
        const isUrgent = n.priority === 'URGENT' || n.priority === 'HIGH';
        return (
          <TouchableOpacity key={n.id} style={[styles.card, { borderColor: isUrgent ? '#ef444444' : '#334155' }]}>
            <View style={styles.topRow}>
              <Text style={[styles.badge, { color: isUrgent ? '#ef4444' : '#38bdf8' }]}>{n.priority}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
            <Text style={styles.title}>{n.title}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  badge: { fontSize: 10, fontWeight: '800' },
  time: { fontSize: 11, color: '#64748b' },
  title: { fontSize: 14, fontWeight: '700', color: '#e2e8f0' },
});
