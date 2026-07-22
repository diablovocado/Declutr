import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export interface MobileMember {
  id: string;
  name: string;
  email: string;
  role_name: string;
  status: string;
}

export interface MemberListProps {
  members: MobileMember[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organization Directory</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberEmail}>{item.email}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.role_name}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberEmail: {
    color: '#94A3B8',
    fontSize: 12,
  },
  badge: {
    backgroundColor: '#3B82F620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
