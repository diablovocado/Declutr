import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface SystemStatusCardProps {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  version: string;
  uptimeSeconds: number;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  status,
  version,
  uptimeSeconds,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'HEALTHY':
        return '#10B981';
      case 'DEGRADED':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>System Status</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.badgeText, { color: getStatusColor() }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.detail}>Platform Engine: {version}</Text>
      <Text style={styles.detail}>Uptime: {Math.floor(uptimeSeconds / 60)} minutes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
});
