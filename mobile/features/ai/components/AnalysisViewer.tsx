import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export interface MobileAIAnalysis {
  title: string;
  shortSummary: string;
  confidenceScore: number;
  classification: {
    documentCategory: string;
    documentType: string;
    qualityScore: number;
  };
  tags: { name: string; confidenceScore: number }[];
}

export function AnalysisViewer({ assetId }: { assetId: string }) {
  const [analysis, setAnalysis] = useState<MobileAIAnalysis | null>(null);

  useEffect(() => {
    // Mock fetch for React Native
    setTimeout(() => {
      setAnalysis({
        title: "Mobile View: Alpha Requirements",
        shortSummary: "A brief overview of the Alpha project constraints designed for native rendering.",
        confidenceScore: 0.95,
        classification: {
          documentCategory: "General Note",
          documentType: "Markdown Document",
          qualityScore: 0.99,
        },
        tags: [
          { name: "Project", confidenceScore: 0.9 },
          { name: "Planning", confidenceScore: 0.85 },
        ]
      });
    }, 500);
  }, [assetId]);

  if (!analysis) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#6366f1" />
        <Text style={styles.loading}>Analyzing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Understanding</Text>
        <Text style={styles.confidence}>Confidence: {Math.round(analysis.confidenceScore * 100)}%</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{analysis.title}</Text>
          <Text style={styles.cardBody}>{analysis.shortSummary}</Text>
        </View>

        <Text style={styles.sectionTitle}>Classification</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{analysis.classification.documentCategory}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{analysis.classification.documentType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quality</Text>
            <Text style={styles.value}>{Math.round(analysis.classification.qualityScore * 100)}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagContainer}>
          {analysis.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
        </View>
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
    color: "#818cf8",
    marginTop: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  confidence: {
    fontSize: 12,
    color: "#34d399",
    fontFamily: "monospace",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    color: "#94a3b8",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#64748b",
    fontSize: 13,
  },
  value: {
    color: "#e2e8f0",
    fontSize: 13,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#cbd5e1",
    fontSize: 12,
  }
});
