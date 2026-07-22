'use client';

import React, { useState } from 'react';
import { IntegrationMarketplaceComponent } from '../../features/integrations/components/integration-marketplace';
import { InstalledConnectorsComponent } from '../../features/integrations/components/installed-connectors';
import { ConnectorLogsComponent } from '../../features/integrations/components/connector-logs';

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'INSTALLED' | 'LOGS'>('MARKETPLACE');

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Integration Platform & Connector Framework</h1>
        <p style={styles.subheading}>
          Modular, independently installable connector SDK framework supporting Google Drive, Dropbox, Notion, GitHub, AWS S3, and WebDAV integrations.
        </p>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Navigation Tabs */}
        <div style={styles.tabsRow}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'MARKETPLACE' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('MARKETPLACE')}
          >
            🧩 Connector Marketplace
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'INSTALLED' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('INSTALLED')}
          >
            🔌 Installed Connected Services
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'LOGS' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('LOGS')}
          >
            📜 Connector Logs
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'MARKETPLACE' && (
          <IntegrationMarketplaceComponent onInstallSuccess={() => setActiveTab('INSTALLED')} />
        )}
        {activeTab === 'INSTALLED' && <InstalledConnectorsComponent />}
        {activeTab === 'LOGS' && <ConnectorLogsComponent />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '40px' },
  header: { padding: '32px 24px 0', maxWidth: '1080px', margin: '0 auto' },
  heading: { fontSize: '30px', fontWeight: 800, color: '#e0e7ff', marginBottom: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subheading: { fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  container: { maxWidth: '1080px', margin: '24px auto 0', padding: '0 24px' },
  tabsRow: { display: 'flex', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' },
  tabBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '6px 12px', borderRadius: '8px' },
  tabActive: { background: '#6366f122', color: '#818cf8' },
};
