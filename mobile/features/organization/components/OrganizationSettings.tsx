import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MobileOrgSettingsProps {
  name: string;
  slug: string;
  timeZone: string;
  language: string;
}

export const OrganizationSettings: React.FC<MobileOrgSettingsProps> = ({
  name,
  slug,
  timeZone,
  language,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>Organization Profile</Text>
      <Text style={styles.label}>Name: <Text style={styles.value}>{name}</Text></Text>
      <Text style={styles.label}>Slug: <Text style={styles.value}>{slug}</Text></Text>
      <Text style={styles.label}>Time Zone: <Text style={styles.value}>{timeZone}</Text></Text>
      <Text style={styles.label}>Language: <Text style={styles.value}>{language}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  header: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
  },
  value: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
});
