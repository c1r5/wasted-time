export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
  shadow: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}