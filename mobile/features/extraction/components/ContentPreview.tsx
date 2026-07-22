import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

type BlockType = 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'caption' | 'link';

interface ContentBlock {
  blockId: string;
  blockType: BlockType;
  content: string;
}

interface ExtractedDocument {
  documentId: string;
  wordCount: number;
  blocks: ContentBlock[];
}

export function ContentPreview({ assetId }: { assetId: string }) {
  const [doc, setDoc] = useState<ExtractedDocument | null>(null);

  useEffect(() => {
    // Mock fetch for React Native
    setTimeout(() => {
      setDoc({
        documentId: "doc_123",
        wordCount: 15,
        blocks: [
          { blockId: "b1", blockType: "heading", content: "Mobile Extracted Title" },
          { blockId: "b2", blockType: "paragraph", content: "This is a preview of the extracted content rendered natively on mobile." },
        ]
      });
    }, 500);
  }, [assetId]);

  if (!doc) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#6366f1" />
        <Text style={styles.loading}>Extracting...</Text>
      </View>
    );
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.blockType) {
      case "heading":
        return <Text key={block.blockId} style={styles.heading}>{block.content}</Text>;
      case "paragraph":
        return <Text key={block.blockId} style={styles.paragraph}>{block.content}</Text>;
      default:
        return <Text key={block.blockId} style={styles.defaultBlock}>{block.content}</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Preview</Text>
        <Text style={styles.subtitle}>{doc.wordCount} words</Text>
      </View>
      <View style={styles.content}>
        {doc.blocks.map(renderBlock)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  loading: {
    color: "#94a3b8",
    marginTop: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    color: "#cbd5e1",
    lineHeight: 24,
    marginBottom: 16,
  },
  defaultBlock: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 8,
  }
});
