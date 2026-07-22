'use client';

import React, { useState, useEffect } from 'react';
import type { NotificationPreferences } from '../types/notification';
import { NotificationService } from '../services/notification-service';

export function NotificationPreferencesView() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    NotificationService.getPreferences().then(setPrefs);
  }, []);

  const handleToggleChannel = (channel: 'inApp' | 'email' | 'push' | 'desktop') => {
    if (!prefs) return;
    const updated = { ...prefs };
    if (channel === 'inApp') updated.inAppEnabled = !prefs.inAppEnabled;
    if (channel === 'email') updated.emailEnabled = !prefs.emailEnabled;
    if (channel === 'push') updated.pushEnabled = !prefs.pushEnabled;
    if (channel === 'desktop') updated.desktopEnabled = !prefs.desktopEnabled;
    setPrefs(updated);
  };

  const handleSave = async () => {
    if (!prefs) return;
    await NotificationService.updatePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!prefs) return <div style={styles.loading}>Loading preferences...</div>;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>⚙️ Notification Channel & Frequency Settings</h3>

      {/* Channels */}
      <div style={styles.section}>
        <span style={styles.sectionLabel}>Delivery Channels</span>

        <label style={styles.row}>
          <input type="checkbox" checked={prefs.inAppEnabled} onChange={() => handleToggleChannel('inApp')} />
          <span>🔔 In-App Center (Required)</span>
        </label>

        <label style={styles.row}>
          <input type="checkbox" checked={prefs.emailEnabled} onChange={() => handleToggleChannel('email')} />
          <span>📧 Email Alerts (Placeholder / Webhook)</span>
        </label>

        <label style={styles.row}>
          <input type="checkbox" checked={prefs.pushEnabled} onChange={() => handleToggleChannel('push')} />
          <span>📱 Mobile Push Notifications</span>
        </label>

        <label style={styles.row}>
          <input type="checkbox" checked={prefs.desktopEnabled} onChange={() => handleToggleChannel('desktop')} />
          <span>💻 Desktop System Notifications</span>
        </label>
      </div>

      {/* Digest Frequency */}
      <div style={styles.section}>
        <span style={styles.sectionLabel}>Digest Summary Frequency</span>
        <select
          value={prefs.digestFrequency}
          onChange={(e) => setPrefs({ ...prefs, digestFrequency: e.target.value as any })}
          style={styles.select}
        >
          <option value="DAILY">Daily Summary Digest</option>
          <option value="WEEKLY">Weekly Vault Recap</option>
          <option value="OFF">Disabled</option>
        </select>
      </div>

      <div style={styles.footerRow}>
        <button style={styles.saveBtn} onClick={handleSave}>
          💾 Save Preferences
        </button>
        {saved && <span style={styles.savedBadge}>✓ Settings saved!</span>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  loading: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  title: { fontSize: '18px', fontWeight: 800, color: '#e2e8f0', margin: 0 },
  section: { display: 'flex', flexDirection: 'column', gap: '10px' },
  sectionLabel: { fontSize: '13px', fontWeight: 700, color: '#6366f1' },
  row: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' },
  select: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', outline: 'none', maxWidth: '300px' },
  footerRow: { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' },
  saveBtn: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  savedBadge: { color: '#4ade80', fontSize: '13px', fontWeight: 700 },
};
