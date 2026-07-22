'use client';

import React, { useState, useEffect } from 'react';
import type { ConnectorLog } from '../types/integrations';
import { IntegrationService } from '../services/integration-service';

export function ConnectorLogsComponent() {
  const [logs, setLogs] = useState<ConnectorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    IntegrationService.getLogs('conn-gdrive-001').then((list) => {
      setLogs(list);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading Connector Logs...</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📜 Connector Execution & Audit Logs</h3>
      <div style={styles.logBox}>
        {logs.map((log) => (
          <div key={log.logId} style={styles.logRow}>
            <span style={styles.levelInfo}>{log.level}</span>
            <span style={styles.time}>{new Date(log.createdAt).toLocaleTimeString()}</span>
            <span style={styles.msg}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  logBox: { background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' },
  logRow: { display: 'flex', gap: '12px', fontSize: '12px', color: '#cbd5e1', alignItems: 'center' },
  levelInfo: { background: '#6366f122', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 },
  time: { color: '#64748b' },
  msg: { flex: 1, color: '#e2e8f0' },
};
