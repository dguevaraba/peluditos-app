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
import { GallerySkeleton, AllPhotosSkeleton, AlbumDetailSkeleton } from '../components/Skeleton';
import AddPhotoOrCategoryScreen from './AddPhotoOrCategoryScreen';
import AddPhotoScreen from './AddPhotoScreen';
import CreateCategoryScreen from './CreateCategoryScreen';
import CreateAlbumScreen from './CreateAlbumScreen';
import { CategoryService } from '../services/categoryService';
import { AlbumService } from '../services/albumService';
import { PhotoService } from '../services/photoService';
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
  Settings,
  FolderOpen,
  ChevronDown,
  ChevronRight
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

const PetGalleryScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const [showAlbumActions, setShowAlbumActions] = useState(false);
  const [selectedAlbumForAction, setSelectedAlbumForAction] = useState<any>(null);
  const [showAlbumManagement, setShowAlbumManagement] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [showAlbumDeleteConfirmation, setShowAlbumDeleteConfirmation] = useState(false);
  const [showUnifiedSettings, setShowUnifiedSettings] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [albumPhotoCounts, setAlbumPhotoCounts] = useState<Record<string, number>>({});
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [albumPhotos, setAlbumPhotos] = useState<Record<string, any[]>>({});
  const [loadingAllPhotos, setLoadingAllPhotos] = useState(false);
  const [loadingAlbumDetail, setLoadingAlbumDetail] = useState(false);

  // Debug modal de confirmación
  useEffect(() => {
    console.log('Delete confirmation modal state:', showDeleteConfirmation);
  }, [showDeleteConfirmation]);

  const getDynamicColor = () => selectedColor;

  // Manejar parámetros de navegación
  useEffect(() => {
    if (route?.params?.selectedAlbum && route?.params?.openAlbumDetail) {
      const albumData = route.params.selectedAlbum;
      setSelectedAlbum({
        id: albumData.id,
        title: albumData.title,
        image: albumData.cover_image_url || '',
        photoCount: albumPhotoCounts[albumData.id] || 0,
        date: albumData.date || '',
        location: albumData.location || '',
        description: albumData.description || ''
      });
      // Limpiar parámetros para evitar que se ejecute de nuevo
      navigation.setParams({ selectedAlbum: null, openAlbumDetail: false });
    }
  }, [route?.params, albumPhotoCounts]);

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

  // Cargar conteos de fotos por álbum
  const loadAlbumPhotoCounts = async (albumsToCount: any[] = []) => {
    try {
      if (user?.id) {
        const albumsToProcess = albumsToCount.length > 0 ? albumsToCount : albums;
        
        if (albumsToProcess.length > 0) {
          const counts: Record<string, number> = {};
          const photos: Record<string, any[]> = {};
          
          // Cargar conteos y fotos para cada álbum
          for (const album of albumsToProcess) {
            console.log(`Loading photos for album: ${album.id} - ${album.title}`);
            const albumPhotos = await PhotoService.getPhotosByAlbum(album.id);
            counts[album.id] = albumPhotos.length;
            photos[album.id] = albumPhotos;
            console.log(`Found ${albumPhotos.length} photos for album ${album.id}`);
          }
          
          setAlbumPhotoCounts(counts);
          setAlbumPhotos(photos);
          console.log('Album photo counts loaded:', counts);
        }
      }
    } catch (error) {
      console.error('Error loading album photo counts:', error);
    }
  };

  // Cargar todas las fotos del usuario
  const loadAllPhotos = async () => {
    try {
      if (user?.id) {
        const photos = await PhotoService.getPhotosByUser();
        setAllPhotos(photos);
      }
    } catch (error) {
      console.error('Error loading all photos:', error);
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
        
        // Cargar conteos de fotos después de cargar álbumes
        if (userAlbums.length > 0) {
          await loadAlbumPhotoCounts(userAlbums);
        }
      }
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  // Transformar álbumes de la BD al formato de la UI con filtros
  const getDisplayAlbums = (): PetPhoto[] => {
    if (albums.length === 0) {
      // Si no hay álbumes reales, usar los de ejemplo
      return petAlbums;
    }

    let filteredAlbums = albums;

    // Aplicar filtros
    if (selectedFilter === 'recent') {
      // Mostrar álbumes creados en los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filteredAlbums = albums.filter(album => new Date(album.created_at) > thirtyDaysAgo);
    } else if (selectedFilter === 'favorites') {
      // Mostrar solo álbumes destacados
      filteredAlbums = albums.filter(album => album.is_featured);
    } else if (selectedFilter !== 'all') {
      // Filtrar por categoría específica
      filteredAlbums = albums.filter(album => album.category_id === selectedFilter);
    }

    return filteredAlbums.map((album) => {
      const photoCount = albumPhotoCounts[album.id] || 0;
      
      return {
        id: album.id,
        title: album.title,
        image: album.cover_image_url || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop', // Imagen por defecto
        photoCount: photoCount, // Usar conteo real de fotos
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
      };
    });
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

  // Recargar conteos cuando cambien los álbumes
  useEffect(() => {
    if (albums.length > 0) {
      loadAlbumPhotoCounts(albums);
    }
  }, [albums]);



  const onRefresh = async () => {
    setRefreshing(true);
    // Recargar datos reales
    await loadCategories();
    await loadAlbums();
    
    // Si estamos en la vista de All Photos, también recargar fotos
    if (showAllPhotos) {
      await loadAllPhotos();
    }
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAlbumPress = async (album: PetPhoto) => {
    setLoadingAlbumDetail(true);
    setSelectedAlbum(album);
    // Simular un pequeño delay para mostrar el skeleton
    setTimeout(() => {
      setLoadingAlbumDetail(false);
    }, 500);
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

  const handlePhotoAdded = async () => {
    // Refresh albums list and photo counts
    await loadAlbums();
    console.log('Photo added, albums and photo counts refreshed');
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

  const handleShowAllPhotos = async () => {
    setLoadingAllPhotos(true);
    await loadAllPhotos();
    setLoadingAllPhotos(false);
    setShowAllPhotos(true);
  };

  const handleBackFromPhotos = () => {
    setShowAllPhotos(false);
  };

  const handleAlbumCreated = () => {
    // Recargar álbumes cuando se crea uno nuevo
    loadAlbums();
    console.log('Album created/updated, refreshing data...');
  };

  // Funciones para edición de álbumes
  const handleAlbumLongPress = (album: any) => {
    setSelectedAlbumForAction(album);
    setShowAlbumActions(true);
  };

  const handleEditAlbum = () => {
    setEditingAlbum(selectedAlbumForAction);
    setShowAlbumActions(false);
    setShowCreateAlbum(true);
  };

  const handleDeleteAlbum = () => {
    setShowAlbumActions(false);
    setShowAlbumDeleteConfirmation(true);
  };

  const handleDeleteAlbumFromManagement = (album: any) => {
    setSelectedAlbumForAction(album);
    setShowAlbumManagement(false);
    setShowAlbumDeleteConfirmation(true);
  };

  const handleConfirmDeleteAlbum = async () => {
    try {
      if (selectedAlbumForAction) {
        await AlbumService.deleteAlbum(selectedAlbumForAction.id);
        await loadAlbums(); // Recargar álbumes
        console.log('Album deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
    }
    setShowAlbumDeleteConfirmation(false);
  };

  const handleEditAlbumFromManagement = (album: any) => {
    setEditingAlbum(album);
    setShowAlbumManagement(false);
    setShowCreateAlbum(true);
  };

  // Funciones para el modal unificado
  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getAlbumsByCategory = (categoryId: string) => {
    return getDisplayAlbums().filter(album => album.category_id === categoryId);
  };

  const toggleAlbumExpansion = (albumId: string) => {
    const newExpanded = new Set(expandedAlbums);
    if (newExpanded.has(albumId)) {
      newExpanded.delete(albumId);
    } else {
      newExpanded.add(albumId);
    }
    setExpandedAlbums(newExpanded);
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
    // Usar la imagen de portada del álbum (cover_image_url) si existe, sino usar la imagen por defecto
    const displayImage = item.image;
    
    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={[styles.albumCardList, { backgroundColor: `${selectedColor}15` }]}
          onPress={() => handleAlbumPress(item)}
          onLongPress={() => handleAlbumLongPress(item)}
        >
          <LinearGradient
            colors={[`${selectedColor}15`, 'transparent']}
            style={styles.cardGradientList}
          >
            <View style={styles.imageContainerList}>
              <Image source={{ uri: displayImage }} style={styles.albumImageList} />
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
        onLongPress={() => handleAlbumLongPress(item)}
      >
        <LinearGradient
          colors={[`${selectedColor}15`, 'transparent']}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: displayImage }} style={styles.albumImage} />
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
      <ScrollView 
        style={styles.detailContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[getDynamicColor()]}
            tintColor={getDynamicColor()}
          />
        }
      >
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
            {/* Mostrar las fotos reales del álbum */}
            {(() => {
              const albumPhotosList = albumPhotos[selectedAlbum.id] || [];
              const photosToShow = albumPhotosList.slice(0, 6); // Mostrar máximo 6 fotos
              
              if (photosToShow.length === 0) {
                return (
                  <View style={styles.noPhotosContainer}>
                    <ImageIcon size={48} color={getDynamicColor()} />
                    <Text style={[styles.noPhotosText, { color: currentTheme.colors.textSecondary }]}>
                      No photos in this album yet
                    </Text>
                  </View>
                );
              }
              
              return photosToShow.map((photo, index) => (
                <View key={photo.id || index} style={styles.photoThumbnail}>
                  <Image 
                    source={{ uri: photo.image_url }} 
                    style={styles.thumbnailImage} 
                  />
                </View>
              ));
            })()}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return <GallerySkeleton />;
  }

  if (loadingAllPhotos) {
    return <AllPhotosSkeleton />;
  }

  if (loadingAlbumDetail) {
    return <AlbumDetailSkeleton />;
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
                <TouchableOpacity 
                  style={styles.allPhotosButton}
                  onPress={handleShowAllPhotos}
                >
                  <ImageIcon size={16} color={getDynamicColor()} style={{ marginRight: 6 }} />
                  <Text style={[styles.allPhotosButtonText, { color: getDynamicColor() }]}>
                    All Photos
                  </Text>
                </TouchableOpacity>
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
                  onPress={() => setShowUnifiedSettings(true)}
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

            {/* Albums Grid or All Photos */}
            {showAllPhotos ? (
              // Vista de todas las fotos
              <View style={styles.allPhotosContainer}>
                <View style={styles.allPhotosHeader}>
                  <TouchableOpacity onPress={handleBackFromPhotos} style={styles.backButton}>
                    <ArrowLeft size={24} color={currentTheme.colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.allPhotosTitle, { color: currentTheme.colors.text }]}>
                    All Photos ({allPhotos.length})
                  </Text>
                </View>
                <FlatList
                  data={allPhotos}
                  renderItem={({ item }) => (
                    <View style={styles.photoItem}>
                      <Image source={{ uri: item.image_url }} style={styles.photoImage} />
                      <View style={styles.photoInfo}>
                        <Text style={[styles.photoTitle, { color: currentTheme.colors.text }]}>
                          {item.title}
                        </Text>
                        {item.description && (
                          <Text style={[styles.photoDescription, { color: currentTheme.colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={styles.allPhotosList}
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
                        No photos yet
                      </Text>
                      <Text style={[styles.emptySubtitle, { color: currentTheme.colors.textSecondary }]}>
                        Start capturing your pet's moments
                      </Text>
                    </View>
                  }
                />
              </View>
            ) : (
              // Vista normal de álbumes
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
            )}

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
              onClose={() => {
                setShowCreateAlbum(false);
                setEditingAlbum(null);
              }}
              onAlbumCreated={handleAlbumCreated}
              editingAlbum={editingAlbum}
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

            {/* Album Actions Modal */}
            <Modal
              visible={showAlbumActions}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowAlbumActions(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryActionsModal, { backgroundColor: '#ffffff' }]}>
                  <Text style={[styles.categoryActionsTitle, { color: currentTheme.colors.text }]}>
                    {selectedAlbumForAction?.title}
                  </Text>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: getDynamicColor() }]}
                    onPress={handleEditAlbum}
                  >
                    <Text style={styles.categoryActionButtonText}>Edit Album</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: '#ff4444' }]}
                    onPress={handleDeleteAlbum}
                  >
                    <Text style={styles.categoryActionButtonText}>Delete Album</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.categoryActionButton, { backgroundColor: getDynamicColor() }]}
                    onPress={() => setShowAlbumActions(false)}
                  >
                    <Text style={styles.categoryActionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Album Management Modal */}
            <Modal
              visible={showAlbumManagement}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setShowAlbumManagement(false)}
            >
              <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
                <LinearGradient
                  colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
                  style={styles.gradient}
                >
                  {/* Header */}
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowAlbumManagement(false)}>
                      <ArrowLeft size={24} color={currentTheme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                      Manage Albums
                    </Text>
                    <View style={styles.placeholder} />
                  </View>

                  {/* Albums List */}
                  <ScrollView style={styles.categoriesList}>
                    {getDisplayAlbums().map((album) => (
                      <TouchableOpacity
                        key={album.id}
                        style={[styles.categoryItem, { backgroundColor: `${getDynamicColor()}08` }]}
                        onPress={() => handleEditAlbumFromManagement(album)}
                      >
                        <View style={styles.categoryItemContent}>
                          <View style={[styles.categoryIcon, { backgroundColor: getDynamicColor() }]}>
                            <FolderOpen size={20} color="#ffffff" />
                          </View>
                          <View style={styles.categoryItemInfo}>
                            <Text style={[styles.categoryItemName, { color: currentTheme.colors.text }]}>
                              {album.title}
                            </Text>
                            {album.description && (
                              <Text style={[styles.categoryItemDescription, { color: currentTheme.colors.textSecondary }]}>
                                {album.description}
                              </Text>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={[styles.deleteButton, { backgroundColor: '#ff4444' }]}
                          onPress={() => handleDeleteAlbumFromManagement(album)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </LinearGradient>
              </SafeAreaView>
            </Modal>

            {/* Album Delete Confirmation Modal */}
            <Modal
              visible={showAlbumDeleteConfirmation}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowAlbumDeleteConfirmation(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.deleteConfirmationModal, { backgroundColor: '#ffffff' }]}>
                  <Text style={[styles.deleteConfirmationTitle, { color: currentTheme.colors.text }]}>
                    Delete Album
                  </Text>
                  <Text style={[styles.deleteConfirmationMessage, { color: currentTheme.colors.textSecondary }]}>
                    Are you sure you want to delete "{selectedAlbumForAction?.title}"? This action cannot be undone.
                  </Text>
                  <View style={styles.deleteConfirmationButtons}>
                    <TouchableOpacity
                      style={[styles.deleteConfirmationButton, { backgroundColor: '#ff4444' }]}
                      onPress={handleConfirmDeleteAlbum}
                    >
                      <Text style={styles.deleteConfirmationButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteConfirmationButton, { backgroundColor: getDynamicColor() }]}
                      onPress={() => setShowAlbumDeleteConfirmation(false)}
                    >
                      <Text style={styles.deleteConfirmationButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Unified Settings Modal */}
            <Modal
              visible={showUnifiedSettings}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setShowUnifiedSettings(false)}
            >
              <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
                <LinearGradient
                  colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
                  style={styles.gradient}
                >
                  {/* Header */}
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowUnifiedSettings(false)}>
                      <ArrowLeft size={24} color={currentTheme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                      Settings
                    </Text>
                    <View style={styles.placeholder} />
                  </View>

                  {/* Content */}
                  <ScrollView style={styles.categoriesList}>
                    {/* Categories Section */}
                    <View style={styles.settingsSection}>
                      <TouchableOpacity
                        style={[styles.mainSectionHeader, { backgroundColor: `${getDynamicColor()}08` }]}
                        onPress={() => toggleCategoryExpansion('categories')}
                      >
                        <View style={styles.mainSectionContent}>
                          <View style={[styles.mainSectionIcon, { backgroundColor: getDynamicColor() }]}>
                            <Text style={styles.mainSectionIconText}>📁</Text>
                          </View>
                          <View style={styles.mainSectionInfo}>
                            <Text style={[styles.mainSectionTitle, { color: currentTheme.colors.text }]}>
                              Categories
                            </Text>
                            <Text style={[styles.mainSectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
                              {categories.length} categories
                            </Text>
                          </View>
                        </View>
                        <View style={styles.mainSectionActions}>
                          {expandedCategories.has('categories') ? (
                            <ChevronDown size={20} color={getDynamicColor()} />
                          ) : (
                            <ChevronRight size={20} color={getDynamicColor()} />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      {/* Expanded Categories */}
                      {expandedCategories.has('categories') && (
                        <View style={styles.expandedSection}>
                          {categories.map((category) => (
                            <View key={category.id} style={styles.itemContainer}>
                              <View style={[styles.itemHeader, { backgroundColor: `${getDynamicColor()}04` }]}>
                                <View style={styles.itemContent}>
                                  <View style={[styles.itemIcon, { backgroundColor: category.color }]}>
                                    <Text style={styles.itemIconText}>📁</Text>
                                  </View>
                                  <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, { color: currentTheme.colors.text }]}>
                                      {category.name}
                                    </Text>
                                    {category.description && (
                                      <Text style={[styles.itemDescription, { color: currentTheme.colors.textSecondary }]}>
                                        {category.description}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              </View>
                              
                              {/* Item Actions */}
                              <View style={styles.itemActions}>
                                <TouchableOpacity
                                  style={[styles.editButton, { backgroundColor: getDynamicColor() }]}
                                  onPress={() => handleEditFromManagement(category)}
                                >
                                  <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.deleteButton, { backgroundColor: '#ff4444' }]}
                                  onPress={() => handleDeleteFromManagement(category)}
                                >
                                  <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Albums Section */}
                    <View style={styles.settingsSection}>
                      <TouchableOpacity
                        style={[styles.mainSectionHeader, { backgroundColor: `${getDynamicColor()}08` }]}
                        onPress={() => toggleCategoryExpansion('albums')}
                      >
                        <View style={styles.mainSectionContent}>
                          <View style={[styles.mainSectionIcon, { backgroundColor: getDynamicColor() }]}>
                            <FolderOpen size={20} color="#ffffff" />
                          </View>
                          <View style={styles.mainSectionInfo}>
                            <Text style={[styles.mainSectionTitle, { color: currentTheme.colors.text }]}>
                              Albums
                            </Text>
                            <Text style={[styles.mainSectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
                              {getDisplayAlbums().length} albums
                            </Text>
                          </View>
                        </View>
                        <View style={styles.mainSectionActions}>
                          {expandedCategories.has('albums') ? (
                            <ChevronDown size={20} color={getDynamicColor()} />
                          ) : (
                            <ChevronRight size={20} color={getDynamicColor()} />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      {/* Expanded Albums */}
                      {expandedCategories.has('albums') && (
                        <View style={styles.expandedSection}>
                          {getDisplayAlbums().map((album) => (
                            <View key={album.id} style={styles.itemContainer}>
                              <View style={[styles.itemHeader, { backgroundColor: `${getDynamicColor()}04` }]}>
                                <View style={styles.itemContent}>
                                  <View style={[styles.itemIcon, { backgroundColor: getDynamicColor() }]}>
                                    <FolderOpen size={16} color="#ffffff" />
                                  </View>
                                  <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, { color: currentTheme.colors.text }]}>
                                      {album.title}
                                    </Text>
                                    {album.description && (
                                      <Text style={[styles.itemDescription, { color: currentTheme.colors.textSecondary }]}>
                                        {album.description}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              </View>
                              
                              {/* Item Actions */}
                              <View style={styles.itemActions}>
                                <TouchableOpacity
                                  style={[styles.editButton, { backgroundColor: getDynamicColor() }]}
                                  onPress={() => handleEditAlbumFromManagement(album)}
                                >
                                  <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.deleteButton, { backgroundColor: '#ff4444' }]}
                                  onPress={() => handleDeleteAlbumFromManagement(album)}
                                >
                                  <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </LinearGradient>
              </SafeAreaView>
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
    minWidth: 80,
    justifyContent: 'center',
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
    minWidth: 80,
    justifyContent: 'center',
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
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandedAlbums: {
    marginLeft: 20,
    marginBottom: 12,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  albumItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  albumItemInfo: {
    flex: 1,
  },
  albumItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumItemDescription: {
    fontSize: 12,
  },

  emptyAlbumsText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  albumContainer: {
    marginBottom: 12,
  },
  albumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  albumHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumActions: {
    marginLeft: 12,
  },
  albumDetails: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginLeft: 20,
  },
  albumDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  albumDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  albumDetailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  mainSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  mainSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mainSectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mainSectionIconText: {
    fontSize: 24,
  },
  mainSectionInfo: {
    flex: 1,
  },
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainSectionSubtitle: {
    fontSize: 14,
  },
  mainSectionActions: {
    marginLeft: 12,
  },
  expandedSection: {
    marginLeft: 20,
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
  },
  allPhotosButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  allPhotosButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  allPhotosContainer: {
    flex: 1,
  },
  allPhotosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  allPhotosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  allPhotosList: {
    padding: 10,
  },
  photoItem: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  photoImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 12,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noPhotosText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default PetGalleryScreen;
