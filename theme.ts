export interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    background: string;
    appBackground: string;
    cardBackground: string;
    cardSurface: string; // New color for white cards
    clinicalHistoryBg: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'default',
    colors: {
      primary: '#3a4c4c',
      primaryLight: '#e8f4f0',
      secondary: '#e8f4f0',
      background: '#ffffff',
      appBackground: '#f8fbfa', // Very light green background
      cardBackground: '#c8e0d8', // Slightly darker than #ddeee6
      cardSurface: '#f8f9fa', // Light gray for cards
      clinicalHistoryBg: '#e8f4f0', // Lighter green for clinical history
      text: '#3a4c4c',
      textSecondary: '#666666',
      border: '#c8e0d8',
      accent: '#2c5530',
      success: '#4CAF50',
    }
  },
  {
    name: 'dark',
    colors: {
      primary: '#2c3e50',
      primaryLight: '#34495e',
      secondary: '#34495e',
      background: '#121212', // Darker background
      appBackground: '#0a0a0a', // Very dark app background
      cardBackground: '#1e1e1e', // Dark card background
      cardSurface: '#2a2a2a', // Dark gray for cards
      clinicalHistoryBg: '#2a2a2a', // Dark clinical history background
      text: '#ffffff',
      textSecondary: '#bdc3c7',
      border: '#404040',
      accent: '#3498db',
      success: '#27ae60',
    }
  },
  {
    name: 'warm',
    colors: {
      primary: '#8B4513',
      primaryLight: '#DEB887',
      secondary: '#DEB887',
      background: '#FFF8DC',
      appBackground: '#fefaf0', // Very light warm background
      cardBackground: '#F5DEB3',
      cardSurface: '#fef8e7', // Light warm gray for cards
      clinicalHistoryBg: '#DEB887', // Lighter warm for clinical history
      text: '#8B4513',
      textSecondary: '#A0522D',
      border: '#F5DEB3',
      accent: '#D2691E',
      success: '#228B22',
    }
  },
  {
    name: 'ocean',
    colors: {
      primary: '#1e3a8a',
      primaryLight: '#dbeafe',
      secondary: '#dbeafe',
      background: '#f0f9ff',
      appBackground: '#f8fbff', // Very light ocean background
      cardBackground: '#bfdbfe',
      cardSurface: '#f1f5f9', // Light ocean gray for cards
      clinicalHistoryBg: '#dbeafe', // Lighter ocean for clinical history
      text: '#1e3a8a',
      textSecondary: '#475569',
      border: '#bfdbfe',
      accent: '#3b82f6',
      success: '#059669',
    }
  }
];

export const defaultTheme = themes[0];
