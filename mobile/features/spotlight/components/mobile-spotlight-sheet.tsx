import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

export interface MobileSpotlightSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileSpotlightSheet({ visible, onClose }: MobileSpotlightSheetProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search Declutr or Ask AI..."
              placeholderTextColor="#64748b"
              style={styles.searchInput}
              autoFocus
            />
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={onClose}>
              <Text style={styles.actionTitle}>Camera Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onClose}>
              <Text style={styles.actionTitle}>Share Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onClose}>
              <Text style={styles.actionTitle}>Ask Copilot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: '#090d16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#030712',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
    marginRight: 10,
  },
  cancelText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionTitle: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
});
