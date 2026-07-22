'use client';

import React, { useState, useEffect } from 'react';
import type { ConnectorMarketplaceItem, ConnectorType } from '../types/integrations';
import { IntegrationService } from '../services/integration-service';

export function IntegrationMarketplaceComponent({ onInstallSuccess }: { onInstallSuccess?: () => void }) {
  const [items, setItems] = useState<ConnectorMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    IntegrationService.getIntegrations().then((data) => {
      setItems(data.marketplace);
      setLoading(false);
    });
  }, []);

  const handleInstall = async (item: ConnectorMarketplaceItem) => {
    await IntegrationService.installConnector(item.typeKey, item.name, item.category);
    if (onInstallSuccess) onInstallSuccess();
  };

  if (loading) return <div style={styles.loading}>Loading Connector Marketplace...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item.typeKey} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>{item.icon}</span>
              <div>
                <h4 style={styles.name}>{item.name}</h4>
                <span style={styles.category}>{item.category}</span>
              </div>
            </div>

            <p style={styles.desc}>{item.description}</p>

            <div style={styles.authBadges}>
              {item.supportedAuth.map((auth) => (
                <span key={auth} style={styles.authBadge}>{auth}</span>
              ))}
            </div>

            <button style={styles.btnInstall} onClick={() => handleInstall(item)}>
              ✨ Install & Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', gap: '12px', alignItems: 'center' },
  icon: { fontSize: '28px' },
  name: { fontSize: '16px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  category: { fontSize: '10px', fontWeight: 900, color: '#38bdf8', background: '#38bdf815', padding: '2px 6px', borderRadius: '4px' },
  desc: { fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.4 },
  authBadges: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  authBadge: { fontSize: '10px', color: '#64748b', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' },
  btnInstall: { background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', textAlign: 'center' },
};
