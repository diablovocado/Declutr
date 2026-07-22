import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export interface MobilePlanApproval {
  id: string;
  title: string;
  confidence: number;
}

export interface ApprovalListProps {
  plans: MobilePlanApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalList: React.FC<ApprovalListProps> = ({ plans, onApprove, onReject }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Plan Approvals</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>🛡️ {item.title}</Text>
            <Text style={styles.confidence}>Confidence: {(item.confidence * 100).toFixed(0)}%</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item.id)}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={() => onApprove(item.id)}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidence: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  rejectBtn: {
    backgroundColor: '#EF444420',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  approveBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
