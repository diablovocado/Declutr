import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function VaultScreen() {
  const handleLockVault = () => {
    router.replace('/login');
  };

  const handleUploadFile = () => {
    console.log('Upload file clicked');
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
            <Text style={styles.statusTitle}>SECURE CLIENT SANDBOX ONLINE</Text>
          </View>
          <Text style={styles.welcomeText}>
            Welcome to your vault. Your local decryption key is derived and actively loaded in memory.
          </Text>
          
          <View style={styles.shardsContainer}>
            <Text style={styles.shardsTitle}>ACTIVE DECENTRALIZED SHARDS:</Text>
            <View style={styles.shardsRow}>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>TOKYO</Text>
              </View>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>ZURICH</Text>
              </View>
              <View style={styles.shardBadge}>
                <View style={styles.shardActiveDot} />
                <Text style={styles.shardText}>REYKJAVIK</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Empty State / Placeholder Card */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyLogoRing}>
            <View style={styles.emptyLogoDiamond} />
          </View>
          <Text style={styles.emptyTitle}>No files yet</Text>
          <Text style={styles.emptyDescription}>
            Any files uploaded to your Declutr vault are encrypted locally on this device before being sharded and distributed globally.
          </Text>
        </View>

        {/* Upload Button Placeholder */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadFile}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadButtonText}>UPLOAD FILE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F23',
    backgroundColor: '#000000',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogoDiamond: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogoCore: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lockButton: {
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  lockButtonText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  container: {
    padding: 20,
    gap: 20,
  },
  statusCard: {
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#1F1F23',
    borderRadius: 16,
    padding: 18,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusTitle: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  welcomeText: {
    color: '#88888F',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  shardsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1F1F23',
    paddingTop: 14,
  },
  shardsTitle: {
    color: '#55555C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  shardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#1F1F23',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  shardActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  shardText: {
    color: '#88888F',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: '#050505',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#1F1F23',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogoRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1F1F23',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyLogoDiamond: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#55555C',
    transform: [{ rotate: '45deg' }],
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#55555C',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  uploadButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
