import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export interface MobileImportSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectSource: (sourceName: string) => void;
}

export function MobileImportSheet({ visible, onClose, onSelectSource }: MobileImportSheetProps) {
  const sources = [
    { id: '1', name: 'Camera Document Scanner', icon: '📷' },
    { id: '2', name: 'Photo Gallery & Apple Photos', icon: '🖼️' },
    { id: '3', name: 'Google Drive Sync', icon: '🌐' },
    { id: '4', name: 'Dropbox Account', icon: '📦' },
    { id: '5', name: 'Local Device File System', icon: '📁' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Universal Mobile Import</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={sources}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sourceRow}
                onPress={() => {
                  onSelectSource(item.name);
                  onClose();
                }}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.name}>{item.name}</Text>
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
    maxHeight: '60%',
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
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  name: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
});
