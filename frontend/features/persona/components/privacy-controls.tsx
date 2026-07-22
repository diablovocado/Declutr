'use client';

import React, { useState } from 'react';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

type ActionState = 'idle' | 'confirming' | 'done';

export function PrivacyControls() {
  const [pauseState, setPauseState] = useState(false);
  const [resetState, setResetState] = useState<ActionState>('idle');
  const [deleteState, setDeleteState] = useState<ActionState>('idle');
  const [exporting, setExporting] = useState(false);

  const togglePause = async () => {
    const next = !pauseState;
    setPauseState(next);
    const s = await PersonaService.getSettings(VAULT_ID);
    await PersonaService.updateSettings({ ...s, vaultId: VAULT_ID, learningPaused: next });
  };

  const handleReset = async () => {
    if (resetState === 'idle') { setResetState('confirming'); return; }
    await PersonaService.resetPersona(VAULT_ID);
    setResetState('done');
  };

  const handleDelete = async () => {
    if (deleteState === 'idle') { setDeleteState('confirming'); return; }
    await PersonaService.deletePersona(VAULT_ID);
    setDeleteState('done');
  };

  const handleExport = async () => {
    setExporting(true);
    const data = await PersonaService.exportPersona(VAULT_ID);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'declutr_persona_export.json';
      a.click(); URL.revokeObjectURL(url);
    }
    setExporting(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🔒 Privacy Controls</div>
      <div style={styles.subtitle}>
        All persona data lives exclusively in your vault. Nothing is shared. Nothing is sold. You are always in control.
      </div>

      <div style={styles.grid}>
        {/* Pause Learning */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>{pauseState ? '⏸' : '▶'}</div>
          <div style={styles.cardTitle}>{pauseState ? 'Learning Paused' : 'Learning Active'}</div>
          <div style={styles.cardDesc}>Pause signal collection at any time. Your existing persona data is preserved.</div>
          <button style={{ ...styles.actionBtn, ...(pauseState ? styles.btnWarning : styles.btnPrimary) }} onClick={togglePause}>
            {pauseState ? 'Resume Learning' : 'Pause Learning'}
          </button>
        </div>

        {/* Reset Persona */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>🔄</div>
          <div style={styles.cardTitle}>Reset Persona</div>
          <div style={styles.cardDesc}>Clear all signals and scores. Your persona will rebuild from scratch as you continue using the vault.</div>
          {resetState === 'done' ? (
            <div style={styles.doneText}>✓ Persona reset successfully</div>
          ) : (
            <button style={{ ...styles.actionBtn, ...(resetState === 'confirming' ? styles.btnDanger : styles.btnSecondary) }} onClick={handleReset}>
              {resetState === 'confirming' ? '⚠ Confirm Reset' : 'Reset Persona'}
            </button>
          )}
        </div>

        {/* Export Persona */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>📤</div>
          <div style={styles.cardTitle}>Export Persona Data</div>
          <div style={styles.cardDesc}>Download all your learned persona data as a JSON file. Complete transparency.</div>
          <button style={{ ...styles.actionBtn, ...styles.btnPrimary }} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Export as JSON'}
          </button>
        </div>

        {/* Delete Persona */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>🗑</div>
          <div style={styles.cardTitle}>Delete All Persona Data</div>
          <div style={styles.cardDesc}>Permanently remove all profile data, signals, scores, interests, and recommendations. This cannot be undone.</div>
          {deleteState === 'done' ? (
            <div style={styles.doneText}>✓ All persona data deleted</div>
          ) : (
            <button style={{ ...styles.actionBtn, ...(deleteState === 'confirming' ? styles.btnDanger : styles.btnDangerOutline) }} onClick={handleDelete}>
              {deleteState === 'confirming' ? '⚠ Confirm Delete' : 'Delete All Data'}
            </button>
          )}
        </div>
      </div>

      <div style={styles.notice}>
        🛡️ <b>Privacy Guarantee</b>: Declutr never sends your persona data to any third party. No analytics. No advertising. Your data stays in your vault.
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '860px', margin: '0 auto' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' },
  card: { background: '#1e293b', borderRadius: '14px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardIcon: { fontSize: '28px' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#e2e8f0' },
  cardDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6, flex: 1 },
  actionBtn: { border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px', transition: 'opacity 0.2s' },
  btnPrimary: { background: '#6366f1', color: '#fff' },
  btnSecondary: { background: '#1e3a5f', color: '#60a5fa', border: '1px solid #2563eb44' },
  btnWarning: { background: '#f59e0b22', color: '#fbbf24', border: '1px solid #f59e0b44' },
  btnDanger: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' },
  btnDangerOutline: { background: 'transparent', color: '#f87171', border: '1px solid #f8717144' },
  doneText: { fontSize: '13px', color: '#4ade80', fontWeight: 600 },
  notice: { background: '#0f172a', borderRadius: '12px', padding: '16px 20px', fontSize: '13px', color: '#64748b', lineHeight: 1.7, border: '1px solid #1e293b' },
};
