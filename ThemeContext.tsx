import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, themes, defaultTheme } from './theme';

interface ThemeContextType {
  currentTheme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Switch between light and dark themes
    if (isDarkMode) {
      setCurrentTheme(themes[0]); // default (light)
    } else {
      setCurrentTheme(themes[1]); // dark
    }
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsDarkMode(theme.name === 'dark');
  };

  const value: ThemeContextType = {
    currentTheme,
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
