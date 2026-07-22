import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export interface MobileRecycleItem {
  id: string;
  name: string;
  daysLeft: number;
}

export interface MobileVersioningSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileVersioningSheet({ visible, onClose }: MobileVersioningSheetProps) {
  const deletedItems: MobileRecycleItem[] = [
    { id: 'b1', name: 'Old_Draft_Tax_Calculation_2024.pdf', daysLeft: 28 },
    { id: 'b2', name: 'Temporary_Medical_Receipt.pdf', daysLeft: 25 },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Recycle Bin & Recovery</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>DONE</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={deletedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.days}>{item.daysLeft} days until purge</Text>
                  <TouchableOpacity style={styles.restoreBtn} onPress={onClose}>
                    <Text style={styles.restoreText}>RESTORE</Text>
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
  days: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: '600',
  },
  restoreBtn: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  restoreText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
});
