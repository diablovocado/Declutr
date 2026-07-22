import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export type EntityType = 'Person' | 'Organization' | 'Location' | 'Date' | 'Amount' | 'Product' | 'Identifier';

interface MobileEntity {
  type: EntityType;
  canonicalName: string;
  originalValue: string;
  confidenceScore: number;
}

export function EntityViewer({ assetId }: { assetId: string }) {
  const [entities, setEntities] = useState<MobileEntity[] | null>(null);

  useEffect(() => {
    // Mock fetch for React Native
    setTimeout(() => {
      setEntities([
        { type: "Organization", canonicalName: "Google", originalValue: "Google LLC", confidenceScore: 0.99 },
        { type: "Location", canonicalName: "New York City", originalValue: "NYC", confidenceScore: 0.95 },
        { type: "Amount", canonicalName: "1500.50 USD", originalValue: "$1,500.50", confidenceScore: 0.99 },
      ]);
    }, 500);
  }, [assetId]);

  if (!entities) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#6366f1" />
        <Text style={styles.loading}>Extracting Entities...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Entities</Text>
      </View>
      
      <View style={styles.content}>
        {entities.map((ent, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.typeBadge}>{ent.type}</Text>
              <Text style={styles.confidence}>{Math.round(ent.confidenceScore * 100)}%</Text>
            </View>
            <Text style={styles.canonicalName}>{ent.canonicalName}</Text>
            <Text style={styles.originalValue}>Found as: "{ent.originalValue}"</Text>
          </View>
        ))}
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
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidence: {
    fontSize: 12,
    color: "#34d399",
    fontFamily: "monospace",
  },
  canonicalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 4,
  },
  originalValue: {
    fontSize: 13,
    color: "#64748b",
  }
});
