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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { GallerySkeleton } from '../components/Skeleton';
import { 
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Calendar,
  MapPin,
  User,
  Image as ImageIcon,
  Filter,
  Grid3X3,
  List,
  Plus
} from 'lucide-react-native';

interface PetPhoto {
  id: string;
  title: string;
  image: string;
  photoCount: number;
  date: string;
  location?: string;
  description?: string;
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
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<PetPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getDynamicColor = () => selectedColor;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
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
    // Aquí podrías abrir la cámara o galería para agregar fotos
    console.log('Add photo pressed');
    // TODO: Implementar funcionalidad de agregar fotos
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
                <Text style={[styles.albumTitle, { color: currentTheme.colors.text }]}>
                  {item.title}
                </Text>
                <View style={styles.headerActionsRow}>
                  <TouchableOpacity style={styles.favoriteButtonList}>
                    <Heart size={18} color={getDynamicColor()} />
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
              <Heart size={20} color={getDynamicColor()} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.albumInfo}>
            <View style={styles.infoHeaderRow}>
              <Text style={[styles.albumTitle, { color: currentTheme.colors.text }]}>
                {item.title}
              </Text>
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
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('recent', 'Recent')}
                {renderFilterButton('favorites', 'Favorites')}
                {renderFilterButton('vets', 'Vet Visits')}
                {renderFilterButton('walks', 'Walks')}
                {renderFilterButton('birthday', 'Birthday')}
              </ScrollView>
            </View>

            {/* Albums Grid */}
            <FlatList
              key={viewMode} // Forzar re-render cuando cambia el modo de vista
              data={petAlbums}
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
                    No photos yet
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: currentTheme.colors.textSecondary }]}>
                    Start capturing your pet's moments
                  </Text>
                </View>
              }
            />

            {/* Floating Add Button */}
            <TouchableOpacity 
              style={[styles.floatingAddButton, { backgroundColor: getDynamicColor() }]}
              onPress={handleAddPhoto}
            >
              <Plus size={28} color="#ffffff" />
            </TouchableOpacity>
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
});

export default PetGalleryScreen;
