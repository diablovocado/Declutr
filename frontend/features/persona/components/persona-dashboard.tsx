'use client';

import React, { useEffect, useState } from 'react';
import type { PersonaProfile, PersonaScore } from '../types/persona';
import { PersonaService } from '../services/persona-service';

const VAULT_ID = 'vault-demo';

const personaTypeIcons: Record<string, string> = {
  Researcher: '🔬', Developer: '💻', Traveller: '✈️', Designer: '🎨',
  Photographer: '📸', Student: '🎓', Entrepreneur: '🚀', 'Content Creator': '📱',
  Writer: '✍️', 'Finance Professional': '💰', 'Healthcare Professional': '🏥',
  'Legal Professional': '⚖️', 'Project Manager': '📋', 'General User': '👤',
};

const trendColors: Record<string, string> = {
  RISING: '#4ade80', FALLING: '#f87171', STABLE: '#94a3b8',
};
const trendIcons: Record<string, string> = { RISING: '↑', FALLING: '↓', STABLE: '→' };

export function PersonaDashboard() {
  const [data, setData] = useState<{ profile: PersonaProfile | null; scores: PersonaScore[] }>({ profile: null, scores: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PersonaService.getPersona(VAULT_ID).then((res) => {
      setData({ profile: res.profile, scores: res.scores ?? [] });
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Analysing your digital life…</div>;

  const { profile, scores } = data;
  const icon = profile ? (personaTypeIcons[profile.personaType] ?? '👤') : '👤';

  return (
    <div style={styles.container}>
      {/* Persona Type Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroIcon}>{icon}</div>
        <div>
          <div style={styles.personaType}>{profile?.personaType ?? 'Building your persona…'}</div>
          <div style={styles.confidence}>
            {profile ? `${Math.round(profile.confidenceScore * 100)}% confidence · Updated ${formatRelative(profile.updatedAt)}` : 'Collecting signals…'}
          </div>
          <div style={styles.privacyBadge}>🔒 Private · Stays in your vault</div>
        </div>
      </div>

      {/* Dimension Score Cards */}
      <div style={styles.sectionTitle}>Learning Dimensions</div>
      <div style={styles.scoreGrid}>
        {scores.map((sc) => (
          <div key={sc.scoreId} style={styles.scoreCard}>
            <div style={styles.scoreDimension}>{sc.dimension}</div>
            <div style={styles.scoreBar}>
              <div style={{ ...styles.scoreBarFill, width: `${Math.min(sc.confidence * 100, 100)}%` }} />
            </div>
            <div style={styles.scoreFooter}>
              <span style={{ color: trendColors[sc.trend] }}>{trendIcons[sc.trend]} {sc.trend}</span>
              <span style={styles.scoreFreq}>{sc.frequency} interactions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Model */}
      {profile?.knowledgeModel && (
        <>
          <div style={styles.sectionTitle}>Your Knowledge Model</div>
          <div style={styles.kmGrid}>
            {Object.entries({
              '📍 Locations': profile.knowledgeModel.favouriteLocations,
              '🗂️ Projects': profile.knowledgeModel.recurringProjects,
              '🧠 Interests': profile.knowledgeModel.longTermInterests,
              '👤 Contacts': profile.knowledgeModel.recurringContacts,
            }).map(([label, items]) =>
              items.length > 0 ? (
                <div key={label} style={styles.kmCard}>
                  <div style={styles.kmLabel}>{label}</div>
                  <div style={styles.kmItems}>
                    {items.slice(0, 4).map((item) => (
                      <span key={item} style={styles.kmChip}>{item}</span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '16px' },
  heroCard: { background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '16px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(79,70,229,0.3)' },
  heroIcon: { fontSize: '56px', lineHeight: 1 },
  personaType: { fontSize: '28px', fontWeight: 700, color: '#e0e7ff', marginBottom: '6px' },
  confidence: { fontSize: '14px', color: '#a5b4fc', marginBottom: '8px' },
  privacyBadge: { display: 'inline-block', background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 500 },
  sectionTitle: { fontSize: '13px', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '16px', marginTop: '8px' },
  scoreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' },
  scoreCard: { background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #334155' },
  scoreDimension: { fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' },
  scoreBar: { background: '#334155', borderRadius: '4px', height: '6px', marginBottom: '10px', overflow: 'hidden' },
  scoreBarFill: { background: 'linear-gradient(90deg, #6366f1, #818cf8)', height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' },
  scoreFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' },
  scoreFreq: { color: '#64748b' },
  kmGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  kmCard: { background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #334155' },
  kmLabel: { fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px' },
  kmItems: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px' },
  kmChip: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', color: '#cbd5e1' },
};
