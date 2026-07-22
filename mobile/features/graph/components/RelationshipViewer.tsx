import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export type RelationshipType = 'BELONGS_TO' | 'MENTIONS' | 'REFERENCES' | 'RELATED_TO' | 'LOCATED_AT';

interface MobileEdge {
  edgeId: string;
  targetNodeId: string;
  relationshipType: RelationshipType;
  confidenceScore: number;
  discoveryMethod: string;
  evidence: { evidenceId: string; evidenceText: string }[];
}

export function RelationshipViewer({ nodeId }: { nodeId: string }) {
  const [edges, setEdges] = useState<MobileEdge[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setEdges([
        {
          edgeId: "edge_1",
          targetNodeId: "node_org_1",
          relationshipType: "MENTIONS",
          confidenceScore: 0.98,
          discoveryMethod: "Entity_Overlap",
          evidence: [{ evidenceId: "ev_1", evidenceText: "Document explicitly mentions Google LLC in the extracted AI Summary." }]
        },
        {
          edgeId: "edge_2",
          targetNodeId: "node_loc_1",
          relationshipType: "LOCATED_AT",
          confidenceScore: 0.85,
          discoveryMethod: "NER_Analysis",
          evidence: [{ evidenceId: "ev_2", evidenceText: "Identified NYC as the primary location context for this file." }]
        }
      ]);
    }, 500);
  }, [nodeId]);

  if (!edges) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#6366f1" />
        <Text style={styles.loading}>Discovering Relationships...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Graph Edges</Text>
      </View>
      
      <View style={styles.content}>
        {edges.map((edge) => (
          <View key={edge.edgeId} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.typeBadge}>{edge.relationshipType}</Text>
              <Text style={styles.method}>{edge.discoveryMethod}</Text>
            </View>
            
            <Text style={styles.targetNode}>Target: {edge.targetNodeId}</Text>
            
            <View style={styles.evidenceContainer}>
              <Text style={styles.evidenceTitle}>Evidence ({Math.round(edge.confidenceScore * 100)}% Conf)</Text>
              {edge.evidence.map(ev => (
                <Text key={ev.evidenceId} style={styles.evidenceText}>"{ev.evidenceText}"</Text>
              ))}
            </View>
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
    color: "#818cf8",
    textTransform: "uppercase",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  method: {
    fontSize: 10,
    color: "#64748b",
  },
  targetNode: {
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  evidenceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 65, 85, 0.5)",
  },
  evidenceTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#cbd5e1",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  evidenceText: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
    marginBottom: 4,
  }
});
