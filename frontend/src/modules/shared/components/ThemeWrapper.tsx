import React, { useEffect } from 'react';
import { useThemeContext } from '../theme';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { theme } = useThemeContext();

  useEffect(() => {
    console.log('ThemeWrapper: Aplicando tema:', theme);
    
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-shadow', theme.colors.shadow);
  }, [theme]);

  console.log('ThemeWrapper: Renderizando com tema:', theme.name);
  
  return <div data-theme={theme.name}>{children}</div>;
};