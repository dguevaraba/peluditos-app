import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { 
  Menu, 
  Image as ImageIcon, 
  User, 
  Settings,
  Home,
  Heart
} from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  visible, 
  onClose, 
  onNavigate 
}) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const translateX = useRef(new Animated.Value(-300)).current;


  const menuItems = [
    {
      id: 'home',
      title: 'Inicio',
      icon: Home,
      section: 'main'
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      icon: User,
      section: 'main'
    },
    {
      id: 'gallery',
      title: 'Galería de Fotos',
      icon: ImageIcon,
      section: 'gallery',
      description: 'Álbumes y fotos de mascotas'
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      icon: Heart,
      section: 'gallery',
      description: 'Fotos y álbumes favoritos'
    },
    {
      id: 'theme',
      title: 'Tema y Color',
      icon: Settings,
      section: 'main'
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: Settings,
      section: 'main'
    },
  ];



  const handleMenuPress = (itemId: string) => {
    onNavigate(itemId);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      translateX.setValue(-300);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'gallery':
        return 'GALERÍA';
      case 'main':
        return 'PRINCIPAL';
      default:
        return '';
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    menuContainer: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      width: '80%',
      maxWidth: 320,
    },
    menuTouchable: {
      flex: 1,
    },
    header: {
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: `${selectedColor}30`,
      alignItems: 'center',
    },
    appLogoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    appLogo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appLogoImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    appTitle: {
      fontSize: 28,
      fontWeight: '700',
    },
    userInfoContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: `${selectedColor}20`,
      backgroundColor: `${selectedColor}05`,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: `${selectedColor}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    userText: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: '600',
      color: currentTheme.colors.text,
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 14,
      color: currentTheme.colors.textSecondary,
    },

    content: {
      flex: 1,
      paddingTop: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: selectedColor,
      marginBottom: 10,
      paddingHorizontal: 20,
      letterSpacing: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: `${selectedColor}20`,
    },
    menuItemActive: {
      backgroundColor: `${selectedColor}10`,
      borderLeftWidth: 3,
      borderLeftColor: selectedColor,
    },
    menuIcon: {
      width: 24,
      height: 24,
      marginRight: 15,
    },
    menuText: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: currentTheme.colors.text,
      marginBottom: 2,
    },
    menuDescription: {
      fontSize: 12,
      color: currentTheme.colors.textSecondary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateX }] }
          ]}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.appLogoContainer}>
                <View style={[styles.appLogo, { backgroundColor: `${selectedColor}20` }]}>
                  <Image 
                    source={require('../assets/icon.png')} 
                    style={styles.appLogoImage} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.appTitle, { color: currentTheme.colors.text }]}>
                  Peluditos
                </Text>
              </View>
            </View>

            {/* Menu Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {Object.entries(groupedItems).map(([section, items]) => (
                <View key={section} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {getSectionTitle(section)}
                  </Text>
                  
                  {items.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleMenuPress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuIcon}>
                        <item.icon 
                          size={24} 
                          color={currentTheme.colors.text} 
                        />
                      </View>
                      <View style={styles.menuText}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        {item.description && (
                          <Text style={styles.menuDescription}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            
            {/* User Info at Bottom */}
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <User size={20} color={selectedColor} />
                </View>
                <View style={styles.userText}>
                  <Text style={styles.userName}>
                    {user?.user_metadata?.full_name || 'Usuario'}
                  </Text>
                  <Text style={styles.userEmail}>
                    {user?.email || 'usuario@email.com'}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default HamburgerMenu;
