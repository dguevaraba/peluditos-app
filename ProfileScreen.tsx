import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Edit, CreditCard, Bell, Settings, User, PawPrint } from 'lucide-react-native';
import { Theme, themes, defaultTheme } from './theme';
import { useTheme } from './ThemeContext';
import { colorOptions } from './colorConfig';

const userPets = [
  {
    id: 1,
    name: 'Rocky',
    age: '5 years old',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Luna',
    age: '3 years old',
    breed: 'Tabby',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop'
  }
];



function ProfileScreen() {
  const { currentTheme, isDarkMode, toggleTheme, selectedColor, setSelectedColor } = useTheme();
  const [notifications, setNotifications] = useState({
    vaccineReminders: true,
    communityUpdates: true,
    promotions: true
  });

  const styles = createStyles(currentTheme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f0f8f6', '#e6f0ec']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }} 
                style={styles.profileImage} 
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Sarah Williams</Text>
                <Text style={styles.userEmail}>sarah@example.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* My Pets Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <View style={styles.petsContainer}>
              {userPets.map((pet) => (
                <TouchableOpacity key={pet.id} style={styles.petCard}>
                  <Image source={{ uri: pet.image }} style={styles.petImage} />
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petAge}>{pet.age}</Text>
                    <Text style={styles.petBreed}>{pet.breed}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Customization Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customization</Text>
            <View style={styles.customizationContainer}>
                            {/* Theme */}
              <View style={styles.themeSection}>
                <View style={styles.themeCard}>
                  <View style={styles.themeToggle}>
                    <Text style={styles.themeLabel}>Theme</Text>
                    <Switch
                      value={isDarkMode}
                      onValueChange={toggleTheme}
                      trackColor={{ false: '#e0e0e0', true: '#65b6ad' }}
                      thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
                    />
                  </View>
                  <View style={styles.selectedTheme}>
                    <Text style={styles.selectedThemeText}>
                      {isDarkMode ? 'Dark Theme' : 'Light Theme'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Color */}
              <View style={styles.colorSection}>
                <Text style={styles.customizationTitle}>Color</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.colorCarousel}
                >
                  {colorOptions.map((colorOption) => (
                    <TouchableOpacity
                      key={colorOption.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: colorOption.color },
                        selectedColor === colorOption.color && styles.selectedColorSwatch
                      ]}
                      onPress={() => setSelectedColor(colorOption.color)}
                    >
                      {selectedColor === colorOption.color && (
                        <FontAwesome5 name="check" size={10} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.preferencesList}>
              <View style={styles.preferenceItem}>
                <View style={styles.checkbox}>
                  <FontAwesome5 name="check" size={12} color="#ffffff" />
                </View>
                <Text style={styles.preferenceText}>Vaccine reminders</Text>
              </View>
              <View style={styles.preferenceItem}>
                <View style={styles.checkbox}>
                  <FontAwesome5 name="check" size={12} color="#ffffff" />
                </View>
                <Text style={styles.preferenceText}>Community updates</Text>
              </View>
              <View style={styles.preferenceItem}>
                <View style={styles.checkbox}>
                  <FontAwesome5 name="check" size={12} color="#ffffff" />
                </View>
                <Text style={styles.preferenceText}>Promotions & offers</Text>
              </View>
            </View>
          </View>

          {/* Account & Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <CreditCard size={20} color={selectedColor} />
              </View>
              <Text style={styles.settingText}>Manage Payment Methods</Text>
              <FontAwesome5 name="chevron-right" size={16} color={selectedColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Bell size={20} color={selectedColor} />
              </View>
              <Text style={styles.settingText}>Notification Settings</Text>
              <FontAwesome5 name="chevron-right" size={16} color={selectedColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Settings size={20} color={selectedColor} />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
              <FontAwesome5 name="chevron-right" size={16} color={selectedColor} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  editButton: {
    backgroundColor: '#65b6ad',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  petsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  petCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  petImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  petInfo: {
    gap: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  petAge: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  petBreed: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  customizationContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  themeSection: {
    flex: 1,
  },
  themeCard: {
    backgroundColor: '#e8f4f0',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedTheme: {
    alignItems: 'center',
  },
  selectedThemeText: {
    fontSize: 14,
    color: '#65b6ad',
    fontWeight: '600',
  },
  colorSection: {
    flex: 1,
    backgroundColor: '#e8f4f0',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  customizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#65b6ad',
  },
  currentValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3a4c4c',
  },
  themeIndicator: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  colorCarousel: {
    paddingHorizontal: 4,
    gap: 12,
    marginTop: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorSwatch: {
    borderColor: '#65b6ad',
  },
  preferencesList: {
    gap: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#65b6ad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(101, 182, 173, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
});

export default ProfileScreen;
