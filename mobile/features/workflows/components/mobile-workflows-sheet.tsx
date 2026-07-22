import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export interface MobileWorkflowItem {
  id: string;
  title: string;
  enabled: boolean;
}

export interface MobileWorkflowsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileWorkflowsSheet({ visible, onClose }: MobileWorkflowsSheetProps) {
  const workflows: MobileWorkflowItem[] = [
    { id: 'w1', title: 'Receipt & Expense Organizer', enabled: true },
    { id: 'w2', title: 'Contract Expiration Alert', enabled: true },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Automation Workflows</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>DONE</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={workflows}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.status}>{item.enabled ? 'ACTIVE' : 'PAUSED'}</Text>
                  <TouchableOpacity style={styles.runBtn} onPress={onClose}>
                    <Text style={styles.runText}>RUN NOW</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  card: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  runBtn: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  runText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
});
