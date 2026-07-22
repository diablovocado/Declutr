import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export interface MobileHealthSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileHealthSheet({ visible, onClose }: MobileHealthSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Knowledge Data Health</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>DONE</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Score Box */}
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNum}>92 / 100</Text>
              <Text style={styles.scoreText}>Vault Health: Excellent</Text>
            </View>

            {/* Metrics List */}
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Metadata Completeness</Text>
              <Text style={styles.metricVal}>95.4%</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Duplicate Rate</Text>
              <Text style={styles.metricVal}>0.4%</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Search Readiness</Text>
              <Text style={styles.metricVal}>100%</Text>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
              <Text style={styles.actionText}>REVIEW DUPLICATES (2)</Text>
            </TouchableOpacity>
          </ScrollView>
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
  body: {
    marginTop: 4,
  },
  scoreBox: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreNum: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: '900',
  },
  scoreText: {
    color: '#f8fafc',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  metricVal: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtn: {
    marginTop: 20,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#030712',
    fontSize: 11,
    fontWeight: '900',
  },
});
