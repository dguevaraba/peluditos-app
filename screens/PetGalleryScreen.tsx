import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { GallerySkeleton } from '../components/Skeleton';
import AddPhotoOrCategoryScreen from './AddPhotoOrCategoryScreen';
import AddPhotoScreen from './AddPhotoScreen';
import CreateCategoryScreen from './CreateCategoryScreen';
import CreateAlbumScreen from './CreateAlbumScreen';
import { CategoryService } from '../services/categoryService';
import { AlbumService } from '../services/albumService';
import { 
  ArrowLeft,
  Heart,
  HeartOff,
  Share2,
  Download,
  Calendar,
  MapPin,
  User,
  Image as ImageIcon,
  Filter,
  Grid3X3,
  List,
  Plus,
  Settings
} from 'lucide-react-native';

interface PetPhoto {
  id: string;
  title: string;
  image: string;
  photoCount: number;
  date: string;
  location?: string;
  description?: string;
  // Campos adicionales para álbumes reales
  is_featured?: boolean;
  is_public?: boolean;
  category_id?: string;
  category?: any;
}

const petAlbums = [
  {
    id: '1',
    title: 'London Walk',
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop',
    photoCount: 10,
    date: 'March 15, 2024',
    location: 'Hyde Park, London',
    description: 'Beautiful day at the park with Rocky'
  },
  {
    id: '2',
    title: 'Vet Visit',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    photoCount: 3,
    date: 'March 10, 2024',
    location: 'PetCare Clinic',
    description: 'Annual checkup went great!'
  },
  {
    id: '3',
    title: 'Park Day',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    photoCount: 7,
    date: 'March 8, 2024',
    location: 'Central Park',
    description: 'Playing with other dogs'
  },
  {
    id: '4',
    title: 'Rocky\'s Birthday',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
    photoCount: 15,
    date: 'March 1, 2024',
    location: 'Home',
    description: 'Happy 6th birthday!'
  },
  {
    id: '5',
    title: 'Beach Adventure',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
    photoCount: 12,
    date: 'February 20, 2024',
    location: 'Santa Monica Beach',
    description: 'First time at the beach!'
  },
  {
    id: '6',
    title: 'Training Session',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    photoCount: 8,
    date: 'February 15, 2024',
    location: 'Dog Training Center',
    description: 'Learning new tricks'
  }
];

const PetGalleryScreen = () => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<PetPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [showCategoryActions, setShowCategoryActions] = useState(false);
  const [selectedCategoryForAction, setSelectedCategoryForAction] = useState<any>(null);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Debug modal de confirmación
  useEffect(() => {
    console.log('Delete confirmation modal state:', showDeleteConfirmation);
  }, [showDeleteConfirmation]);

  const getDynamicColor = () => selectedColor;

  // Cargar categorías reales
  const loadCategories = async () => {
    try {
      console.log('Loading all categories...');
      const allCategories = await CategoryService.getAllCategories();
      console.log('Categories loaded from database:', allCategories);
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback a categorías de ejemplo si hay error
      setCategories([
        { id: '1', name: 'Vet Visits', color: '#65b6ad', icon: 'heart' },
        { id: '2', name: 'Walks', color: '#8b5cf6', icon: 'dog' },
        { id: '3', name: 'Birthday', color: '#f59e0b', icon: 'star' },
      ]);
    }
  };

  // Cargar álbumes reales
  const loadAlbums = async () => {
    try {
      if (user?.id) {
        console.log('Loading albums for user:', user.id);
        const userAlbums = await AlbumService.getUserAlbums(user.id);
        console.log('Albums loaded from database:', userAlbums);
        setAlbums(userAlbums);
      }
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  // Transformar álbumes de la BD al formato de la UI
  const getDisplayAlbums = (): PetPhoto[] => {
    if (albums.length === 0) {
      // Si no hay álbumes reales, usar los de ejemplo
      return petAlbums;
    }

    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      image: album.cover_image_url || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop', // Imagen por defecto
      photoCount: 0, // TODO: Implementar conteo real de fotos
      date: new Date(album.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      location: album.location,
      description: album.description,
      // Datos adicionales del álbum real
      is_featured: album.is_featured,
      is_public: album.is_public,
      category_id: album.category_id,
      category: album.categories
    }));
  };

  // Simular carga inicial más rápida
  useEffect(() => {
    const timer = setTimeout(async () => {
      await loadCategories();
      await loadAlbums();
      setLoading(false);
    }, 800); // Más rápido que el home (800ms vs 2000ms)

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Recargar datos reales
    await loadCategories();
    await loadAlbums();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAlbumPress = (album: PetPhoto) => {
    setSelectedAlbum(album);
  };

  const handleBackPress = () => {
    setSelectedAlbum(null);
  };

  const handleAddPhoto = () => {
    setShowAddPhoto(true);
  };

  const handleAddCategory = () => {
    setShowCreateCategory(true);
  };

  const handlePhotoAdded = () => {
    // TODO: Refresh gallery data
    console.log('Photo added, refreshing gallery...');
  };

  const handleCategoryCreated = () => {
    // Recargar categorías cuando se crea una nueva
    loadCategories();
    setEditingCategory(null);
    console.log('Category created/updated, refreshing data...');
  };

  const handleCategoryLongPress = (category: any) => {
    setSelectedCategoryForAction(category);
    setShowCategoryActions(true);
  };

  const handleEditCategory = () => {
    setEditingCategory(selectedCategoryForAction);
    setShowCategoryActions(false);
    setShowCreateCategory(true);
  };

  const handleDeleteCategory = () => {
    console.log('Opening delete confirmation modal');
    setShowCategoryActions(false);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteFromManagement = (category: any) => {
    setSelectedCategoryForAction(category);
    setShowCategoryManagement(false);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedCategoryForAction) {
        await CategoryService.deleteCategory(selectedCategoryForAction.id);
        await loadCategories(); // Recargar categorías
        console.log('Category deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
    setShowDeleteConfirmation(false);
  };

  const handleEditFromManagement = (category: any) => {
    setEditingCategory(category);
    setShowCategoryManagement(false);
    setShowCreateCategory(true);
  };

  const handleAddButtonPress = () => {
    setShowAddOptions(true);
  };

  const handleAlbumCreated = () => {
    // Recargar álbumes cuando se crea uno nuevo
    loadAlbums();
    console.log('Album created/updated, refreshing data...');
  };

  const handleCreateAlbum = () => {
    setShowCreateAlbum(true);
  };

  const handleQuickCamera = () => {
    // TODO: Implementar acceso directo a cámara
    console.log('Quick camera access');
  };

  const handleQuickGallery = () => {
    // TODO: Implementar acceso directo a galería
    console.log('Quick gallery access');
  };

  const renderFilterButton = (filter: string, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && { backgroundColor: getDynamicColor() }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: selectedFilter === filter ? '#ffffff' : currentTheme.colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderAlbumCard = ({ item }: { item: PetPhoto }) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={[styles.albumCardList, { backgroundColor: `${selectedColor}15` }]}
          onPress={() => handleAlbumPress(item)}
        >
          <LinearGradient
            colors={[`${selectedColor}15`, 'transparent']}
            style={styles.cardGradientList}
          >
            <View style={styles.imageContainerList}>
              <Image source={{ uri: item.image }} style={styles.albumImageList} />
            </View>
            
            <View style={styles.albumInfoList}>
              <View style={styles.albumHeader}>
                <View style={styles.titleRow}>
                  <Text style={[styles.albumTitle, { color: currentTheme.colors.text }]}>
                    {item.title}
                  </Text>
                </View>
                <View style={styles.headerActionsRow}>
                  <TouchableOpacity style={styles.favoriteButtonList}>
                    {item.is_featured ? (
                      <Heart size={18} color="#ff4757" />
                    ) : (
                      <HeartOff size={18} color={getDynamicColor()} />
                    )}
                  </TouchableOpacity>
                  <View style={[styles.countChip, { backgroundColor: getDynamicColor() }]}>
                    <ImageIcon size={12} color="#ffffff" />
                    <Text style={styles.countChipText}>{item.photoCount}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.albumMeta}>
                <View style={styles.metaItem}>
                  <Calendar size={14} color={currentTheme.colors.textSecondary} />
                  <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                    {item.date}
                  </Text>
                </View>
                {item.location && (
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={currentTheme.colors.textSecondary} />
                    <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                      {item.location}
                    </Text>
                  </View>
                )}
              </View>
              {item.description && (
                <Text 
                  style={[styles.albumDescription, { color: currentTheme.colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.albumCard, { backgroundColor: `${selectedColor}15` }]}
        onPress={() => handleAlbumPress(item)}
      >
        <LinearGradient
          colors={[`${selectedColor}15`, 'transparent']}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.albumImage} />
            <TouchableOpacity style={styles.favoriteButton}>
              {item.is_featured ? (
                <Heart size={20} color="#ff4757" />
              ) : (
                <HeartOff size={20} color={getDynamicColor()} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.albumInfo}>
            <View style={styles.infoHeaderRow}>
              <View style={styles.titleRow}>
                <Text style={[styles.albumTitle, { color: currentTheme.colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <View style={[styles.countChip, { backgroundColor: getDynamicColor() }]}>
                <ImageIcon size={12} color="#ffffff" />
                <Text style={styles.countChipText}>{item.photoCount}</Text>
              </View>
            </View>
            <View style={styles.albumMeta}>
              <View style={styles.metaItem}>
                <Calendar size={14} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                  {item.date}
                </Text>
              </View>
              {item.location && (
                <View style={styles.metaItem}>
                  <MapPin size={14} color={currentTheme.colors.textSecondary} />
                  <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                    {item.location}
                  </Text>
                </View>
              )}
            </View>
            {item.description && (
              <Text 
                style={[styles.albumDescription, { color: currentTheme.colors.textSecondary }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderAlbumDetail = () => {
    if (!selectedAlbum) return null;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={getDynamicColor()} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: currentTheme.colors.text }]}>
            {selectedAlbum.title}
          </Text>
          <View style={styles.detailActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color={getDynamicColor()} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={20} color={getDynamicColor()} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailImageContainer}>
          <Image source={{ uri: selectedAlbum.image }} style={styles.detailImage} />
        </View>

        <View style={styles.detailInfo}>
          <View style={styles.detailMeta}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={getDynamicColor()} />
              <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                {selectedAlbum.date}
              </Text>
            </View>
            {selectedAlbum.location && (
              <View style={styles.metaItem}>
                <MapPin size={16} color={getDynamicColor()} />
                <Text style={[styles.metaText, { color: currentTheme.colors.textSecondary }]}>
                  {selectedAlbum.location}
                </Text>
              </View>
            )}
          </View>
          
          {selectedAlbum.description && (
            <Text style={[styles.detailDescription, { color: currentTheme.colors.text }]}>
              {selectedAlbum.description}
            </Text>
          )}

          <View style={styles.photoGrid}>
            {/* Aquí podrías mostrar más fotos del álbum */}
            {Array.from({ length: Math.min(selectedAlbum.photoCount, 6) }).map((_, index) => (
              <View key={index} style={styles.photoThumbnail}>
                <Image 
                  source={{ uri: selectedAlbum.image }} 
                  style={styles.thumbnailImage} 
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <GallerySkeleton />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
        style={styles.gradient}
      >
        {selectedAlbum ? (
          renderAlbumDetail()
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                    <ImageIcon size={24} color="#ffffff" />
                  </View>
                  <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                    Pet Photos
                  </Text>
                </View>
                <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>
                  All your precious moments
                </Text>
              </View>
            </View>

            {/* View Mode Toggle */}
            <View style={styles.viewModeContainer}>
              <View style={styles.viewModeButtons}>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    viewMode === 'grid' && { backgroundColor: getDynamicColor() }
                  ]}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid3X3 size={20} color={viewMode === 'grid' ? '#ffffff' : getDynamicColor()} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    viewMode === 'list' && { backgroundColor: getDynamicColor() }
                  ]}
                  onPress={() => setViewMode('list')}
                >
                  <List size={20} color={viewMode === 'list' ? '#ffffff' : getDynamicColor()} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    { backgroundColor: getDynamicColor() }
                  ]}
                  onPress={() => setShowCategoryManagement(true)}
                >
                  <Settings size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('recent', 'Recent')}
                {renderFilterButton('favorites', 'Favorites')}
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterButton,
                      selectedFilter === category.id && { backgroundColor: getDynamicColor() }
                    ]}
                    onPress={() => setSelectedFilter(category.id)}
                    onLongPress={() => handleCategoryLongPress(category)}
                    delayLongPress={500}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: selectedFilter === category.id ? '#ffffff' : currentTheme.colors.text }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Albums Grid */}
            <FlatList
              key={viewMode} // Forzar re-render cuando cambia el modo de vista
              data={getDisplayAlbums()}
              renderItem={renderAlbumCard}
              keyExtractor={(item) => item.id}
              numColumns={viewMode === 'grid' ? 2 : 1}
              contentContainerStyle={[
                styles.listContainer,
                viewMode === 'list' && styles.listContainerList
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[getDynamicColor()]}
                  tintColor={getDynamicColor()}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ImageIcon size={64} color={getDynamicColor()} />
                  <Text style={[styles.emptyTitle, { color: currentTheme.colors.text }]}>
                    {albums.length === 0 ? 'No albums yet' : 'No photos yet'}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: currentTheme.colors.textSecondary }]}>
                    {albums.length === 0 ? 'Create your first album' : 'Start capturing your pet\'s moments'}
                  </Text>
                </View>
              }
            />

            {/* Floating Add Button */}
            <TouchableOpacity 
              style={[styles.floatingAddButton, { backgroundColor: getDynamicColor() }]}
              onPress={handleAddButtonPress}
            >
              <Plus size={28} color="#ffffff" />
            </TouchableOpacity>

            {/* Add Photo or Category Modal */}
            <AddPhotoOrCategoryScreen
              visible={showAddOptions}
              onClose={() => setShowAddOptions(false)}
              onAddPhoto={handleAddPhoto}
              onAddCategory={handleAddCategory}
              onCreateAlbum={handleCreateAlbum}
              onQuickCamera={handleQuickCamera}
              onQuickGallery={handleQuickGallery}
            />

            {/* Add Photo Modal */}
            <AddPhotoScreen
              visible={showAddPhoto}
              onClose={() => setShowAddPhoto(false)}
              onPhotoAdded={handlePhotoAdded}
            />

            {/* Create Category Modal */}
            <CreateCategoryScreen
              visible={showCreateCategory}
              onClose={() => {
                setShowCreateCategory(false);
                setEditingCategory(null);
              }}
              onCategoryCreated={handleCategoryCreated}
              editingCategory={editingCategory}
            />

            {/* Create Album Modal */}
            <CreateAlbumScreen
              visible={showCreateAlbum}
              onClose={() => setShowCreateAlbum(false)}
              onAlbumCreated={handleAlbumCreated}
            />

            {/* Category Actions Modal */}
            <Modal
              visible={showCategoryActions}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCategoryActions(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryActionsModal, { backgroundColor: '#ffffff' }]}>
                  <Text style={[styles.categoryActionsTitle, { color: currentTheme.colors.text }]}>
                    {selectedCategoryForAction?.name}
                  </Text>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: getDynamicColor() }]}
                    onPress={handleEditCategory}
                  >
                    <Text style={styles.categoryActionButtonText}>Edit Category</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: '#ff4444' }]}
                    onPress={handleDeleteCategory}
                  >
                    <Text style={styles.categoryActionButtonText}>Delete Category</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: getDynamicColor() }]}
                    onPress={() => setShowCategoryActions(false)}
                  >
                    <Text style={styles.categoryActionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Category Management Modal */}
            <Modal
              visible={showCategoryManagement}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setShowCategoryManagement(false)}
            >
              <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
                <LinearGradient
                  colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
                  style={styles.gradient}
                >
                  {/* Header */}
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCategoryManagement(false)}>
                      <ArrowLeft size={24} color={currentTheme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                      Manage Categories
                    </Text>
                    <View style={styles.placeholder} />
                  </View>

                  {/* Categories List */}
                  <ScrollView style={styles.categoriesList}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryItem, { backgroundColor: `${getDynamicColor()}08` }]}
                        onPress={() => handleEditFromManagement(category)}
                      >
                        <View style={styles.categoryItemContent}>
                          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                            <Text style={styles.categoryIconText}>📁</Text>
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
                        <TouchableOpacity
                          style={[styles.deleteButton, { backgroundColor: '#ff4444' }]}
                          onPress={() => handleDeleteFromManagement(category)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </LinearGradient>
              </SafeAreaView>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
              visible={showDeleteConfirmation}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowDeleteConfirmation(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.deleteConfirmationModal, { backgroundColor: '#ffffff' }]}>
                  <Text style={[styles.deleteConfirmationTitle, { color: currentTheme.colors.text }]}>
                    Confirm Deletion
                  </Text>
                  <Text style={[styles.deleteConfirmationMessage, { color: currentTheme.colors.textSecondary }]}>
                    Are you sure you want to delete "{selectedCategoryForAction?.name}"? This action cannot be undone.
                  </Text>
                  <View style={styles.deleteConfirmationButtons}>
                    <TouchableOpacity
                      style={[styles.deleteConfirmationButton, { backgroundColor: '#ff4444' }]}
                      onPress={handleConfirmDelete}
                    >
                      <Text style={styles.deleteConfirmationButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteConfirmationButton, { backgroundColor: getDynamicColor() }]}
                      onPress={() => setShowDeleteConfirmation(false)}
                    >
                      <Text style={styles.deleteConfirmationButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  viewModeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewModeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  listContainerList: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  albumCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  albumCardList: {
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 12,
    borderRadius: 16,
  },
  cardGradientList: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  imageContainerList: {
    marginRight: 16,
    flexShrink: 0,
  },
  albumImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  albumImageList: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  photoCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  photoCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  albumInfo: {
    flex: 1,
  },
  albumInfoList: {
    flex: 1,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButtonList: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  albumMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  albumDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  detailImageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  detailInfo: {
    paddingHorizontal: 20,
  },
  detailMeta: {
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoThumbnail: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryActionsModal: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  categoryActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryActionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesList: {
    flex: 1,
    paddingHorizontal: 20,
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
  categoryIconText: {
    fontSize: 24,
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
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  deleteConfirmationModal: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  deleteConfirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deleteConfirmationMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteConfirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  deleteConfirmationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteConfirmationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetGalleryScreen;
