import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, themes, defaultTheme } from './theme';
import { defaultColor } from './colorConfig';

interface ThemeContextType {
  currentTheme: Theme;
  isDarkMode: boolean;
  selectedColor: string;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setSelectedColor: (color: string) => void;
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
  const [selectedColor, setSelectedColor] = useState(defaultColor); // Default green (matching the first color option)

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

  const setSelectedColorHandler = (color: string) => {
    setSelectedColor(color);
  };

  const value: ThemeContextType = {
    currentTheme,
    isDarkMode,
    selectedColor,
    toggleTheme,
    setTheme,
    setSelectedColor: setSelectedColorHandler,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
