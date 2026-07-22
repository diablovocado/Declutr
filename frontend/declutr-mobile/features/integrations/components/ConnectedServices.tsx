import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectorCard } from './ConnectorCard';

const MOCK_CONNECTORS = [
  { id: '1', name: 'Google Drive', type: 'GOOGLE_DRIVE', status: 'CONNECTED' },
  { id: '2', name: 'Nextcloud WebDAV', type: 'WEBDAV', status: 'CONNECTED' },
];

export function ConnectedServices() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔌 Connected Integrations (2)</Text>
      {MOCK_CONNECTORS.map((c) => (
        <ConnectorCard key={c.id} connector={c} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 },
});
