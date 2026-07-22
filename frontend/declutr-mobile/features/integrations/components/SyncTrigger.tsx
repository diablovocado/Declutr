
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function SyncTrigger({ connectorId }: { connectorId: string }) {
  const handlePress = () => {
    // trigger sync
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handlePress}>
      <Text style={styles.btnText}>Sync</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#6366f122', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#6366f155' },
  btnText: { fontSize: 12, fontWeight: '700', color: '#818cf8' },
});
