import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const CONTROLS = [
  {
    id: 'pause',
    icon: '⏸',
    title: 'Pause Learning',
    description: 'Pause signal collection. Your existing persona data is preserved.',
    actionLabel: 'Pause',
    color: '#f59e0b',
  },
  {
    id: 'reset',
    icon: '🔄',
    title: 'Reset Persona',
    description: 'Clear all signals and scores. Your persona will rebuild from scratch.',
    actionLabel: 'Reset',
    color: '#f87171',
  },
  {
    id: 'export',
    icon: '📤',
    title: 'Export My Data',
    description: 'Download all persona data as JSON. Full transparency, no surprises.',
    actionLabel: 'Export',
    color: '#818cf8',
  },
  {
    id: 'delete',
    icon: '🗑',
    title: 'Delete All Data',
    description: 'Permanently remove all persona data. Cannot be undone.',
    actionLabel: 'Delete',
    color: '#ef4444',
  },
];

export function PrivacyControls() {
  const [learningPaused, setLearningPaused] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const handlePress = (id: string) => {
    if (id === 'pause') {
      setLearningPaused(!learningPaused);
      return;
    }
    Alert.alert(
      id === 'delete' ? '⚠️ Delete All Data?' : id === 'reset' ? '🔄 Reset Persona?' : '📤 Export Data',
      id === 'delete'
        ? 'This will permanently remove all your persona data. This cannot be undone.'
        : id === 'reset'
        ? 'This will clear all signals, scores, and recommendations. Your persona will rebuild over time.'
        : 'Your persona data will be exported as a JSON file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: id === 'delete' || id === 'reset' ? 'Confirm' : 'OK', style: id === 'delete' ? 'destructive' : 'default', onPress: () => setDone((d) => ({ ...d, [id]: true })) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🔒 Privacy Controls</Text>
      <Text style={styles.subtitle}>
        All your persona data lives exclusively in your vault. Nothing is shared. Nothing is sold.
      </Text>

      {CONTROLS.map((ctrl) => (
        <View key={ctrl.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{ctrl.icon}</Text>
            <Text style={styles.cardTitle}>
              {ctrl.id === 'pause' && learningPaused ? 'Resume Learning' : ctrl.title}
            </Text>
          </View>
          <Text style={styles.cardDesc}>{ctrl.description}</Text>
          {done[ctrl.id] ? (
            <Text style={styles.doneText}>✓ Done</Text>
          ) : (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: ctrl.color + '22', borderColor: ctrl.color + '55' }]}
              onPress={() => handlePress(ctrl.id)}
            >
              <Text style={[styles.btnText, { color: ctrl.color }]}>
                {ctrl.id === 'pause' ? (learningPaused ? 'Resume Learning' : 'Pause Learning') : ctrl.actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🛡️ Declutr never sends your persona data to any third party. No analytics. No advertising.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 24, lineHeight: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  cardIcon: { fontSize: 24 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 14 },
  btn: { borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'center' },
  btnText: { fontSize: 13, fontWeight: '700' },
  doneText: { fontSize: 13, color: '#4ade80', fontWeight: '700' },
  notice: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginTop: 8, marginBottom: 24 },
  noticeText: { fontSize: 12, color: '#64748b', lineHeight: 18 },
});
