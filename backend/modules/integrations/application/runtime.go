package application

import (
	"context"
	"log"

	"github.com/diablovocado/declutr/modules/integrations/domain"
)

// ConnectorRuntime orchestrates independent connector isolation, scheduling, and event publishing
type ConnectorRuntime struct {
	service *IntegrationService
}

// NewConnectorRuntime creates a new ConnectorRuntime instance
func NewConnectorRuntime(service *IntegrationService) *ConnectorRuntime {
	return &ConnectorRuntime{service: service}
}

// ProbeAllConnectors performs background health checks across all installed connectors
func (r *ConnectorRuntime) ProbeAllConnectors(ctx context.Context, vaultID string) (map[string]domain.HealthStatus, error) {
	log.Printf("[ConnectorRuntime] Probing health diagnostics for vault %s connectors", vaultID)
	connectors, err := r.service.ListConnectors(vaultID)
	if err != nil {
		return nil, err
	}

	results := make(map[string]domain.HealthStatus)
	for _, c := range connectors {
		res, err := r.service.CheckHealth(ctx, c.ConnectorID)
		if err != nil || res == nil {
			results[c.ConnectorID] = domain.HealthUnhealthy
		} else {
			results[c.ConnectorID] = res.Status
		}
	}
	return results, nil
}
