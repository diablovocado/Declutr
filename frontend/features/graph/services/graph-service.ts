export type RelationshipType = 'BELONGS_TO' | 'MENTIONS' | 'REFERENCES' | 'RELATED_TO' | 'LOCATED_AT';

export interface EdgeEvidence {
  evidenceId: string;
  edgeId: string;
  evidenceText: string;
  createdAt: string;
}

export interface GraphEdge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: RelationshipType;
  confidenceScore: number;
  strength: number;
  discoveryMethod: string;
  evidence: EdgeEvidence[];
  createdAt: string;
}

export const GraphService = {
  async getRelationshipsForNode(nodeId: string): Promise<GraphEdge[]> {
    // Mock for UI dev
    return [
      {
        edgeId: "edge_1",
        sourceNodeId: nodeId,
        targetNodeId: "node_org_1",
        relationshipType: "MENTIONS",
        confidenceScore: 0.98,
        strength: 1.0,
        discoveryMethod: "Entity_Overlap",
        evidence: [
          {
            evidenceId: "ev_1",
            edgeId: "edge_1",
            evidenceText: "Document explicitly mentions Google LLC in the extracted AI Summary.",
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        edgeId: "edge_2",
        sourceNodeId: nodeId,
        targetNodeId: "node_loc_1",
        relationshipType: "LOCATED_AT",
        confidenceScore: 0.85,
        strength: 0.8,
        discoveryMethod: "NER_Analysis",
        evidence: [
          {
            evidenceId: "ev_2",
            edgeId: "edge_2",
            evidenceText: "Identified NYC as the primary location context for this file.",
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
  },
};
