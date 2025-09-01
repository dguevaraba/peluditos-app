import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { PhotoService, CreatePhotoData } from '../services/photoService';
import { AlbumService } from '../services/albumService';
import Toast from '../components/Toast';
import { 
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Upload,
  FolderOpen,
  X,
  Plus,
  Calendar,
  MapPin,
  Tag,
  Save
} from 'lucide-react-native';

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  location?: string;
  date: string;
  is_featured: boolean;
  is_public: boolean;
  user_id: string;
  organization_id?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

interface AddPhotoScreenProps {
  visible: boolean;
  onClose: () => void;
  onPhotoAdded: () => void;
}

const AddPhotoScreen: React.FC<AddPhotoScreenProps> = ({
  visible,
  onClose,
  onPhotoAdded,
}) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  // Load albums from database
  useEffect(() => {
    if (visible) {
      loadAlbums();
    }
  }, [visible]);

  const loadAlbums = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      const userAlbums = await AlbumService.getUserAlbums(user.id);
      setAlbums(userAlbums);
    } catch (error) {
      console.error('Error loading albums:', error);
      // Fallback to sample albums if database fails
      setAlbums([
        { 
          id: '1', 
          title: 'London Walk', 
          description: 'Photos from our walk in London',
          date: new Date().toISOString(),
          is_featured: false,
          is_public: false,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          title: 'Vet Visit', 
          description: 'Annual checkup',
          date: new Date().toISOString(),
          is_featured: false,
          is_public: false,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '3', 
          title: 'Park Day', 
          description: 'Fun day at the park',
          date: new Date().toISOString(),
          is_featured: false,
          is_public: false,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '4', 
          title: 'Rocky\'s Birthday', 
          description: 'Birthday celebration',
          date: new Date().toISOString(),
          is_featured: false,
          is_public: false,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ]);
    }
  };

  const getDynamicColor = () => selectedColor;

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select photos.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return false;
    }
    return true;
  };

  const handleCameraPress = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleGalleryPress = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedImage) {
      setToast({ visible: true, message: 'Please select an image first', type: 'error' });
      return;
    }

    if (!photoTitle.trim()) {
      setToast({ visible: true, message: 'Please enter a title for the photo', type: 'error' });
      return;
    }

    setUploading(true);
    
    try {
      const photoData: CreatePhotoData = {
        title: photoTitle.trim(),
        description: photoDescription.trim() || undefined,
        album_id: selectedAlbum?.id,
        is_featured: false,
      };

      await PhotoService.uploadPhoto(selectedImage, photoData);

      setToast({ visible: true, message: 'Photo uploaded successfully!', type: 'success' });
      
      // Close after a short delay to show the success toast
      setTimeout(() => {
        onPhotoAdded();
        if (onClose) {
          handleClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setToast({ 
        visible: true, 
        message: error instanceof Error ? error.message : 'Failed to upload photo', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setPhotoTitle('');
    setPhotoDescription('');
    setSelectedAlbum(null);
    setShowAlbumSelector(false);
    setToast({ visible: false, message: '', type: 'info' });
    if (onClose) {
      onClose();
    }
  };

  const renderAlbumSelector = () => (
    <Modal
      visible={showAlbumSelector}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAlbumSelector(false)}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAlbumSelector(false)}>
              <ArrowLeft size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Select Album
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Albums List */}
          <ScrollView style={styles.albumsList}>
            {albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={[
                  styles.albumItem,
                  selectedAlbum?.id === album.id && { backgroundColor: `${getDynamicColor()}15` }
                ]}
                onPress={() => {
                  setSelectedAlbum(album);
                  setShowAlbumSelector(false);
                }}
              >
                <View style={styles.albumItemContent}>
                  <View style={[styles.albumIcon, { backgroundColor: getDynamicColor() }]}>
                    <FolderOpen size={20} color="#ffffff" />
                  </View>
                  <View style={styles.albumItemInfo}>
                    <Text style={[styles.albumItemTitle, { color: currentTheme.colors.text }]}>
                      {album.title}
                    </Text>
                    <Text style={[styles.albumItemCount, { color: currentTheme.colors.textSecondary }]}>
                      {album.description || 'No description'}
                    </Text>
                  </View>
                  {selectedAlbum?.id === album.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: getDynamicColor() }]}>
                      <Save size={16} color="#ffffff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Create New Album Option */}
            <TouchableOpacity
              style={[styles.createAlbumItem, { backgroundColor: `${getDynamicColor()}10` }]}
              onPress={() => {
                setShowAlbumSelector(false);
                // TODO: Navigate to create album screen
                Alert.alert('Create Album', 'This will open the create album screen');
              }}
            >
              <View style={styles.albumItemContent}>
                <View style={[styles.albumIcon, { backgroundColor: getDynamicColor() }]}>
                  <Plus size={20} color="#ffffff" />
                </View>
                <View style={styles.albumItemInfo}>
                  <Text style={[styles.albumItemTitle, { color: currentTheme.colors.text }]}>
                    Create New Album
                  </Text>
                  <Text style={[styles.albumItemCount, { color: currentTheme.colors.textSecondary }]}>
                    Start a new collection
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Add Photo
            </Text>
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: getDynamicColor() }]}
              onPress={handleSavePhoto}
              disabled={uploading || !selectedImage || !selectedAlbum}
            >
              <Text style={styles.saveButtonText}>
                {uploading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image Selection */}
              {!selectedImage ? (
                <View style={styles.imageSelectionContainer}>
                  <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                    Choose Photo
                  </Text>
                  <View style={styles.imageSelectionButtons}>
                    <TouchableOpacity
                      style={[styles.selectionButton, { backgroundColor: `${getDynamicColor()}15` }]}
                      onPress={handleCameraPress}
                    >
                      <LinearGradient
                        colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                        style={styles.selectionButtonGradient}
                      >
                        <View style={[styles.selectionIcon, { backgroundColor: getDynamicColor() }]}>
                          <Camera size={24} color="#ffffff" />
                        </View>
                        <Text style={[styles.selectionButtonText, { color: currentTheme.colors.text }]}>
                          Camera
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.selectionButton, { backgroundColor: `${getDynamicColor()}15` }]}
                      onPress={handleGalleryPress}
                    >
                      <LinearGradient
                        colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                        style={styles.selectionButtonGradient}
                      >
                        <View style={[styles.selectionIcon, { backgroundColor: getDynamicColor() }]}>
                          <ImageIcon size={24} color="#ffffff" />
                        </View>
                        <Text style={[styles.selectionButtonText, { color: currentTheme.colors.text }]}>
                          Gallery
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.selectedImageContainer}>
                  <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                    Selected Photo
                  </Text>
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.changeImageButton}
                      onPress={() => setSelectedImage(null)}
                    >
                      <Text style={[styles.changeImageText, { color: getDynamicColor() }]}>
                        Change Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Photo Details */}
              {selectedImage && (
                <View style={styles.photoDetailsContainer}>
                  <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                    Photo Details
                  </Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                      Title (optional)
                    </Text>
                    <TextInput
                      style={[styles.textInput, { 
                        backgroundColor: currentTheme.colors.cardBackground,
                        color: currentTheme.colors.text,
                        borderColor: currentTheme.colors.border
                      }]}
                      value={photoTitle}
                      onChangeText={setPhotoTitle}
                      placeholder="Give your photo a title"
                      placeholderTextColor={currentTheme.colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                      Description (optional)
                    </Text>
                    <TextInput
                      style={[styles.textArea, { 
                        backgroundColor: currentTheme.colors.cardBackground,
                        color: currentTheme.colors.text,
                        borderColor: currentTheme.colors.border
                      }]}
                      value={photoDescription}
                      onChangeText={setPhotoDescription}
                      placeholder="Describe this moment..."
                      placeholderTextColor={currentTheme.colors.textSecondary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Album Selection */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                      Album *
                    </Text>
                    <TouchableOpacity
                      style={[styles.albumSelector, { 
                        backgroundColor: currentTheme.colors.cardBackground,
                        borderColor: currentTheme.colors.border
                      }]}
                      onPress={() => setShowAlbumSelector(true)}
                    >
                      {selectedAlbum ? (
                        <View style={styles.selectedAlbumInfo}>
                          <View style={[styles.albumIcon, { backgroundColor: getDynamicColor() }]}>
                            <FolderOpen size={16} color="#ffffff" />
                          </View>
                          <Text style={[styles.selectedAlbumText, { color: currentTheme.colors.text }]}>
                            {selectedAlbum.title}
                          </Text>
                        </View>
                      ) : (
                        <Text style={[styles.albumPlaceholder, { color: currentTheme.colors.textSecondary }]}>
                          Select an album
                        </Text>
                      )}
                      <Tag size={20} color={getDynamicColor()} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Album Selector Modal */}
          {renderAlbumSelector()}
        </LinearGradient>
      </SafeAreaView>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ visible: false, message: '', type: 'info' })}
      />
    </Modal>
  );
};

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
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageSelectionContainer: {
    marginBottom: 32,
  },
  imageSelectionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectionButtonGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  selectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedImageContainer: {
    marginBottom: 32,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  changeImageButton: {
    paddingVertical: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  photoDetailsContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  albumSelector: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedAlbumInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedAlbumText: {
    fontSize: 16,
    fontWeight: '500',
  },
  albumPlaceholder: {
    fontSize: 16,
    flex: 1,
  },
  // Album Selector Modal styles
  albumsList: {
    flex: 1,
    padding: 20,
  },
  albumItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  albumItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  albumItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumItemCount: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAlbumItem: {
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
  },
  placeholder: {
    width: 60,
  },
});

export default AddPhotoScreen;
