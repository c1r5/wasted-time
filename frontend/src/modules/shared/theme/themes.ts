import type { Theme } from './types';

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#1e293b',
    secondary: '#334155',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#0f172a',
    secondary: '#1e293b',
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};