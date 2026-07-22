import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface PersonaProfile {
  personaType: string;
  confidenceScore: number;
  attributes: Record<string, { importance: number; recency: number; frequency: number; confidence: number; trend: string }>;
  knowledgeModel: {
    longTermInterests: string[];
    favouriteLocations: string[];
    recurringProjects: string[];
    commonWorkflows: string[];
  };
}

const MOCK_PROFILE: PersonaProfile = {
  personaType: 'Researcher',
  confidenceScore: 0.87,
  attributes: {
    'Research': { importance: 8.4, recency: 0.92, frequency: 14, confidence: 0.87, trend: 'RISING' },
    'Software Development': { importance: 5.2, recency: 0.75, frequency: 9, confidence: 0.72, trend: 'STABLE' },
    'Travel': { importance: 3.1, recency: 0.45, frequency: 5, confidence: 0.55, trend: 'FALLING' },
  },
  knowledgeModel: {
    longTermInterests: ['Deep Learning', 'NLP', 'Knowledge Graphs'],
    favouriteLocations: ['Tokyo', 'San Francisco'],
    recurringProjects: ['Thesis Chapter 4', 'ML Pipeline'],
    commonWorkflows: ['Research', 'Software Development'],
  },
};

const personaTypeIcons: Record<string, string> = {
  Researcher: '🔬', Developer: '💻', Traveller: '✈️', Designer: '🎨',
  Photographer: '📸', Student: '🎓', Entrepreneur: '🚀', 'General User': '👤',
};

const trendColors: Record<string, string> = {
  RISING: '#4ade80', FALLING: '#f87171', STABLE: '#94a3b8',
};

const trendLabels: Record<string, string> = {
  RISING: '↑ Rising', FALLING: '↓ Falling', STABLE: '→ Stable',
};

export function PersonaDashboard() {
  const profile = MOCK_PROFILE;
  const icon = personaTypeIcons[profile.personaType] ?? '👤';
  const dimensions = Object.entries(profile.attributes);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroIcon}>{icon}</Text>
        <View style={styles.heroInfo}>
          <Text style={styles.personaType}>{profile.personaType}</Text>
          <Text style={styles.confidence}>{Math.round(profile.confidenceScore * 100)}% confidence</Text>
          <View style={styles.privacyBadge}>
            <Text style={styles.privacyText}>🔒 Private · Stays in your vault</Text>
          </View>
        </View>
      </View>

      {/* Dimensions */}
      <Text style={styles.sectionTitle}>Learning Dimensions</Text>
      {dimensions.map(([dim, sc]) => (
        <View key={dim} style={styles.dimCard}>
          <View style={styles.dimHeader}>
            <Text style={styles.dimName}>{dim}</Text>
            <Text style={[styles.trendText, { color: trendColors[sc.trend] }]}>{trendLabels[sc.trend]}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${sc.confidence * 100}%` as any }]} />
          </View>
          <Text style={styles.dimMeta}>{sc.frequency} interactions · {(sc.confidence * 100).toFixed(0)}% confidence</Text>
        </View>
      ))}

      {/* Knowledge Model */}
      <Text style={styles.sectionTitle}>Knowledge Model</Text>
      <View style={styles.kmCard}>
        {[
          { label: '🧠 Interests', items: profile.knowledgeModel.longTermInterests },
          { label: '📍 Locations', items: profile.knowledgeModel.favouriteLocations },
          { label: '🗂️ Projects', items: profile.knowledgeModel.recurringProjects },
        ].map(({ label, items }) => (
          items.length > 0 && (
            <View key={label} style={styles.kmSection}>
              <Text style={styles.kmLabel}>{label}</Text>
              <View style={styles.chips}>
                {items.slice(0, 3).map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heroCard: { backgroundColor: '#1e1b4b', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#312e81' },
  heroIcon: { fontSize: 48 },
  heroInfo: { flex: 1 },
  personaType: { fontSize: 22, fontWeight: '700', color: '#e0e7ff', marginBottom: 4 },
  confidence: { fontSize: 13, color: '#a5b4fc', marginBottom: 8 },
  privacyBadge: { backgroundColor: 'rgba(74,222,128,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  privacyText: { fontSize: 11, color: '#4ade80', fontWeight: '600' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginTop: 8 },
  dimCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  dimHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dimName: { fontSize: 14, fontWeight: '600', color: '#e2e8f0' },
  trendText: { fontSize: 12, fontWeight: '600' },
  barBg: { backgroundColor: '#334155', borderRadius: 3, height: 5, marginBottom: 8, overflow: 'hidden' },
  barFill: { backgroundColor: '#6366f1', height: 5, borderRadius: 3 },
  dimMeta: { fontSize: 11, color: '#64748b' },
  kmCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
  kmSection: { marginBottom: 14 },
  kmLabel: { fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#334155' },
  chipText: { fontSize: 12, color: '#94a3b8' },
});
