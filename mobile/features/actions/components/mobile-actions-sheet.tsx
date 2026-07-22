import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export interface MobileActionItem {
  id: string;
  title: string;
  dueDate: string;
  source: string;
}

export interface MobileActionsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileActionsSheet({ visible, onClose }: MobileActionsSheetProps) {
  const actions: MobileActionItem[] = [
    { id: 'a1', title: 'Submit Form 1040 to IRS Accountant', dueDate: 'Tomorrow', source: 'Tax_Filing_Form_1040_2025.pdf' },
    { id: 'a2', title: 'Schedule Passport Renewal', dueDate: 'Aug 15', source: 'US_Passport_Scan_2021.pdf' },
    { id: 'a3', title: 'Verify W-2 Wage Summary', dueDate: 'July 25', source: 'W-2_Income_Summary_2025.pdf' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>AI Action Center</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>DONE</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={actions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.due}>Due: {item.dueDate}</Text>
                  <Text style={styles.source} numberOfLines={1}>Src: {item.source}</Text>
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
  actionCard: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  actionTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  due: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '600',
  },
  source: {
    color: '#64748b',
    fontSize: 10,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
});
