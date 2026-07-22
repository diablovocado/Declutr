import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const MOCK_MESSAGES = [
  { id: '1', role: 'USER', content: 'What documents are related to my Japan trip and when does my passport expire?' },
  { id: '2', role: 'ASSISTANT', content: 'Based on your vault records in **"Japanese Visa & Passport Scan"** (PDF), your passport expires on **September 25, 2025** (in 65 days).', confidence: 0.96 },
];

export function ChatInterface() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'USER', content: input };
    const asstMsg = {
      id: (Date.now() + 1).toString(),
      role: 'ASSISTANT',
      content: `Based on your vault records, your query "${input}" was answered with grounded confidence.`,
      confidence: 0.94,
    };
    setMessages([...messages, userMsg, asstMsg]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {messages.map((m) => {
          const isUser = m.role === 'USER';
          return (
            <View key={m.id} style={[styles.bubble, isUser ? styles.userBubble : styles.asstBubble]}>
              <Text style={styles.roleLabel}>{isUser ? 'You' : 'Declutr Copilot'}</Text>
              <Text style={styles.text}>{m.content}</Text>
              {m.confidence && (
                <Text style={styles.confText}>{Math.round(m.confidence * 100)}% Grounded</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          placeholder="Ask AI Copilot..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <TouchableOpacity style={styles.btn} onPress={handleSend}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  feed: { flex: 1, padding: 14 },
  bubble: { borderRadius: 14, padding: 12, marginBottom: 10, maxWidth: '85%' },
  userBubble: { backgroundColor: '#6366f1', alignSelf: 'flex-end' },
  asstBubble: { backgroundColor: '#1e293b', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#334155' },
  roleLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginBottom: 4 },
  text: { color: '#e2e8f0', fontSize: 14, lineHeight: 18 },
  confText: { color: '#4ade80', fontSize: 10, fontWeight: '700', marginTop: 4 },
  inputRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#334155', backgroundColor: '#1e293b', gap: 8 },
  input: { flex: 1, backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, color: '#e2e8f0', fontSize: 14 },
  btn: { backgroundColor: '#6366f1', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
