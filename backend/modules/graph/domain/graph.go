package domain

import (
	"time"
)

type RelationshipType string
type NodeType string

const (
	TypeBelongsTo      RelationshipType = "BELONGS_TO"
	TypeMentions       RelationshipType = "MENTIONS"
	TypeReferences     RelationshipType = "REFERENCES"
	TypeCreatedBy      RelationshipType = "CREATED_BY"
	TypeReceivedFrom   RelationshipType = "RECEIVED_FROM"
	TypeSentTo         RelationshipType = "SENT_TO"
	TypeRelatedTo      RelationshipType = "RELATED_TO"
	TypePartOf         RelationshipType = "PART_OF"
	TypeLocatedAt      RelationshipType = "LOCATED_AT"
	TypeHappenedAt     RelationshipType = "HAPPENED_AT"
	TypePaymentFor     RelationshipType = "PAYMENT_FOR"

	NodeAsset      NodeType = "Asset"
	NodeEntity     NodeType = "Entity"
	NodeCollection NodeType = "Collection"
)

type GraphNode struct {
	NodeID      string    `json:"nodeId"`
	VaultID     string    `json:"vaultId"`
	Type        NodeType  `json:"nodeType"`
	ReferenceID string    `json:"referenceId"` // ID of the Asset or Entity
	CreatedAt   time.Time `json:"createdAt"`
}

type EdgeEvidence struct {
	EvidenceID   string    `json:"evidenceId"`
	EdgeID       string    `json:"edgeId"`
	EvidenceText string    `json:"evidenceText"`
	CreatedAt    time.Time `json:"createdAt"`
}

type GraphEdge struct {
	EdgeID          string           `json:"edgeId"`
	VaultID         string           `json:"vaultId"`
	SourceNodeID    string           `json:"sourceNodeId"`
	TargetNodeID    string           `json:"targetNodeId"`
	Relationship    RelationshipType `json:"relationshipType"`
	ConfidenceScore float64          `json:"confidenceScore"`
	Strength        float64          `json:"strength"`
	DiscoveryMethod string           `json:"discoveryMethod"`
	Evidence        []EdgeEvidence   `json:"evidence,omitempty"`
	CreatedAt       time.Time        `json:"createdAt"`
	UpdatedAt       time.Time        `json:"updatedAt"`
}

type GraphVersion struct {
	VersionID  string    `json:"versionId"`
	VaultID    string    `json:"vaultId"`
	NodesCount int       `json:"nodesCount"`
	EdgesCount int       `json:"edgesCount"`
	CreatedAt  time.Time `json:"createdAt"`
}
