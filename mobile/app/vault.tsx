import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface VaultItem {
  id: string;
  name: string;
  size: string;
  status: string;
  summary: string;
}

export default function VaultScreen() {
  const [items, setItems] = useState<VaultItem[]>([
    {
      id: 'f1',
      name: 'Tax_Filing_Form_1040_2025.pdf',
      size: '4.2 MB',
      status: 'READY 100%',
      summary: 'Annual 2025 IRS Tax return filing indicating $125k total income and $3,200 refund due.',
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleLockVault = () => {
    router.replace('/login');
  };

  const handleUploadFile = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newItem: VaultItem = {
        id: 'f_' + Math.random().toString(36).substring(2, 7),
        name: 'Medical_Prescription_Dr_Sharma.pdf',
        size: '1.8 MB',
        status: 'READY 100%',
        summary: 'Cardiology prescription and diagnostic report by Dr. Sharma.',
      };
      setItems((prev) => [newItem, ...prev]);
      setIsUploading(false);
      Alert.alert('Memory Ingested', 'Document processed cleanly with vector embeddings & citations.');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLogoDiamond}>
            <View style={styles.headerLogoCore} />
          </View>
          <Text style={styles.headerTitle}>Declutr Vault</Text>
        </View>

        <TouchableOpacity
          style={styles.lockButton}
          onPress={handleLockVault}
          activeOpacity={0.7}
        >
          <Text style={styles.lockButtonText}>LOCK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Status Dashboard Summary */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.statusTitle}>ZERO-KNOWLEDGE VAULT ACTIVE</Text>
          </View>
          <Text style={styles.welcomeText}>
            AES-256 Client Encryption loaded in memory. Storage: 4.2 MB / 10 GB.
          </Text>

          <View style={styles.shardsContainer}>
            <Text style={styles.shardsTitle}>INGESTION PIPELINE:</Text>
            <View style={styles.shardsRow}>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>OCR</Text>
              </View>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>METADATA</Text>
              </View>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>512-VEC</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Upload Action */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadFile}
          disabled={isUploading}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'INGESTING MEMORY...' : '+ UPLOAD MEMORY FILE'}
          </Text>
        </TouchableOpacity>

        {/* Uploaded Digital Items List */}
        <Text style={styles.sectionTitle}>INDEXED DIGITAL ASSETS ({items.length})</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.itemSummary}>{item.summary}</Text>
            <Text style={styles.itemSize}>Size: {item.size}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoDiamond: {
    width: 18,
    height: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerLogoCore: {
    width: 6,
    height: 6,
    backgroundColor: '#10B981',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  lockButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  lockButtonText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  container: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#141417',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusTitle: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  welcomeText: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  shardsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 12,
  },
  shardsTitle: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
  },
  shardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  shardActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  shardText: {
    color: '#E4E4E7',
    fontSize: 10,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  itemCard: {
    backgroundColor: '#141417',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 14,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  readyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  readyBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  itemSummary: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  itemSize: {
    color: '#71717A',
    fontSize: 10,
  },
});
