import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Theme, themes, defaultTheme } from './theme';
import { defaultColor } from './colorConfig';
import { UserService } from './services/userService';

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
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preferences on app start
  useEffect(() => {
    loadSavedPreferences();
  }, []);

  const loadSavedPreferences = async () => {
    try {
      const result = await UserService.loadThemePreferences();
      if (result.success) {
        // Set theme preference
        if (result.themePreference === 'dark') {
          setIsDarkMode(true);
          setCurrentTheme(themes[1]); // dark theme
        } else {
          setIsDarkMode(false);
          setCurrentTheme(themes[0]); // light theme
        }
        
        // Set color preference
        if (result.colorPreference) {
          setSelectedColor(result.colorPreference);
        }
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (themePreference: 'light' | 'dark', colorPreference: string) => {
    try {
      await UserService.saveThemePreferences(themePreference, colorPreference);
    } catch (error) {
      console.error('Error saving theme preferences:', error);
    }
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    // Switch between light and dark themes
    if (newIsDarkMode) {
      setCurrentTheme(themes[1]); // dark
    } else {
      setCurrentTheme(themes[0]); // light
    }

    // Save preference
    savePreferences(newIsDarkMode ? 'dark' : 'light', selectedColor);
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    const newIsDarkMode = theme.name === 'dark';
    setIsDarkMode(newIsDarkMode);
    
    // Save preference
    savePreferences(newIsDarkMode ? 'dark' : 'light', selectedColor);
  };

  const setSelectedColorHandler = (color: string) => {
    setSelectedColor(color);
    
    // Save preference
    savePreferences(isDarkMode ? 'dark' : 'light', color);
  };

  const value: ThemeContextType = {
    currentTheme,
    isDarkMode,
    selectedColor,
    toggleTheme,
    setTheme,
    setSelectedColor: setSelectedColorHandler,
  };

  // Show loading state while preferences are being loaded
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
