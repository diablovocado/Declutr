import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ExtensionCard, MobileExtensionItem } from './ExtensionCard';

export interface MarketplaceBrowserProps {
  extensions: MobileExtensionItem[];
  onSelectExtension: (ext: MobileExtensionItem) => void;
}

export const MarketplaceBrowser: React.FC<MarketplaceBrowserProps> = ({
  extensions,
  onSelectExtension,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Extension Marketplace</Text>
      <FlatList
        data={extensions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExtensionCard extension={item} onPress={() => onSelectExtension(item)} />
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
});
