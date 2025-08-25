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
import { X, Camera, User } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { AvatarSkeleton } from './Skeleton';
import * as ImagePicker from 'expo-image-picker';

interface AvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAvatarSelected: (avatarUrl: string) => void;
  currentAvatar?: string | null;
}

// Set predefinido de avatares de mascotas
const predefinedAvatars = [
  {
    id: 'dog',
    name: 'Dog',
    url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 'cat',
    name: 'Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 'penguin',
    name: 'Penguin',
    url: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 'fox',
    name: 'Fox',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop&crop=face'
  },
];

export default function AvatarSelector({ 
  visible, 
  onClose, 
  onAvatarSelected, 
  currentAvatar 
}: AvatarSelectorProps) {
  const { currentTheme, selectedColor } = useTheme();
  const [uploading, setUploading] = useState(false);

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

  const handlePredefinedAvatar = (avatarUrl: string) => {
    onAvatarSelected(avatarUrl);
    onClose();
  };

  const styles = createStyles(currentTheme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            Select Avatar
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Avatar */}
          <View style={styles.currentAvatarSection}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Avatar Actual
            </Text>
            <View style={styles.currentAvatarContainer}>
              {currentAvatar ? (
                <Image source={{ uri: currentAvatar }} style={styles.currentAvatar} />
              ) : (
                <View style={[styles.currentAvatarPlaceholder, { backgroundColor: selectedColor }]}>
                  <User size={40} color="#ffffff" />
                </View>
              )}
            </View>
          </View>

          {/* Upload Option */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Subir Imagen
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: selectedColor }]}
              onPress={handleImageUpload}
              disabled={uploading}
            >
              {uploading ? (
                <AvatarSkeleton size={60} />
              ) : (
                <>
                  <Camera size={24} color="#ffffff" />
                  <Text style={styles.uploadButtonText}>Seleccionar de Galería</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

                    {/* Predefined Avatars */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Predefined Animals
              </Text>
              <Text style={[styles.sectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
                Choose your favorite animal
              </Text>
            </View>
            <View style={styles.avatarsGrid}>
              {predefinedAvatars.map((avatar, index) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    { backgroundColor: currentTheme.colors.cardSurface }
                  ]}
                  onPress={() => handlePredefinedAvatar(avatar.url)}
                >
                  <View style={styles.avatarImageContainer}>
                    <Image source={{ uri: avatar.url }} style={styles.avatarOptionImage} />
                    <View style={[styles.avatarOverlay, { backgroundColor: `${selectedColor}20` }]} />
                  </View>
                  <View style={styles.avatarInfo}>
                    <Text style={[styles.avatarName, { color: currentTheme.colors.text }]}>
                      {avatar.name}
                    </Text>
                    <View style={[styles.avatarBadge, { backgroundColor: selectedColor }]}>
                      <Text style={styles.avatarBadgeText}>Animals</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  currentAvatarContainer: {
    alignItems: 'center',
  },
  currentAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.border,
  },
  currentAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.border,
  },
  section: {
    marginBottom: 32,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatarOption: {
    width: (Dimensions.get('window').width - 60) / 2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarOptionImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  avatarInfo: {
    alignItems: 'center',
  },
  avatarBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  avatarBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
