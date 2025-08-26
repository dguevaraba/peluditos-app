import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { AlbumService, CreateAlbumData } from '../services/albumService';
import { CategoryService } from '../services/categoryService';
import Toast from '../components/Toast';
import { 
  X,
  Save,
  Calendar,
  MapPin,
  FolderOpen,
  Star,
  Globe,
  Lock,
  Camera,
  Image as ImageIcon,
  Upload
} from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CreateAlbumScreenProps {
  visible: boolean;
  onClose: () => void;
  onAlbumCreated: () => void;
  editingAlbum?: any; // Álbum existente para editar
}

const CreateAlbumScreen: React.FC<CreateAlbumScreenProps> = ({
  visible,
  onClose,
  onAlbumCreated,
  editingAlbum
}) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumLocation, setAlbumLocation] = useState('');
  const [albumDate, setAlbumDate] = useState(new Date());
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'info'
  });

  const getDynamicColor = () => selectedColor;

  // Solicitar permisos de cámara y galería
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library permissions are required to select cover images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Seleccionar imagen de la galería
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0].uri);
        setShowImagePicker(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showToast('Failed to select image', 'error');
    }
  };

  // Tomar foto con la cámara
  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0].uri);
        setShowImagePicker(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showToast('Failed to take photo', 'error');
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const userCategories = await CategoryService.getAllCategories();
      setCategories(userCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Cargar datos del álbum si estamos editando
  useEffect(() => {
    if (editingAlbum) {
      setAlbumTitle(editingAlbum.title || '');
      setAlbumDescription(editingAlbum.description || '');
      setAlbumLocation(editingAlbum.location || '');
      setAlbumDate(editingAlbum.date ? new Date(editingAlbum.date) : new Date());
      setIsFeatured(editingAlbum.is_featured || false);
      setIsPublic(editingAlbum.is_public !== false);
      setSelectedCategory(editingAlbum.category_id ? { id: editingAlbum.category_id } : null);
      setCoverImage(editingAlbum.cover_image_url || null);
    } else {
      // Resetear formulario si no estamos editando
      setAlbumTitle('');
      setAlbumDescription('');
      setAlbumLocation('');
      setAlbumDate(new Date());
      setIsFeatured(false);
      setIsPublic(true);
      setSelectedCategory(null);
      setCoverImage(null);
    }
  }, [editingAlbum, visible]);

  // Cargar categorías al abrir la pantalla y limpiar toast
  useEffect(() => {
    if (visible) {
      loadCategories();
      // Limpiar toast al abrir la pantalla
      setToast({
        visible: false,
        message: '',
        type: 'info'
      });
    }
  }, [visible]);

  const showToast = (message: string, type: ToastType) => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSaveAlbum = async () => {
    if (!albumTitle.trim()) {
      showToast('Please enter an album title', 'warning');
      return;
    }

    if (!user?.id) {
      showToast('User not found', 'error');
      return;
    }

    setSaving(true);
    
    try {
      const albumData: CreateAlbumData = {
        title: albumTitle.trim(),
        description: albumDescription.trim() || undefined,
        location: albumLocation.trim() || undefined,
        date: albumDate.toISOString().split('T')[0], // YYYY-MM-DD format
        is_featured: isFeatured,
        is_public: isPublic,
        category_id: selectedCategory?.id,
        cover_image_url: coverImage || undefined,
      };

      let newAlbum;
      if (editingAlbum) {
        // Modo edición
        newAlbum = await AlbumService.updateAlbum(editingAlbum.id, albumData);
        console.log('Album updated successfully:', newAlbum);
        showToast('Album updated successfully!', 'success');
      } else {
        // Modo creación
        newAlbum = await AlbumService.createAlbum(albumData, user.id);
        console.log('Album created successfully:', newAlbum);
        showToast('Album created successfully!', 'success');
      }
      
      // Wait for toast to show before closing
      setTimeout(() => {
        onAlbumCreated();
        handleClose();
      }, 1200);
    } catch (error) {
      console.error('Error saving album:', error);
      showToast('Failed to save album. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // Limpiar el toast antes de cerrar
    setToast({
      visible: false,
      message: '',
      type: 'info'
    });
    
    setAlbumTitle('');
    setAlbumDescription('');
    setAlbumLocation('');
    setAlbumDate(new Date());
    setIsFeatured(false);
    setIsPublic(true);
    setSelectedCategory(null);
    setCoverImage(null);
    setShowCategorySelector(false);
    setShowDatePicker(false);
    setShowImagePicker(false);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAlbumDate(selectedDate);
    }
  };

  const renderCategorySelector = () => (
    <Modal
      visible={showCategorySelector}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCategorySelector(false)}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCategorySelector(false)}>
              <X size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Select Category
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Categories List */}
          <ScrollView style={styles.categoriesList}>
            <TouchableOpacity
              style={[styles.categoryItem, { backgroundColor: `${getDynamicColor()}08` }]}
              onPress={() => {
                setSelectedCategory(null);
                setShowCategorySelector(false);
              }}
            >
              <View style={styles.categoryItemContent}>
                <View style={[styles.categoryIcon, { backgroundColor: getDynamicColor() }]}>
                  <FolderOpen size={20} color="#ffffff" />
                </View>
                <View style={styles.categoryItemInfo}>
                  <Text style={[styles.categoryItemName, { color: currentTheme.colors.text }]}>
                    No Category
                  </Text>
                  <Text style={[styles.categoryItemDescription, { color: currentTheme.colors.textSecondary }]}>
                    Album without category
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, { backgroundColor: `${getDynamicColor()}08` }]}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowCategorySelector(false);
                }}
              >
                <View style={styles.categoryItemContent}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <FolderOpen size={20} color="#ffffff" />
                  </View>
                  <View style={styles.categoryItemInfo}>
                    <Text style={[styles.categoryItemName, { color: currentTheme.colors.text }]}>
                      {category.name}
                    </Text>
                    {category.description && (
                      <Text style={[styles.categoryItemDescription, { color: currentTheme.colors.textSecondary }]}>
                        {category.description}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
              {editingAlbum ? 'Edit Album' : 'Create Album'}
            </Text>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: getDynamicColor(),
                  opacity: albumTitle.trim() ? 1 : 0.5
                }
              ]}
              onPress={handleSaveAlbum}
              disabled={saving || !albumTitle.trim()}
            >
              <Text style={styles.saveButtonText}>
                {saving ? (editingAlbum ? 'Updating...' : 'Creating...') : (editingAlbum ? 'Update' : 'Create')}
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Album Preview */}
              <View style={styles.previewContainer}>
                <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                  Preview
                </Text>
                <View style={[styles.albumPreview, { backgroundColor: `${getDynamicColor()}15` }]}>
                  <LinearGradient
                    colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                    style={styles.previewGradient}
                  >
                    {coverImage ? (
                      <Image source={{ uri: coverImage }} style={styles.previewCoverImage} />
                    ) : (
                      <View style={[styles.previewIcon, { backgroundColor: getDynamicColor() }]}>
                        <FolderOpen size={24} color="#ffffff" />
                      </View>
                    )}
                    <View style={styles.previewInfo}>
                      <Text style={[styles.previewName, { color: currentTheme.colors.text }]}>
                        {albumTitle || 'Album Title'}
                      </Text>
                      <Text style={[styles.previewDescription, { color: currentTheme.colors.textSecondary }]}>
                        {albumDescription || 'Album description will appear here'}
                      </Text>
                      <View style={styles.previewMeta}>
                        <Text style={[styles.previewMetaText, { color: currentTheme.colors.textSecondary }]}>
                          {albumDate.toLocaleDateString()}
                        </Text>
                        {albumLocation && (
                          <Text style={[styles.previewMetaText, { color: currentTheme.colors.textSecondary }]}>
                            • {albumLocation}
                          </Text>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Album Details */}
              <View style={styles.detailsContainer}>
                <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                  Album Details
                </Text>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Title *
                  </Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      color: currentTheme.colors.text,
                      borderColor: getDynamicColor()
                    }]}
                    value={albumTitle}
                    onChangeText={setAlbumTitle}
                    placeholder="Enter album title"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    maxLength={100}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Description (optional)
                  </Text>
                  <TextInput
                    style={[styles.textArea, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      color: currentTheme.colors.text,
                      borderColor: getDynamicColor()
                    }]}
                    value={albumDescription}
                    onChangeText={setAlbumDescription}
                    placeholder="Describe this album..."
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    maxLength={500}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Cover Image (optional)
                  </Text>
                  <TouchableOpacity
                    style={[styles.coverImageContainer, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      borderColor: getDynamicColor()
                    }]}
                    onPress={() => setShowImagePicker(true)}
                  >
                    {coverImage ? (
                      <Image source={{ uri: coverImage }} style={styles.coverImagePreview} />
                    ) : (
                      <View style={styles.coverImagePlaceholder}>
                        <Upload size={24} color={getDynamicColor()} />
                        <Text style={[styles.coverImagePlaceholderText, { color: currentTheme.colors.textSecondary }]}>
                          Tap to add cover image
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Date
                  </Text>
                  <TouchableOpacity
                    style={[styles.selectorButton, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      borderColor: getDynamicColor()
                    }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <View style={styles.selectorContent}>
                      <Calendar size={20} color={getDynamicColor()} />
                      <Text style={[styles.selectorText, { color: currentTheme.colors.text }]}>
                        {albumDate.toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Location (optional)
                  </Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      color: currentTheme.colors.text,
                      borderColor: getDynamicColor()
                    }]}
                    value={albumLocation}
                    onChangeText={setAlbumLocation}
                    placeholder="Where were these photos taken?"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    maxLength={200}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Category (optional)
                  </Text>
                  <TouchableOpacity
                    style={[styles.selectorButton, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      borderColor: getDynamicColor()
                    }]}
                    onPress={() => setShowCategorySelector(true)}
                  >
                    <View style={styles.selectorContent}>
                      <FolderOpen size={20} color={getDynamicColor()} />
                      <Text style={[styles.selectorText, { color: currentTheme.colors.text }]}>
                        {selectedCategory?.name || 'Select Category'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Settings */}
                <View style={styles.settingsContainer}>
                  <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                    Settings
                  </Text>
                  
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Star size={20} color={getDynamicColor()} />
                      <View style={styles.settingText}>
                        <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
                          Featured Album
                        </Text>
                        <Text style={[styles.settingDescription, { color: currentTheme.colors.textSecondary }]}>
                          Highlight this album in your gallery
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isFeatured}
                      onValueChange={setIsFeatured}
                      trackColor={{ false: currentTheme.colors.border, true: getDynamicColor() }}
                      thumbColor={isFeatured ? '#ffffff' : currentTheme.colors.textSecondary}
                    />
                  </View>

                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      {isPublic ? <Globe size={20} color={getDynamicColor()} /> : <Lock size={20} color={getDynamicColor()} />}
                      <View style={styles.settingText}>
                        <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
                          Public Album
                        </Text>
                        <Text style={[styles.settingDescription, { color: currentTheme.colors.textSecondary }]}>
                          {isPublic ? 'Visible to everyone' : 'Only visible to you'}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isPublic}
                      onValueChange={setIsPublic}
                      trackColor={{ false: currentTheme.colors.border, true: getDynamicColor() }}
                      thumbColor={isPublic ? '#ffffff' : currentTheme.colors.textSecondary}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Category Selector Modal */}
          {renderCategorySelector()}

          {/* Image Picker Modal */}
          <Modal
            visible={showImagePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowImagePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.imagePickerModal, { backgroundColor: '#ffffff' }]}>
                <Text style={[styles.imagePickerTitle, { color: currentTheme.colors.text }]}>
                  Select Cover Image
                </Text>
                
                <TouchableOpacity
                  style={[styles.imagePickerButton, { backgroundColor: getDynamicColor() }]}
                  onPress={takePhotoWithCamera}
                >
                  <Camera size={20} color="#ffffff" />
                  <Text style={styles.imagePickerButtonText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.imagePickerButton, { backgroundColor: getDynamicColor() }]}
                  onPress={pickImageFromGallery}
                >
                  <ImageIcon size={20} color="#ffffff" />
                  <Text style={styles.imagePickerButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.imagePickerButton, { backgroundColor: currentTheme.colors.border }]}
                  onPress={() => setShowImagePicker(false)}
                >
                  <Text style={[styles.imagePickerButtonText, { color: currentTheme.colors.text }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={albumDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Toast */}
          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
            duration={4000}
          />
        </LinearGradient>
      </SafeAreaView>
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
  previewContainer: {
    marginBottom: 32,
  },
  albumPreview: {
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
  previewGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewMetaText: {
    fontSize: 12,
  },
  detailsContainer: {
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
  selectorButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  categoriesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryItemInfo: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryItemDescription: {
    fontSize: 12,
  },
  placeholder: {
    width: 60,
  },
  coverImageContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  coverImagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  coverImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImagePlaceholderText: {
    fontSize: 14,
    marginTop: 8,
  },
  previewCoverImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerModal: {
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CreateAlbumScreen;
