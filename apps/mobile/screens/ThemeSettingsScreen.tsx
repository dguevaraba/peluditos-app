import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft, Moon, Sun, Check } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { colorOptions, ColorOption } from '../colorConfig';


interface ThemeSettingsScreenProps {
  navigation: any;
}

export default function ThemeSettingsScreen({ navigation }: ThemeSettingsScreenProps) {
  const { currentTheme, selectedColor, isDarkMode, toggleTheme, setSelectedColor } = useTheme();
  const [saving, setSaving] = useState(false);

  // Debug: Log current theme state
  console.log('ThemeSettingsScreen - Current theme:', {
    isDarkMode,
    themeName: currentTheme.name,
    backgroundColor: currentTheme.colors.background,
    cardBackground: currentTheme.colors.cardBackground,
    selectedColor
  });

  // Remove this line since we're not using createStyles anymore

  const handleThemeToggle = async () => {
    setSaving(true);
    try {
      toggleTheme();
      // The theme is automatically saved in the ThemeContext
    } catch (error) {
      Alert.alert('Error', 'Could not change theme');
    } finally {
      setSaving(false);
    }
  };

  const handleColorSelect = async (color: string) => {
    setSaving(true);
    try {
      setSelectedColor(color);
      // The color is automatically saved in the ThemeContext
    } catch (error) {
      Alert.alert('Error', 'Could not change color');
    } finally {
      setSaving(false);
    }
  };

  const renderColorOption = (colorOption: ColorOption) => {
    const isSelected = selectedColor === colorOption.color;
    
    return (
      <TouchableOpacity
        key={colorOption.id}
        style={[
          styles.colorOption,
          { backgroundColor: colorOption.color },
          isSelected && {
            borderWidth: 3,
            borderColor: currentTheme.colors.cardBackground,
            shadowColor: currentTheme.colors.text,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        ]}
        onPress={() => handleColorSelect(colorOption.color)}
        disabled={saving}
      >
        {isSelected && (
          <View style={[styles.colorOptionCheck, { backgroundColor: currentTheme.colors.cardBackground }]}>
            <Check size={16} color={selectedColor} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Theme Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Mode Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Theme Mode
          </Text>
          <Text style={[styles.sectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
            Choose between light and dark theme
          </Text>
          
          <View style={styles.themeOptions}>
            <TouchableOpacity
                             style={[
                 styles.themeOption,
                 { backgroundColor: currentTheme.colors.cardBackground },
                 !isDarkMode && { borderColor: selectedColor }
               ]}
              onPress={() => !isDarkMode || handleThemeToggle()}
              disabled={saving}
            >
              <Sun size={24} color={!isDarkMode ? selectedColor : currentTheme.colors.textSecondary} />
              <Text style={[
                styles.themeOptionText,
                { color: !isDarkMode ? selectedColor : currentTheme.colors.textSecondary }
              ]}>
                Light
              </Text>
              {!isDarkMode && (
                <View style={[styles.themeOptionCheck, { backgroundColor: selectedColor }]}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
                             style={[
                 styles.themeOption,
                 { backgroundColor: currentTheme.colors.cardBackground },
                 isDarkMode && { borderColor: selectedColor }
               ]}
              onPress={() => isDarkMode || handleThemeToggle()}
              disabled={saving}
            >
              <Moon size={24} color={isDarkMode ? selectedColor : currentTheme.colors.textSecondary} />
              <Text style={[
                styles.themeOptionText,
                { color: isDarkMode ? selectedColor : currentTheme.colors.textSecondary }
              ]}>
                Dark
              </Text>
              {isDarkMode && (
                <View style={[styles.themeOptionCheck, { backgroundColor: selectedColor }]}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Selection Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Primary Color
          </Text>
          <Text style={[styles.sectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
            Customize the main color of the application
          </Text>
          
          <View style={styles.colorGrid}>
            {colorOptions.map(renderColorOption)}
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Preview
          </Text>
          <Text style={[styles.sectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
            How your configuration will look
          </Text>
          
          <View style={[styles.previewCard, { backgroundColor: currentTheme.colors.cardBackground, borderColor: currentTheme.colors.border }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewAvatar, { backgroundColor: selectedColor }]}>
                <Text style={styles.previewAvatarText}>U</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={[styles.previewName, { color: currentTheme.colors.text }]}>
                  Example User
                </Text>
                <Text style={[styles.previewEmail, { color: currentTheme.colors.textSecondary }]}>
                  user@example.com
                </Text>
              </View>
            </View>
            
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={[styles.previewButton, { backgroundColor: `${selectedColor}15` }]}
                disabled
              >
                <Text style={[styles.previewButtonText, { color: selectedColor }]}>
                  Secondary Button
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.previewButton, { backgroundColor: selectedColor }]}
                disabled
              >
                <Text style={[styles.previewButtonText, { color: '#FFFFFF' }]}>
                  Primary Button
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  themeOptionSelected: {
    // borderColor will be set dynamically
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  themeOptionCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  colorOptionSelected: {
    borderWidth: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorOptionCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewEmail: {
    fontSize: 14,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
