import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export interface MobileContextSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectContext: (name: string) => void;
}

export function MobileContextSheet({ visible, onClose, onSelectContext }: MobileContextSheetProps) {
  const contexts = [
    { id: '1', name: 'My Life Vault', type: 'VAULT' },
    { id: '2', name: 'Work & Research Vault', type: 'VAULT' },
    { id: '3', name: 'Financial & Tax 2025', type: 'COLLECTION' },
    { id: '4', name: 'Medical & Health Records', type: 'COLLECTION' },
    { id: '5', name: '2025 Tax Filing Project', type: 'PROJECT' },
    { id: '6', name: 'Tax_Filing_Form_1040_2025.pdf', type: 'DOCUMENT' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Context Switcher</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>DONE</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={contexts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contextRow}
                onPress={() => {
                  onSelectContext(item.name);
                  onClose();
                }}
              >
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.type}</Text>
                </View>
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
    maxHeight: '70%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  name: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '700',
  },
});
