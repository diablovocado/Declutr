import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function MobileDashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentAssets, setRecentAssets] = useState([
    {
      id: 'f1',
      name: 'Tax_Filing_Form_1040_2025.pdf',
      size: '4.2 MB',
      summary: 'Annual 2025 IRS Tax return filing indicating $125k total income.',
      status: 'READY 100%',
    },
    {
      id: 'f2',
      name: 'Cardiology_Prescription_Dr_Sharma.pdf',
      size: '1.8 MB',
      summary: 'Cardiology prescription and diagnostic report by Dr. Sharma.',
      status: 'READY 100%',
    },
  ]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickUpload = () => {
    Alert.alert('Upload Launcher', 'Select file or scan document to upload into zero-knowledge vault.', [
      {
        text: 'Simulate Upload',
        onPress: () => {
          const newAsset = {
            id: 'f_' + Math.random().toString(36).substring(2, 7),
            name: 'New_Ingested_Asset.pdf',
            size: '2.4 MB',
            summary: 'Newly indexed document with vector embeddings.',
            status: 'READY 100%',
          };
          setRecentAssets((prev) => [newAsset, ...prev]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.diamondLogo}>
            <View style={styles.diamondCore} />
          </View>
          <Text style={styles.headerTitle font-bold}>Personal Intelligence Hub</Text>
        </View>
        <TouchableOpacity
          style={styles.vaultBadge}
          onPress={() => router.push('/vault')}
          activeOpacity={0.7}
        >
          <Text style={styles.vaultBadgeText}>VAULT ONLINE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Dynamic Greeting Card */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTag}>GOOD DAY, MAITHILI ✨</Text>
          <Text style={styles.greetingTitle}>Your Vault Memory Hub</Text>
          <Text style={styles.greetingSubtitle}>
            3 AI insights and 2 recent updates ready for review.
          </Text>
        </View>

        {/* Smart Natural Search Hero */}
        <View style={styles.searchHeroCard}>
          <Text style={styles.sectionTag}>SMART NATURAL SEARCH</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search files or ask 'What tax forms did I file?'"
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Action Pills */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.primaryActionPill} onPress={handleQuickUpload}>
            <Text style={styles.primaryActionText}>+ UPLOAD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPill} onPress={() => router.push('/explore')}>
            <Text style={styles.actionText}>ASK AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPill} onPress={() => router.push('/vault')}>
            <Text style={styles.actionText}>COLLECTIONS</Text>
          </TouchableOpacity>
        </View>

        {/* AI Intelligence Insights */}
        <Text style={styles.sectionTitle}>AI INSIGHTS & RECOMMENDATIONS</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTag}>
              <Text style={styles.insightTagText}>ACTION REQUIRED</Text>
            </View>
            <Text style={styles.insightTime}>Today</Text>
          </View>
          <Text style={styles.insightTitle}>Tax Filing 2025 Review</Text>
          <Text style={styles.insightDesc}>
            Form 1040 is missing an accountant verification tag before submission.
          </Text>
        </View>

        {/* Recent Memory Assets */}
        <Text style={styles.sectionTitle}>RECENT ASSETS ({recentAssets.length})</Text>
        {recentAssets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetStatus}>{asset.status}</Text>
            </View>
            <Text style={styles.assetSummary}>{asset.summary}</Text>
            <Text style={styles.assetSize}>{asset.size}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamondLogo: {
    width: 18,
    height: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  diamondCore: {
    width: 6,
    height: 6,
    backgroundColor: '#10b981',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  vaultBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  vaultBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  container: {
    padding: 20,
  },
  greetingCard: {
    backgroundColor: '#141c2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 16,
  },
  greetingTag: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  greetingTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  greetingSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  searchHeroCard: {
    backgroundColor: '#141c2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
  },
  sectionTag: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#090d16',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 12,
  },
  searchButton: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  primaryActionPill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryActionText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  actionPill: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#141c2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  insightTagText: {
    color: '#a855f7',
    fontSize: 9,
    fontWeight: '700',
  },
  insightTime: {
    color: '#64748b',
    fontSize: 10,
  },
  insightTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
  },
  assetCard: {
    backgroundColor: '#141c2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 10,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  assetName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  assetStatus: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  assetSummary: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  assetSize: {
    color: '#64748b',
    fontSize: 10,
  },
});
