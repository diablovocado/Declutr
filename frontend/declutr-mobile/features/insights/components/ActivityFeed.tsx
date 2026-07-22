import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ActivityFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Growth Metrics</Text>
      <View style={styles.grid}>
        <View style={styles.box}>
          <Text style={styles.val}>4</Text>
          <Text style={styles.lbl}>Events</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.val}>3</Text>
          <Text style={styles.lbl}>Insights</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.val}>2</Text>
          <Text style={styles.lbl}>Milestones</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
  grid: { flexDirection: 'row', gap: 8 },
  box: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  val: { fontSize: 18, fontWeight: '800', color: '#6366f1' },
  lbl: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
});
