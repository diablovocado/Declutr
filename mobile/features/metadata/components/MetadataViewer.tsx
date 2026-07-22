import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export interface MobileCompleteMetadata {
  general: {
    filename: string;
    mimeType: string;
    fileSize: number;
    hash: string;
    lastExtractedAt: string;
  };
  properties?: {
    properties: Record<string, any>;
  };
}

export function MetadataViewer({ assetId }: { assetId: string }) {
  const [metadata, setMetadata] = useState<MobileCompleteMetadata | null>(null);

  useEffect(() => {
    // Mock fetch for React Native
    setTimeout(() => {
      setMetadata({
        general: {
          filename: "IMG_0492.HEIC",
          mimeType: "image/heic",
          fileSize: 4500123,
          hash: "e3b0c442...",
          lastExtractedAt: new Date().toISOString()
        },
        properties: {
          properties: {
            width: 4032,
            height: 3024,
            orientation: 1
          }
        }
      });
    }, 500);
  }, [assetId]);

  if (!metadata) {
    return <Text style={styles.loading}>Loading metadata...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value} numberOfLines={1}>{metadata.general.filename}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{metadata.general.mimeType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Size</Text>
          <Text style={styles.value}>{(metadata.general.fileSize / 1024 / 1024).toFixed(2)} MB</Text>
        </View>
      </View>

      {metadata.properties && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical</Text>
          {Object.entries(metadata.properties.properties).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  loading: {
    color: "#94a3b8",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#64748b",
    fontSize: 14,
  },
  value: {
    color: "#e2e8f0",
    fontSize: 14,
    maxWidth: "60%",
    textAlign: "right",
  }
});
