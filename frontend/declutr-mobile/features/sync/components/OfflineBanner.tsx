import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function OfflineBanner({ isOnline = true }: { isOnline?: boolean }) {
  if (isOnline) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️ Offline Mode: Local edits queued for sync</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#f59e0b', paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center' },
  text: { fontSize: 12, fontWeight: '800', color: '#090d16' },
});
