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
import { 
  Plus, 
  PawPrint, 
  Building2, 
  Calendar, 
  MapPin, 
  Phone,
  Heart,
  Syringe,
  User,
  Settings,
  Menu,
  Grid3X3,
  List
} from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { PetService } from '../services/petService';
import { OrganizationService } from '../services/organizationService';

interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other';
  breed?: string;
  color?: string;
  birth_date?: string;
  weight?: number;
  weight_unit: 'kg' | 'lb';
  gender?: 'male' | 'female' | 'unknown';
  microchip_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  distance?: string;
  rating?: number;
}

const PetsScreen = ({ navigation }: { navigation: any }) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


  const getDynamicColor = () => selectedColor;

  // Calculate age from birth date
  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${ageInYears - 1} years`;
    }
    return `${ageInYears} years`;
  };

  // Load pets from database
  const loadPets = async () => {
    try {
      setLoading(true);
      const result = await PetService.getUserPets();
      if (result.success && result.data) {
        setPets(result.data);
      } else {
        console.error('Error loading pets:', result.error);
        // Fallback to mock data if no pets found
        setPets([]);
      }
    } catch (error) {
      console.error('Error loading pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  // Load pets on component mount and when screen comes into focus
  useEffect(() => {
    loadPets();
  }, []);

  // Reload pets when screen comes into focus (e.g., after adding a new pet)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPets();
    });

    return unsubscribe;
  }, [navigation]);

  // Refresh pets
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const renderPetCardList = ({ item }: { item: Pet }) => (
    <TouchableOpacity 
      style={[styles.petCardList, { backgroundColor: currentTheme.colors.cardBackground }]}
      onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
    >
      {/* Pet Image */}
      <View style={styles.petImageContainerList}>
        <Image 
          source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop' }} 
          style={styles.petImageList}
        />
      </View>
      
      {/* Pet Info */}
      <View style={styles.petInfoContainerList}>
        <Text style={[styles.petNameList, { color: currentTheme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.petDetailsList, { color: currentTheme.colors.textSecondary }]}>
          {item.birth_date ? calculateAge(item.birth_date) : 'Unknown age'} • {item.weight ? `${item.weight} ${item.weight_unit}` : 'Unknown weight'}
        </Text>
        
        {/* Status Tag */}
        <View style={[styles.petTagList, { backgroundColor: `${selectedColor}15` }]}>
          <Text style={[styles.petTagTextList, { color: selectedColor }]}>
            Vaccinated
          </Text>
        </View>
      </View>
      
      {/* Action Icons */}
      <View style={styles.petActionsList}>
        <TouchableOpacity style={styles.actionIconList}>
          <Calendar size={20} color={selectedColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIconList}>
          <User size={20} color={selectedColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIconList}>
          <Heart size={20} color={selectedColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPetCardGrid = ({ item }: { item: Pet }) => (
    <TouchableOpacity 
      style={[styles.petCardGrid, { backgroundColor: currentTheme.colors.cardBackground }]}
      onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
    >
      {/* Pet Image */}
      <View style={styles.petImageContainerGrid}>
        <Image 
          source={{ uri: item.avatar_url }} 
          style={styles.petImageGrid}
        />
        <TouchableOpacity style={styles.petOptionsButtonGrid}>
          <Text style={styles.petOptionsText}>⋯</Text>
        </TouchableOpacity>
      </View>
      
      {/* Pet Info */}
      <View style={styles.petInfoContainerGrid}>
        <Text style={[styles.petNameGrid, { color: currentTheme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.petDetailsGrid, { color: currentTheme.colors.textSecondary }]}>
          {item.birth_date ? calculateAge(item.birth_date) : 'Unknown age'} • {item.breed || 'Unknown breed'}
        </Text>
        
        {/* Status Tag */}
        <View style={[styles.petTagGrid, { backgroundColor: `${selectedColor}15` }]}>
          <Text style={[styles.petTagTextGrid, { color: selectedColor }]}>
            Active
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: currentTheme.colors.text,
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 16,
      color: currentTheme.colors.textSecondary,
    },

    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: `${currentTheme.colors.textSecondary}15`,
    },
    filterButtonActive: {
      backgroundColor: `${selectedColor}20`,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: currentTheme.colors.textSecondary,
    },
    filterButtonTextActive: {
      color: selectedColor,
    },
    filterActions: {
      flexDirection: 'row',
      gap: 8,
    },
    filterActionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${currentTheme.colors.textSecondary}10`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterActionButtonActive: {
      backgroundColor: `${selectedColor}15`,
    },
    filterActionText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    gridRow: {
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: selectedColor,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    // Pet Card Styles
    petCard: {
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    petImageContainer: {
      position: 'relative',
      height: 160,
    },
    petImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    petOptionsButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    petOptionsText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#666',
    },
    petStatusBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    petStatusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    petInfoContainer: {
      padding: 16,
    },
    petName: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    petDetails: {
      fontSize: 14,
      marginBottom: 12,
    },
    petTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
      gap: 6,
    },
    petTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    petTagText: {
      fontSize: 12,
      fontWeight: '500',
    },
    vetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    vetInfoText: {
      fontSize: 14,
      marginLeft: 6,
    },
    petActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Grid View Styles
    petCardGrid: {
      width: '48%',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    petImageContainerGrid: {
      position: 'relative',
      height: 120,
    },
    petImageGrid: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    petOptionsButtonGrid: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    petInfoContainerGrid: {
      padding: 12,
    },
    petNameGrid: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    petDetailsGrid: {
      fontSize: 12,
      marginBottom: 8,
    },
    petTagGrid: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    petTagTextGrid: {
      fontSize: 10,
      fontWeight: '500',
    },
    // List View Styles
    petCardList: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    petImageContainerList: {
      marginRight: 16,
    },
    petImageList: {
      width: 60,
      height: 60,
      borderRadius: 30,
      resizeMode: 'cover',
    },
    petInfoContainerList: {
      flex: 1,
    },
    petNameList: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    petDetailsList: {
      fontSize: 14,
      marginBottom: 8,
    },
    petTagList: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    petTagTextList: {
      fontSize: 12,
      fontWeight: '500',
    },
    petActionsList: {
      flexDirection: 'row',
      gap: 12,
    },
    actionIconList: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },

  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pets</Text>
        <Text style={styles.headerSubtitle}>
          Manage your pets and veterinarians
        </Text>
      </View>



      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
          >
            <Text style={styles.filterButtonText}>
              Dog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
          >
            <Text style={styles.filterButtonText}>
              Cat
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={[styles.filterActionButton, viewMode === 'grid' && styles.filterActionButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={20} color={viewMode === 'grid' ? selectedColor : currentTheme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterActionButton, viewMode === 'list' && styles.filterActionButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={20} color={viewMode === 'list' ? selectedColor : currentTheme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

            {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'grid' ? (
          <FlatList
            key={`grid-${viewMode}`}
            data={pets}
            renderItem={renderPetCardGrid}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <PawPrint size={48} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.headerSubtitle, { marginTop: 16 }]}>
                  No tienes mascotas registradas
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            key={`list-${viewMode}`}
            data={pets}
            renderItem={renderPetCardList}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <PawPrint size={48} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.headerSubtitle, { marginTop: 16 }]}>
                  No tienes mascotas registradas
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PetsScreen;
