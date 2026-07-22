'use client';

import React, { useState, useEffect } from 'react';
import type { VersionDiff } from '../types/versioning';
import { VersioningService } from '../services/versioning-service';

interface DiffViewerProps {
  sourceVersionId?: string;
  targetVersionId?: string;
}

export function DiffViewer({ sourceVersionId = 'ver-japan-v1', targetVersionId = 'ver-japan-v2' }: DiffViewerProps) {
  const [diff, setDiff] = useState<VersionDiff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    VersioningService.compareVersions(sourceVersionId, targetVersionId).then((res) => {
      setDiff(res);
      setLoading(false);
    });
  }, [sourceVersionId, targetVersionId]);

  if (loading) return <div style={styles.loading}>Computing version comparison diff...</div>;
  if (!diff) return <div style={styles.empty}>No diff generated.</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔍 Version Diff Comparison</h3>
      <div style={styles.subtitle}>
        Comparing <strong>{diff.sourceVersionId}</strong> → <strong>{diff.targetVersionId}</strong>
      </div>

      {/* Added Fields */}
      {Object.keys(diff.addedFields).length > 0 && (
        <div style={styles.box}>
          <h4 style={{ ...styles.boxTitle, color: '#4ade80' }}>➕ Added Attributes ({Object.keys(diff.addedFields).length})</h4>
          <pre style={styles.code}>{JSON.stringify(diff.addedFields, null, 2)}</pre>
        </div>
      )}

      {/* Modified Fields */}
      {Object.keys(diff.modifiedFields).length > 0 && (
        <div style={styles.box}>
          <h4 style={{ ...styles.boxTitle, color: '#f59e0b' }}>✏️ Modified Attributes ({Object.keys(diff.modifiedFields).length})</h4>
          <pre style={styles.code}>{JSON.stringify(diff.modifiedFields, null, 2)}</pre>
        </div>
      )}

      {/* Removed Fields */}
      {Object.keys(diff.removedFields).length > 0 && (
        <div style={styles.box}>
          <h4 style={{ ...styles.boxTitle, color: '#ef4444' }}>➖ Removed Attributes ({Object.keys(diff.removedFields).length})</h4>
          <pre style={styles.code}>{JSON.stringify(diff.removedFields, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  subtitle: { fontSize: '13px', color: '#94a3b8' },
  box: { background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  boxTitle: { fontSize: '14px', fontWeight: 700, margin: 0 },
  code: { background: '#0f172a', borderRadius: '8px', padding: '12px', color: '#cbd5e1', fontSize: '12px', margin: 0, overflowX: 'auto' as const },
};
