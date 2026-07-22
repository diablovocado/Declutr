import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface MobileExtensionItem {
  id: string;
  name: string;
  version: string;
  category: string;
  rating: number;
}

export interface ExtensionCardProps {
  extension: MobileExtensionItem;
  onPress: () => void;
}

export const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>🧩 {extension.name}</Text>
        <Text style={styles.version}>v{extension.version}</Text>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.category}>{extension.category}</Text>
        <Text style={styles.rating}>⭐ {extension.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  headerRow: {
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
    fontFamily: 'monospace',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  category: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rating: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
