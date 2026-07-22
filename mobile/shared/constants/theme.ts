import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    tint: '#10b981',
    icon: '#475569',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#10b981',
  },
  dark: {
    text: '#f8fafc',
    background: '#090d16',
    card: '#141c2e',
    border: '#1e293b',
    tint: '#10b981',
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: '#10b981',
  },
};

export const DesignTokens = {
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  colors: {
    emerald: '#10b981',
    emeraldHover: '#059669',
    indigo: '#6366f1',
    purple: '#a855f7',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    rose: '#f43f5e',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
