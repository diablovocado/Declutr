import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function NotificationDetail() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Alert Detail</Text>
      <View style={styles.card}>
        <Text style={styles.badge}>URGENT • WARNING</Text>
        <Text style={styles.title}>Passport Expiring Soon (65 Days)</Text>
        <Text style={styles.msg}>Your US Passport expires on September 25, 2025. Renewal recommended before upcoming travel.</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>⚡ Open Asset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#ef444444', gap: 6 },
  badge: { fontSize: 10, fontWeight: '800', color: '#ef4444' },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  msg: { fontSize: 13, color: '#cbd5e1', lineHeight: 18 },
  btn: { backgroundColor: '#6366f1', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
});
