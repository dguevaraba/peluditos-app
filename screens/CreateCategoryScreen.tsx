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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { CategoryService, CreateCategoryData } from '../services/categoryService';
import Toast, { ToastType } from '../components/Toast';
import { 
  ArrowLeft,
  X,
  Save,
  Palette,
  Tag,
  FolderPlus,
  Check,
  Folder,
  Camera,
  Heart,
  Star,
  Flower,
  Trees,
  Sun,
  Moon,
  Car,
  Home,
  Dog,
  Cat,
  Image as ImageIcon
} from 'lucide-react-native';

interface ColorOption {
  id: string;
  color: string;
  name: string;
}

interface IconOption {
  id: string;
  icon: string;
  name: string;
}

interface CreateCategoryScreenProps {
  visible: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
  editingCategory?: any; // Categoría existente para editar
}

const CreateCategoryScreen: React.FC<CreateCategoryScreenProps> = ({
  visible,
  onClose,
  onCategoryCreated,
  editingCategory
}) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState<string>('#65b6ad');
  const [selectedIcon, setSelectedIcon] = useState<string>('folder');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Cargar datos de la categoría si estamos editando
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name || '');
      setCategoryDescription(editingCategory.description || '');
      setCategoryColor(editingCategory.color || '#65b6ad');
      setSelectedIcon(editingCategory.icon || 'folder');
    } else {
      // Resetear formulario si no estamos editando
      setCategoryName('');
      setCategoryDescription('');
      setCategoryColor('#65b6ad');
      setSelectedIcon('folder');
    }
  }, [editingCategory, visible]);

  const colorOptions: ColorOption[] = [
    { id: 'green', color: '#65b6ad', name: 'Green' },
    { id: 'teal', color: '#7FB3BA', name: 'Teal' },
    { id: 'purple', color: '#B8A9C9', name: 'Lavender' },
    { id: 'coral', color: '#FF6B6B', name: 'Coral' },
    { id: 'mint', color: '#98D8C8', name: 'Mint' },
    { id: 'rose', color: '#F7CAC9', name: 'Rose' },
    { id: 'blue', color: '#4A90E2', name: 'Blue' },
    { id: 'pink', color: '#EC4899', name: 'Pink' },
    { id: 'emerald', color: '#10B981', name: 'Emerald' },
    { id: 'violet', color: '#8B5CF6', name: 'Violet' },
    { id: 'amber', color: '#F59E0B', name: 'Amber' },
    { id: 'cyan', color: '#06B6D4', name: 'Cyan' },
  ];

  const iconOptions: IconOption[] = [
    { id: 'folder', icon: 'folder', name: 'Folder' },
    { id: 'camera', icon: 'camera', name: 'Camera' },
    { id: 'heart', icon: 'heart', name: 'Heart' },
    { id: 'star', icon: 'star', name: 'Star' },
    { id: 'flower', icon: 'flower', name: 'Flower' },
    { id: 'trees', icon: 'trees', name: 'Trees' },
    { id: 'sun', icon: 'sun', name: 'Sun' },
    { id: 'moon', icon: 'moon', name: 'Moon' },
    { id: 'car', icon: 'car', name: 'Car' },
    { id: 'home', icon: 'home', name: 'Home' },
    { id: 'dog', icon: 'dog', name: 'Dog' },
    { id: 'cat', icon: 'cat', name: 'Cat' },
  ];

  const getDynamicColor = () => selectedColor;

  console.log('Current theme colors:', currentTheme.colors);
  console.log('Selected color:', selectedColor);

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

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      showToast('Please enter a category name', 'warning');
      return;
    }

    setSaving(true);
    
    try {
      const categoryData: CreateCategoryData = {
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        color: categoryColor,
        icon: selectedIcon,
      };

      let newCategory;
      if (editingCategory) {
        // Modo edición
        newCategory = await CategoryService.updateCategory(editingCategory.id, categoryData);
        console.log('Category updated successfully:', newCategory);
        showToast('Category updated successfully!', 'success');
      } else {
        // Modo creación
        newCategory = await CategoryService.createCategory(categoryData);
        console.log('Category created successfully:', newCategory);
        showToast('Category created successfully!', 'success');
      }
      
      // Wait for toast to show before closing
      setTimeout(() => {
        onCategoryCreated();
        handleClose();
      }, 800);
    } catch (error) {
      console.error('Error saving category:', error);
      showToast('Failed to save category. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryDescription('');
    setCategoryColor('#65b6ad');
    setSelectedIcon('folder');
    setShowColorPicker(false);
    setShowIconPicker(false);
    onClose();
  };

  const renderColorPicker = () => (
    <Modal
      visible={showColorPicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowColorPicker(false)}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowColorPicker(false)}>
              <ArrowLeft size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Choose Color
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Color Grid */}
          <ScrollView 
            style={styles.colorPickerContent}
            contentContainerStyle={styles.colorPickerContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.colorGrid}>
              {colorOptions.map((colorOption, index) => (
                <TouchableOpacity
                  key={colorOption.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption.color },
                    categoryColor === colorOption.color && styles.selectedColorOption
                  ]}
                  onPress={() => {
                    setCategoryColor(colorOption.color);
                    setShowColorPicker(false);
                  }}
                >
                  {categoryColor === colorOption.color && (
                    <View style={styles.checkContainer}>
                      <Check size={28} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const renderIconPicker = () => (
    <Modal
      visible={showIconPicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowIconPicker(false)}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowIconPicker(false)}>
              <ArrowLeft size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Choose Icon
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Icon Grid */}
          <ScrollView style={styles.iconPickerContent}>
            <View style={styles.iconGrid}>
              {iconOptions.map((iconOption) => (
                <TouchableOpacity
                  key={iconOption.id}
                  style={[
                    styles.iconOption,
                    selectedIcon === iconOption.id && { backgroundColor: `${getDynamicColor()}15` }
                  ]}
                  onPress={() => {
                    setSelectedIcon(iconOption.id);
                    setShowIconPicker(false);
                  }}
                >
                  <View style={styles.iconText}>
                    {renderIcon(iconOption.icon, 24, getDynamicColor())}
                  </View>
                  <Text style={[styles.iconName, { color: currentTheme.colors.textSecondary }]}>
                    {iconOption.name}
                  </Text>
                  {selectedIcon === iconOption.id && (
                    <View style={[styles.selectedIconIndicator, { backgroundColor: getDynamicColor() }]}>
                      <Check size={12} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const renderIcon = (iconId: string, size: number, color: string) => {
    switch (iconId) {
      case 'folder': return <Folder size={size} color={color} />;
      case 'camera': return <Camera size={size} color={color} />;
      case 'heart': return <Heart size={size} color={color} />;
      case 'star': return <Star size={size} color={color} />;
      case 'flower': return <Flower size={size} color={color} />;
      case 'trees': return <Trees size={size} color={color} />;
      case 'sun': return <Sun size={size} color={color} />;
      case 'moon': return <Moon size={size} color={color} />;
      case 'car': return <Car size={size} color={color} />;
      case 'home': return <Home size={size} color={color} />;
      case 'dog': return <Dog size={size} color={color} />;
      case 'cat': return <Cat size={size} color={color} />;
      default: return <Folder size={size} color={color} />;
    }
  };

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
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </Text>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: getDynamicColor(),
                  opacity: categoryName.trim() ? 1 : 0.5
                }
              ]}
              onPress={handleSaveCategory}
              disabled={saving || !categoryName.trim()}
            >
              <Text style={styles.saveButtonText}>
                {saving ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update' : 'Create')}
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category Preview */}
              <View style={styles.previewContainer}>
                <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                  Preview
                </Text>
                <View style={[styles.categoryPreview, { backgroundColor: `${getDynamicColor()}15` }]}>
                  <LinearGradient
                    colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                    style={styles.previewGradient}
                  >
                    <View style={[styles.previewIcon, { backgroundColor: categoryColor }]}>
                      {renderIcon(selectedIcon, 24, '#ffffff')}
                    </View>
                    <View style={styles.previewInfo}>
                      <Text style={[styles.previewName, { color: currentTheme.colors.text }]}>
                        {categoryName || 'Category Name'}
                      </Text>
                      <Text style={[styles.previewDescription, { color: currentTheme.colors.textSecondary }]}>
                        {categoryDescription || 'Category description will appear here'}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Category Details */}
              <View style={styles.detailsContainer}>
                <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                  Category Details
                </Text>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Name *
                  </Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      color: currentTheme.colors.text,
                      borderColor: getDynamicColor()
                    }]}
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Enter category name"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    maxLength={50}
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
                    value={categoryDescription}
                    onChangeText={setCategoryDescription}
                    placeholder="Describe what this category is for..."
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>

                {/* Color Selection */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Color
                  </Text>
                  <TouchableOpacity
                    style={[styles.selectorButton, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      borderColor: getDynamicColor()
                    }]}
                    onPress={() => setShowColorPicker(true)}
                  >
                    <View style={styles.selectorContent}>
                      <View style={[styles.colorPreview, { backgroundColor: categoryColor }]} />
                      <Text style={[styles.selectorText, { color: currentTheme.colors.text }]}>
                        {colorOptions.find(color => color.color === categoryColor)?.name || 'Select Color'}
                      </Text>
                    </View>
                    <Palette size={20} color={getDynamicColor()} />
                  </TouchableOpacity>
                </View>

                {/* Icon Selection */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                    Icon
                  </Text>
                  <TouchableOpacity
                    style={[styles.selectorButton, { 
                      backgroundColor: `${getDynamicColor()}08`,
                      borderColor: getDynamicColor()
                    }]}
                    onPress={() => setShowIconPicker(true)}
                  >
                    <View style={styles.selectorContent}>
                                             <View style={styles.iconPreviewText}>
                         {renderIcon(selectedIcon, 20, getDynamicColor())}
                       </View>
                      <Text style={[styles.selectorText, { color: currentTheme.colors.text }]}>
                        {iconOptions.find(icon => icon.id === selectedIcon)?.name || 'Select Icon'}
                      </Text>
                    </View>
                    <Tag size={20} color={getDynamicColor()} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Color Picker Modal */}
          {renderColorPicker()}

          {/* Icon Picker Modal */}
          {renderIconPicker()}

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
  categoryPreview: {
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
  previewIconText: {
    fontSize: 24,
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
    justifyContent: 'space-between',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  iconPreviewText: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Color Picker styles
  colorPickerContent: {
    flex: 1,
    padding: 20,
  },
  colorPickerContentContainer: {
    paddingBottom: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  colorOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#ffffff',
    transform: [{ scale: 1.05 }],
  },
  checkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
  },
  // Icon Picker styles
  iconPickerContent: {
    flex: 1,
    padding: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconText: {
    fontSize: 32,
    marginBottom: 4,
  },
  iconName: {
    fontSize: 10,
    textAlign: 'center',
  },
  selectedIconIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 60,
  },
  textInputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  textInputGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
});

export default CreateCategoryScreen;
