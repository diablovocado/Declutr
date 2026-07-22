import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';

export interface MobileChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export function MobileAIWorkspace() {
  const [messages, setMessages] = useState<MobileChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content: 'Welcome to your Global AI Workspace. Ask natural language questions across your digital vault.',
      citations: ['Form 1040 Tax Return (Line 12)'],
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [scope, setScope] = useState('Entire Vault');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: MobileChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputText;
    setInputText('');

    setTimeout(() => {
      const aiMsg: MobileChatMessage = {
        id: 'a_' + Date.now(),
        sender: 'assistant',
        content: `Cross-Knowledge Reasoning (${scope}): Processed your prompt over your encrypted memories with zero-knowledge security.`,
        citations: ['Form 1040 Tax Return (Line 12)', 'W-2 Income Summary 2025'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar Scope Indicator */}
      <View style={styles.scopeHeader}>
        <Text style={styles.scopeLabel}>Scope:</Text>
        <TouchableOpacity style={styles.scopePill}>
          <Text style={styles.scopeText}>{scope} (42 items)</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgBox,
              item.sender === 'user' ? styles.userMsg : styles.aiMsg,
            ]}
          >
            <Text style={styles.msgText}>{item.content}</Text>
            {item.citations && item.citations.length > 0 && (
              <View style={styles.citationsBox}>
                <Text style={styles.citationLabel}>Sources:</Text>
                {item.citations.map((c, idx) => (
                  <Text key={idx} style={styles.citationItem}>• {c}</Text>
                ))}
              </View>
            )}
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask across your vault..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>SEND</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  scopeLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginRight: 6,
  },
  scopePill: {
    backgroundColor: '#141c2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scopeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  messagesList: {
    padding: 16,
  },
  msgBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '85%',
  },
  userMsg: {
    backgroundColor: '#059669',
    alignSelf: 'flex-end',
  },
  aiMsg: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignSelf: 'flex-start',
  },
  msgText: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
  },
  citationsBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  citationLabel: {
    color: '#c084fc',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  citationItem: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  timeText: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#090d16',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 12,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendText: {
    color: '#030712',
    fontSize: 11,
    fontWeight: '800',
  },
});
