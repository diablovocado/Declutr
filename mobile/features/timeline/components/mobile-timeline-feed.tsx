import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export interface MobileTimelineEvent {
  id: string;
  time: string;
  type: string;
  title: string;
  description: string;
}

export function MobileTimelineFeed() {
  const [events, setEvents] = useState<MobileTimelineEvent[]>([
    {
      id: 'e1',
      time: '14:32 PM',
      type: 'UPLOAD',
      title: 'Uploaded Tax_Filing_Form_1040_2025.pdf',
      description: 'Zero-knowledge vault processing completed in 1.2s.',
    },
    {
      id: 'e2',
      time: '12:15 PM',
      type: 'AI_SUMMARY',
      title: 'AI Summary Generated',
      description: 'Extracted $125,000 income and $3,200 refund due.',
    },
    {
      id: 'e3',
      time: '09:45 AM',
      type: 'IMPORT',
      title: 'Google Drive Sync',
      description: 'Imported 12 new documents into Financial collection.',
    },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline Feed</Text>
        <Text style={styles.subtitle font-mono}>Chronological Memory Engine</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDesc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    padding: 16,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '800',
  },
  time: {
    color: '#64748b',
    fontSize: 11,
  },
  eventTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
  },
});
