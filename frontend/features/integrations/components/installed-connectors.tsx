'use client';

import React, { useState, useEffect } from 'react';
import type { Connector, HealthCheckResult } from '../types/integrations';
import { IntegrationService } from '../services/integration-service';

export function InstalledConnectorsComponent() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [healthMap, setHealthMap] = useState<Record<string, HealthCheckResult>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await IntegrationService.getIntegrations();
    setConnectors(data.installed);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async (connectorId: string) => {
    await IntegrationService.triggerSync(connectorId);
    alert('Sync job triggered successfully!');
  };

  const handleToggle = async (connectorId: string, current: boolean) => {
    await IntegrationService.toggleConnector(connectorId, !current);
    loadData();
  };

  const handleProbeHealth = async (connectorId: string) => {
    const res = await IntegrationService.getHealthStatus(connectorId);
    setHealthMap((prev) => ({ ...prev, [connectorId]: res }));
  };

  if (loading) return <div style={styles.loading}>Loading Installed Connectors...</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔌 Active Connected Services ({connectors.length})</h3>

      {connectors.length === 0 ? (
        <div style={styles.empty}>No connectors installed yet. Visit the Marketplace to connect services!</div>
      ) : (
        <div style={styles.list}>
          {connectors.map((c) => (
            <div key={c.connectorId} style={styles.card}>
              <div style={styles.cardInfo}>
                <div style={styles.titleRow}>
                  <span style={styles.name}>{c.name}</span>
                  <span style={c.status === 'CONNECTED' ? styles.statusConnected : styles.statusError}>
                    {c.status}
                  </span>
                  {!c.isEnabled && <span style={styles.disabledBadge}>DISABLED</span>}
                </div>
                <span style={styles.sub}>
                  Type: {c.typeKey} • Category: {c.category} • Installed: {new Date(c.installedAt).toLocaleDateString()}
                </span>
                {healthMap[c.connectorId] && (
                  <span style={styles.healthProbe}>
                    Probe: {healthMap[c.connectorId].status} ({healthMap[c.connectorId].latencyMs}ms latency)
                  </span>
                )}
              </div>

              <div style={styles.actionsRow}>
                <button style={styles.btnSync} onClick={() => handleSync(c.connectorId)} disabled={!c.isEnabled}>
                  ⚡ Sync Now
                </button>
                <button style={styles.btnHealth} onClick={() => handleProbeHealth(c.connectorId)}>
                  🏥 Probe Health
                </button>
                <button style={c.isEnabled ? styles.btnDisable : styles.btnEnable} onClick={() => handleToggle(c.connectorId, c.isEnabled)}>
                  {c.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', color: '#94a3b8' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  name: { fontSize: '15px', fontWeight: 800, color: '#e2e8f0' },
  statusConnected: { background: '#4ade8015', color: '#4ade80', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 900, border: '1px solid #4ade8033' },
  statusError: { background: '#ef444415', color: '#ef4444', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 900, border: '1px solid #ef444433' },
  disabledBadge: { background: '#64748b22', color: '#94a3b8', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 900 },
  sub: { fontSize: '12px', color: '#94a3b8' },
  healthProbe: { fontSize: '11px', color: '#38bdf8', marginTop: '2px' },
  actionsRow: { display: 'flex', gap: '10px' },
  btnSync: { background: 'linear-gradient(135deg, #6366f1, #38bdf8)', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' },
  btnHealth: { background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  btnDisable: { background: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  btnEnable: { background: '#4ade8022', border: '1px solid #4ade8055', color: '#4ade80', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
};
