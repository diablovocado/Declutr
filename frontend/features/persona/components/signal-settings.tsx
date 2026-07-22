'use client';

import React, { useEffect, useState } from 'react';
import type { PersonaSettings, SignalType } from '../types/persona';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

const ALL_SIGNAL_TYPES: { type: SignalType; label: string; description: string }[] = [
  { type: 'ASSET_OPEN', label: 'Asset Opens', description: 'Track when you open files' },
  { type: 'SEARCH', label: 'Search Activity', description: 'Learn from your search terms' },
  { type: 'PIN', label: 'Pins & Bookmarks', description: 'What you pin signals importance' },
  { type: 'UPLOAD', label: 'Upload Frequency', description: 'Infer interests from uploaded file types' },
  { type: 'EDIT', label: 'Note Editing', description: 'Frequently edited notes signal active topics' },
  { type: 'CONTEXT_SWITCH', label: 'Context Switching', description: 'Which contexts you switch between' },
  { type: 'RELATIONSHIP_EXPLORE', label: 'Relationship Exploration', description: 'Exploring graph connections signals curiosity' },
  { type: 'COLLECTION_USE', label: 'Collection Usage', description: 'Favourite collections infer organisation style' },
  { type: 'TIME_OF_DAY', label: 'Time-of-Day Patterns', description: 'When you are most active' },
  { type: 'FAVOURITE', label: 'Favourites', description: 'Starred items signal preference' },
];

export function SignalSettings() {
  const [settings, setSettings] = useState<PersonaSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    PersonaService.getSettings(VAULT_ID).then(setSettings);
  }, []);

  const toggle = (type: SignalType) => {
    if (!settings) return;
    const disabled = settings.disabledSignalTypes.includes(type)
      ? settings.disabledSignalTypes.filter((t) => t !== type)
      : [...settings.disabledSignalTypes, type];
    setSettings({ ...settings, disabledSignalTypes: disabled });
  };

  const save = async () => {
    if (!settings) return;
    await PersonaService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div style={styles.loading}>Loading settings…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.title}>⚙️ Signal Settings</div>
      <div style={styles.subtitle}>Control exactly which behaviour signals the engine can learn from. Disabling a signal type will silently drop all future signals of that type.</div>

      <div style={styles.list}>
        {ALL_SIGNAL_TYPES.map(({ type, label, description }) => {
          const isEnabled = !settings.disabledSignalTypes.includes(type);
          return (
            <div key={type} style={styles.row}>
              <div style={styles.rowInfo}>
                <div style={styles.rowLabel}>{label}</div>
                <div style={styles.rowDesc}>{description}</div>
              </div>
              <button
                style={{ ...styles.toggle, ...(isEnabled ? styles.toggleOn : styles.toggleOff) }}
                onClick={() => toggle(type)}
              >
                {isEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          );
        })}
      </div>

      <button style={styles.saveBtn} onClick={save}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '760px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  title: { fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 },
  list: { display: 'flex', flexDirection: 'column', gap: '2px', background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #334155' },
  rowInfo: {},
  rowLabel: { fontSize: '14px', fontWeight: 600, color: '#e2e8f0' },
  rowDesc: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  toggle: { border: 'none', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  toggleOn: { background: '#4ade8022', color: '#4ade80' },
  toggleOff: { background: '#f8717122', color: '#f87171' },
  saveBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' },
};
