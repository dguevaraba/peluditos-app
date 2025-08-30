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
  name: string;
  species: string;
  breed?: string;
  age?: string;
  avatar_url?: string;
  is_active: boolean;
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

  // Mock data for now - will be replaced with real data
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Rocky',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '5 años',
      avatar_url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop',
      is_active: true,
    },
    {
      id: '2',
      name: 'Luna',
      species: 'cat',
      breed: 'Tabby',
      age: '3 años',
      avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      is_active: true,
    },
  ];

  const mockOrganizations: Organization[] = [
    {
      id: '1',
      name: 'PetCare Veterinary Clinic',
      description: 'Clínica veterinaria especializada en mascotas',
      address: '123 Main St, Los Angeles, CA',
      phone: '+1 (555) 123-4567',
      email: 'info@petcare.com',
      distance: '0.8 km',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Animal Hospital Center',
      description: 'Hospital veterinario con servicios 24/7',
      address: '456 Oak Ave, Los Angeles, CA',
      phone: '+1 (555) 234-5678',
      email: 'contact@animalhospital.com',
      distance: '1.2 km',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'VetCare Express',
      description: 'Atención veterinaria rápida y eficiente',
      address: '789 Pine St, Los Angeles, CA',
      phone: '+1 (555) 345-6789',
      email: 'hello@vetcare.com',
      distance: '1.5 km',
      rating: 4.9,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API calls
      setPets(mockPets);
      setOrganizations(mockOrganizations);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderPetCardList = ({ item }: { item: Pet }) => (
    <TouchableOpacity 
      style={[styles.petCard, { backgroundColor: currentTheme.colors.cardBackground }]}
      onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
    >
      {/* Pet Image Section */}
      <View style={styles.petImageContainer}>
        <Image 
          source={{ uri: item.avatar_url }} 
          style={styles.petImage}
        />
        <TouchableOpacity style={styles.petOptionsButton}>
          <Text style={styles.petOptionsText}>⋯</Text>
        </TouchableOpacity>
        <View style={styles.petStatusBadge}>
          <Text style={[styles.petStatusText, { color: selectedColor }]}>
            Active
          </Text>
        </View>
      </View>
      
      {/* Pet Info Section */}
      <View style={styles.petInfoContainer}>
        <Text style={[styles.petName, { color: currentTheme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.petDetails, { color: currentTheme.colors.textSecondary }]}>
          {item.age} • {item.breed}
        </Text>
        
        {/* Status Tags */}
        <View style={styles.petTags}>
          <View style={[styles.petTag, { backgroundColor: `${selectedColor}15` }]}>
            <Text style={[styles.petTagText, { color: selectedColor }]}>
              Checkup
            </Text>
          </View>
          <View style={[styles.petTag, { backgroundColor: `${selectedColor}15` }]}>
            <Text style={[styles.petTagText, { color: selectedColor }]}>
              Vaccinated
            </Text>
          </View>
        </View>
        
        {/* Vet Info */}
        <View style={styles.vetInfo}>
          <Calendar size={14} color={currentTheme.colors.textSecondary} />
          <Text style={[styles.vetInfoText, { color: currentTheme.colors.textSecondary }]}>
            Vet: Nov 12
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.petActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: `${selectedColor}10` }]}
            onPress={() => navigation.navigate('PetMedicalRecords', { petId: item.id })}
          >
            <Syringe size={16} color={selectedColor} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: `${selectedColor}10` }]}
            onPress={() => navigation.navigate('PetReminders', { petId: item.id })}
          >
            <Calendar size={16} color={selectedColor} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: selectedColor }]}
            onPress={() => navigation.navigate('AddPet')}
          >
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
          {item.age} • {item.breed}
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
      width: 60,
      height: 60,
      borderRadius: 30,
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

  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Mascotas</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona tus mascotas y veterinarias
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
