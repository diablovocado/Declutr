import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SyncTrigger } from './SyncTrigger';

export function ConnectorCard({ connector }: { connector: { id: string; name: string; type: string; status: string } }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{connector.name}</Text>
        <Text style={styles.type}>{connector.type} • {connector.status}</Text>
      </View>
      <SyncTrigger connectorId={connector.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { gap: 2 },
  name: { fontSize: 13, fontWeight: '700', color: '#e2e8f0' },
  type: { fontSize: 11, color: '#38bdf8' },
});
