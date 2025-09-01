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
import CowIcon from './CowIcon';
import PenguinIcon from './PenguinIcon';
import FishIcon from './FishIcon';
import HamsterIcon from './HamsterIcon';

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
  const translateX = useRef(new Animated.Value(-350)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  // Custom avatars para renderizar
  const customAvatars = [
    {
      id: 'penguin',
      name: 'Penguin',
      icon: PenguinIcon,
      color: '#4ECDC4'
    },
    {
      id: 'cow',
      name: 'Cow',
      icon: CowIcon,
      color: '#FF6B6B'
    },
    {
      id: 'fish',
      name: 'Fish',
      icon: FishIcon,
      color: '#45B7D1'
    },
    {
      id: 'hamster',
      name: 'Hamster',
      icon: HamsterIcon,
      color: '#96CEB4'
    },
  ];

  const renderCustomAvatar = (avatarUrl: string, containerSize: number = 20) => {
    const avatarId = avatarUrl.replace('custom-', '').replace('-icon', '');
    const avatar = customAvatars.find(a => a.id === avatarId);
    
    if (avatar) {
      const IconComponent = avatar.icon;
      // Calcular el tamaño del icono basado en el contenedor (80% del tamaño del contenedor)
      const iconSize = Math.floor(containerSize * 0.8);
      return <IconComponent size={iconSize} color={selectedColor} />;
    }
    
    return <User size={containerSize} color={selectedColor} />;
  };


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
    // Cerrar después de un pequeño delay para que se vea la animación
    setTimeout(() => {
      onClose();
    }, 100);
  };

  useEffect(() => {
    if (visible) {
      // Reset values
      translateX.setValue(-350);
      opacity.setValue(0);
      scale.setValue(0.95);
      
      // Animate in with spring effect
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Animate out with spring effect
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -350,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
        }),
      ]).start();
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    menuContainer: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      width: '85%',
      maxWidth: 340,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
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
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: `${selectedColor}10`,
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
    appVersion: {
      fontSize: 10,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      opacity: 0.7,
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
      <Animated.View 
        style={[
          styles.overlay,
          { opacity }
        ]}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={() => {
            // Animar la salida antes de cerrar
            Animated.parallel([
              Animated.spring(translateX, {
                toValue: -350,
                useNativeDriver: true,
                tension: 80,
                friction: 9,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.spring(scale, {
                toValue: 0.9,
                useNativeDriver: true,
                tension: 80,
                friction: 9,
              }),
            ]).start(() => {
              onClose();
            });
          }}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              { 
                transform: [
                  { translateX },
                  { scale }
                ] 
              }
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
              <TouchableOpacity 
                style={styles.userInfo}
                onPress={() => {
                  onNavigate('profile');
                  // Animar la salida antes de cerrar
                  Animated.parallel([
                    Animated.spring(translateX, {
                      toValue: -350,
                      useNativeDriver: true,
                      tension: 80,
                      friction: 9,
                    }),
                    Animated.timing(opacity, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                      toValue: 0.9,
                      useNativeDriver: true,
                      tension: 80,
                      friction: 9,
                    }),
                  ]).start(() => {
                    onClose();
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={styles.userAvatar}>
                  {user?.user_metadata?.avatar_url && user.user_metadata.avatar_url.startsWith('custom-') ? (
                    renderCustomAvatar(user.user_metadata.avatar_url, 48)
                  ) : (
                    <User size={24} color={selectedColor} />
                  )}
                </View>
                <View style={styles.userText}>
                  <Text style={styles.userName}>
                    {user?.user_metadata?.full_name || 'Usuario'}
                  </Text>
                  <Text style={styles.userEmail}>
                    {user?.email || 'usuario@email.com'}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.appVersion}>
                v1.0.0
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default HamburgerMenu;
