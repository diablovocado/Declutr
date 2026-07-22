import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleCreateVault = () => {
    // Navigate directly to the Vault screen upon successful vault setup
    router.replace('/vault');
  };

  const handleSignIn = () => {
    // Navigate to Login screen
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Encrypted Session Status */}
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>SECURE CLIENT-SIDE SANDBOX ACTIVE</Text>
          </View>

          {/* Logo / Brand Section */}
          <View style={styles.brandContainer}>
            <View style={styles.logoRing}>
              <View style={styles.logoDiamond}>
                <View style={styles.logoCore} />
              </View>
            </View>
            <Text style={styles.title}>Declutr</Text>
            <Text style={styles.subtitle}>Zero-Trust Digital Life Vault</Text>
          </View>

          {/* Credentials Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <Text style={styles.label}>VAULT IDENTIFIER (EMAIL)</Text>
            <TextInput
              style={[
                styles.input,
                isEmailFocused && styles.inputFocused,
              ]}
              placeholder="Enter your email address"
              placeholderTextColor="#55555C"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <Text style={styles.label}>MASTER ENCRYPTION KEY (PASSWORD)</Text>
            <TextInput
              style={[
                styles.input,
                isPasswordFocused && styles.inputFocused,
              ]}
              placeholder="Minimum 12 characters recommended"
              placeholderTextColor="#55555C"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Create Vault Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateVault}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>CREATE SECURE VAULT</Text>
            </TouchableOpacity>

            {/* Sign In Text Link */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSignIn}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                Already have a vault? <Text style={styles.accentText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Guarantee / Footnote */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🛡️ END-TO-END AES-GCM-256 ENCRYPTION</Text>
            <Text style={styles.footerSubtext}>
              No credentials or cryptographic keys are ever transmitted or stored in unencrypted format.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#000000',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    color: '#88888F',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoDiamond: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#10B981',
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    color: '#88888F',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#1F1F23',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  inputFocused: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#88888F',
    fontSize: 14,
    fontWeight: '500',
  },
  accentText: {
    color: '#10B981',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerText: {
    color: '#44444A',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  footerSubtext: {
    color: '#333336',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 16,
  },
});
