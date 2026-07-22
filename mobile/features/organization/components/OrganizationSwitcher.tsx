import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface MobileOrgSummary {
  id: string;
  name: string;
}

export interface MobileOrgSwitcherProps {
  organizations: MobileOrgSummary[];
  activeOrgId: string | null;
  onSelectOrg: (id: string | null) => void;
}

export const OrganizationSwitcher: React.FC<MobileOrgSwitcherProps> = ({
  organizations,
  activeOrgId,
  onSelectOrg,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>CONTEXT SWITCHER</Text>
      <TouchableOpacity
        style={[styles.item, activeOrgId === null && styles.activeItem]}
        onPress={() => onSelectOrg(null)}
      >
        <Text style={[styles.itemText, activeOrgId === null && styles.activeText]}>
          👤 Personal Account
        </Text>
      </TouchableOpacity>

      {organizations.map((org) => (
        <TouchableOpacity
          key={org.id}
          style={[styles.item, activeOrgId === org.id && styles.activeItem]}
          onPress={() => onSelectOrg(org.id)}
        >
          <Text style={[styles.itemText, activeOrgId === org.id && styles.activeText]}>
            🏢 {org.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginVertical: 8,
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: '#0F172A',
  },
  activeItem: {
    backgroundColor: '#3B82F620',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  itemText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});
