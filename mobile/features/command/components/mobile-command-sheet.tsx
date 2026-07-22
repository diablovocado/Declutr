import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';

export interface MobileCommandSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileCommandSheet({ visible, onClose }: MobileCommandSheetProps) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: '1', title: 'Open Dashboard', category: 'NAVIGATION', action: () => router.push('/(tabs)') },
    { id: '2', title: 'Open Vault Workspace', category: 'NAVIGATION', action: () => router.push('/vault') },
    { id: '3', title: 'Natural & Vector Search', category: 'NAVIGATION', action: () => router.push('/explore') },
    { id: '4', title: 'Ask AI Copilot', category: 'ACTIONS', action: () => router.push('/explore') },
    { id: '5', title: 'Upload Memory File', category: 'ACTIONS', action: () => router.push('/vault') },
    { id: '6', title: 'Tax_Filing_Form_1040_2025.pdf', category: 'RECENT', action: () => router.push('/vault') },
  ];

  const filtered = commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Universal Command Palette</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search commands or files..."
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.commandRow}
                onPress={() => {
                  item.action();
                  onClose();
                }}
              >
                <View>
                  <Text style={styles.commandTitle}>{item.title}</Text>
                  <Text style={styles.commandCategory}>{item.category}</Text>
                </View>
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#090d16',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeBtnText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#141c2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 13,
    marginBottom: 16,
  },
  commandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  commandTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  commandCategory: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  arrowText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
