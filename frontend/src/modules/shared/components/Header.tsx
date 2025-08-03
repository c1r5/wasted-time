import React from 'react';
import { useThemeContext } from '../theme';

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Wasted Time',
  actions
}) => {
  const { theme, toggleTheme, themeMode } = useThemeContext();

  return (
    <header
      className="shadow-sm border-b"
      style={{
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border,
      }}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          {title}
        </h1>

        <div className="flex items-center gap-4 invisible">
          {actions}

          <button
            key={`theme-toggle-${themeMode}`}
            onClick={() => {
              console.log('Button clicked. Current theme mode:', themeMode);
              console.log('Current theme colors:', theme.colors);
              toggleTheme();
            }}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: '1px solid var(--color-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#475569';
              e.currentTarget.style.borderColor = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            title={`Alternar para tema ${themeMode === 'light' ? 'escuro' : 'claro'}`}
          >
            {themeMode === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};