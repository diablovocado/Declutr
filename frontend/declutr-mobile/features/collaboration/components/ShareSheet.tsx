import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function ShareSheet() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔒 Share Resource</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Japan Trip Photos & Itinerary</Text>
        <Text style={styles.sub}>Privacy: INVITE_ONLY • 2 Members</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>🔗 Copy Protected Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  sub: { fontSize: 12, color: '#94a3b8' },
  btn: { backgroundColor: '#6366f1', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
});
