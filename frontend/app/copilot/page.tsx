'use client';

import React from 'react';
import { AIWorkspace } from '../../features/copilot/components/ai-workspace';

export default function CopilotPage() {
  return (
    <div style={styles.page}>
      <AIWorkspace />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' },
};
