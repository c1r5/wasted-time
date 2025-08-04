import { useState, useEffect } from 'react';
import type { Theme, ThemeMode } from './types';
import { themes } from './themes';

const THEME_STORAGE_KEY = 'app-theme-mode';

export const useTheme = () => {
  const [themeMode, _setThemeMode] = useState<ThemeMode>('dark');

  const theme: Theme = themes.dark;

  const toggleTheme = () => {
    // Desabilitado - sempre dark
    console.log('Toggle theme disabled - always dark');
  };

  const handleSetThemeMode = (_mode: ThemeMode) => {
    // Desabilitado - sempre dark
    console.log('Set theme mode disabled - always dark');
  };

  useEffect(() => {
    // Remove do localStorage para sempre usar dark
    localStorage.removeItem(THEME_STORAGE_KEY);
  }, []);

  return {
    theme,
    themeMode,
    toggleTheme,
    setThemeMode: handleSetThemeMode,
  };
};