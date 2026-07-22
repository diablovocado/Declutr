import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SecurityOverview() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛡️ Trust Center Overview</Text>
      <View style={styles.card}>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>92</Text>
          <View style={styles.badgeCol}>
            <Text style={styles.grade}>GRADE A</Text>
            <Text style={styles.status}>HEALTHY</Text>
          </View>
        </View>
        <Text style={styles.desc}>Zero-Knowledge Encryption Active • MFA Recommended</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  score: { fontSize: 36, fontWeight: '900', color: '#818cf8' },
  badgeCol: { gap: 2 },
  grade: { fontSize: 12, fontWeight: '900', color: '#4ade80' },
  status: { fontSize: 11, fontWeight: '800', color: '#38bdf8' },
  desc: { fontSize: 12, color: '#94a3b8' },
});
