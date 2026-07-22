import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileInstallation {
  id: string;
  extension_id: string;
  status: string;
  version: string;
}

export interface InstalledExtensionsListProps {
  installations: MobileInstallation[];
}

export const InstalledExtensionsList: React.FC<InstalledExtensionsListProps> = ({ installations }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installed Extensions</Text>
      <FlatList
        data={installations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.extension_id}</Text>
              <Text style={styles.version}>v{item.version}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  version: {
    color: '#94A3B8',
    fontSize: 11,
  },
  statusBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
