import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Camera, User, Upload, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { AvatarSkeleton } from './Skeleton';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { UserService } from '../services/userService';
import CowIcon from './CowIcon';
import PenguinIcon from './PenguinIcon';
import FishIcon from './FishIcon';
import HamsterIcon from './HamsterIcon';

interface AvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAvatarSelected: (avatarUrl: string) => void;
  currentAvatar?: string | null;
}

export default function AvatarSelector({ 
  visible, 
  onClose, 
  onAvatarSelected, 
  currentAvatar 
}: AvatarSelectorProps) {
  const { currentTheme, selectedColor } = useTheme();
  const [uploading, setUploading] = useState(false);

  const getDynamicColor = () => selectedColor;

  // Custom avatars con iconos personalizados
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

  const renderCustomAvatar = (avatarUrl: string, containerSize: number = 40) => {
    const avatarId = avatarUrl.replace('custom-', '').replace('-icon', '');
    const avatar = customAvatars.find(a => a.id === avatarId);
    
    if (avatar) {
      const IconComponent = avatar.icon;
      // Calcular el tamaño del icono basado en el contenedor (80% del tamaño del contenedor)
      const iconSize = Math.floor(containerSize * 0.8);
      return <IconComponent size={iconSize} color="#ffffff" />;
    }
    
    return <User size={containerSize} color="#ffffff" />;
  };

  const handleCustomAvatar = (avatarId: string) => {
    // Usar un formato especial para identificar avatares personalizados
    const customAvatarUrl = `custom-${avatarId}-icon`;
    onAvatarSelected(customAvatarUrl);
    onClose();
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        if (asset.base64) {
          setUploading(true);
          try {
            // Por ahora usamos la URI local, pero podrías subir a Supabase aquí
            onAvatarSelected(asset.uri);
            onClose();
          } catch (error) {
            console.error('Error processing uploaded image:', error);
            Alert.alert('Error', 'Failed to process uploaded image');
          } finally {
            setUploading(false);
          }
        } else {
          Alert.alert('Error', 'Failed to get image data');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        if (asset.base64) {
          setUploading(true);
          try {
            onAvatarSelected(asset.uri);
            onClose();
          } catch (error) {
            console.error('Error processing photo:', error);
            Alert.alert('Error', 'Failed to process photo');
          } finally {
            setUploading(false);
          }
        } else {
          Alert.alert('Error', 'Failed to get photo data');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Select Profile Photo
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Current Avatar Preview */}
            <View style={styles.currentAvatarSection}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Current Photo
              </Text>
              <View style={styles.currentAvatarContainer}>
                {currentAvatar ? (
                                      currentAvatar.startsWith('custom-') ? (
                      <View style={[styles.currentAvatarPlaceholder, { backgroundColor: getDynamicColor() }]}>
                        {renderCustomAvatar(currentAvatar, 120)}
                      </View>
                    ) : (
                    <Image source={{ uri: currentAvatar }} style={styles.currentAvatar} />
                  )
                ) : (
                  <View style={[styles.currentAvatarPlaceholder, { backgroundColor: getDynamicColor() }]}>
                    <User size={40} color="#ffffff" />
                  </View>
                )}
              </View>
            </View>

                         {/* Custom Avatars */}
             <View style={styles.customAvatarsSection}>
               <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                 Custom Avatars
               </Text>
               <View style={styles.customAvatarsGrid}>
                 {customAvatars.map((avatar) => (
                   <TouchableOpacity
                     key={avatar.id}
                     style={styles.customAvatarCard}
                     onPress={() => handleCustomAvatar(avatar.id)}
                   >
                     <LinearGradient
                       colors={[`${avatar.color}15`, `${avatar.color}08`]}
                       style={styles.customAvatarGradient}
                     >
                       <View style={styles.customAvatarIcon}>
                         <avatar.icon size={60} />
                       </View>
                       <Text style={[styles.customAvatarName, { color: currentTheme.colors.text }]}>
                         {avatar.name}
                       </Text>
                     </LinearGradient>
                   </TouchableOpacity>
                 ))}
               </View>
             </View>

             {/* Upload Options */}
             <View style={styles.optionsSection}>
               <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                 Choose New Photo
               </Text>
              
              {/* Take Photo Option */}
              <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: `${getDynamicColor()}08` }]}
                onPress={handleTakePhoto}
                disabled={uploading}
              >
                <LinearGradient
                  colors={[`${getDynamicColor()}15`, `${getDynamicColor()}08`]}
                  style={styles.optionGradient}
                >
                  <View style={[styles.optionIcon, { backgroundColor: getDynamicColor() }]}>
                    <Camera size={24} color="#ffffff" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionTitle, { color: currentTheme.colors.text }]}>
                      Take Photo
                    </Text>
                    <Text style={[styles.optionDescription, { color: currentTheme.colors.textSecondary }]}>
                      Use your camera to take a new photo
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Choose from Gallery Option */}
              <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: `${getDynamicColor()}08` }]}
                onPress={handleImageUpload}
                disabled={uploading}
              >
                <LinearGradient
                  colors={[`${getDynamicColor()}15`, `${getDynamicColor()}08`]}
                  style={styles.optionGradient}
                >
                  <View style={[styles.optionIcon, { backgroundColor: getDynamicColor() }]}>
                    <ImageIcon size={24} color="#ffffff" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionTitle, { color: currentTheme.colors.text }]}>
                      Choose from Gallery
                    </Text>
                    <Text style={[styles.optionDescription, { color: currentTheme.colors.textSecondary }]}>
                      Select a photo from your gallery
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Upload from Device Option */}
              <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: `${getDynamicColor()}08` }]}
                onPress={handleImageUpload}
                disabled={uploading}
              >
                <LinearGradient
                  colors={[`${getDynamicColor()}15`, `${getDynamicColor()}08`]}
                  style={styles.optionGradient}
                >
                  <View style={[styles.optionIcon, { backgroundColor: getDynamicColor() }]}>
                    <Upload size={24} color="#ffffff" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionTitle, { color: currentTheme.colors.text }]}>
                      Upload from Device
                    </Text>
                    <Text style={[styles.optionDescription, { color: currentTheme.colors.textSecondary }]}>
                      Upload a photo from your device
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Loading State */}
            {uploading && (
              <View style={styles.loadingContainer}>
                <AvatarSkeleton size={60} />
                <Text style={[styles.loadingText, { color: currentTheme.colors.textSecondary }]}>
                  Processing image...
                </Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  currentAvatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  currentAvatarContainer: {
    alignItems: 'center',
  },
  currentAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  currentAvatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  customAvatarsSection: {
    marginBottom: 32,
  },
  customAvatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  customAvatarCard: {
    width: (Dimensions.get('window').width - 60) / 2,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customAvatarGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  customAvatarIcon: {
    marginBottom: 12,
  },
  customAvatarName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
});
