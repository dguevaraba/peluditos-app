import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { PetService, PetWeightRecord } from '../services/petService';
import WeightGraph from '../components/WeightGraph';
import { 
  ArrowLeft, 
  Edit, 
  TrendingUp, 
  PawPrint, 
  Calendar,
  ChevronRight,
  Briefcase,
  Users,
  Rocket,
  Leaf,
  Plus
} from 'lucide-react-native';

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

const PetDetailScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [weightData, setWeightData] = useState<PetWeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllWeightData, setShowAllWeightData] = useState(false);

  const { petId } = route.params;

  useEffect(() => {
    loadPet();
    loadWeightData();
  }, [petId]);

  // Reload weight data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWeightData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadPet = async () => {
    try {
      setLoading(true);
      const result = await PetService.getPet(petId);
      if (result.success && result.data) {
        setPet(result.data);
      }
    } catch (error) {
      console.error('Error loading pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeightData = async () => {
    try {
      console.log('Loading weight data for petId:', petId);
      const result = await PetService.getPetWeightHistory(petId); // No months parameter = get all records
      console.log('Weight data result:', result);
      if (result.success && result.data) {
        setWeightData(result.data);
        console.log('Weight data set:', result.data);
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
    }
  };

  if (loading || !pet) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: currentTheme.colors.text }]}>
            Loading pet details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: currentTheme.colors.cardSurface,
        borderBottomColor: currentTheme.colors.border 
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: pet.avatar_url || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop' }} 
            style={[styles.petAvatar, { borderColor: currentTheme.colors.border }]}
          />
          <View style={styles.petInfo}>
            <Text style={[styles.petName, { color: currentTheme.colors.text }]}>
              {pet.name}
            </Text>
            <Text style={[styles.petDetails, { color: currentTheme.colors.textSecondary }]}>
              {pet.birth_date ? calculateAge(pet.birth_date) : 'Unknown age'} • {pet.breed || 'Unknown breed'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: selectedColor }]}
          onPress={() => navigation.navigate('EditPet', { petId: pet.id })}
        >
          <Text style={styles.editButtonText}>Edit Pet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: 'transparent' }]} showsVerticalScrollIndicator={false}>
        {/* Weight Section */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardSurface }]}>
          <View style={styles.weightHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Weight
            </Text>
            <View style={styles.weightActions}>
              <TouchableOpacity 
                style={[
                  styles.filterButton, 
                  { 
                    borderColor: currentTheme.colors.border,
                    backgroundColor: showAllWeightData ? selectedColor : currentTheme.colors.background 
                  }
                ]}
                onPress={() => setShowAllWeightData(!showAllWeightData)}
              >
                <Text style={[styles.filterButtonText, { color: showAllWeightData ? '#FFFFFF' : currentTheme.colors.text }]}>
                  {showAllWeightData ? 'All' : '6M'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addWeightButton, { backgroundColor: selectedColor }]}
                onPress={() => navigation.navigate('AddWeightRecord', { petId: pet.id })}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.weightGraphContainer, { backgroundColor: 'transparent' }]}>
            <WeightGraph
              weightData={weightData}
              selectedColor={selectedColor}
              textColor={currentTheme.colors.text}
              textSecondaryColor={currentTheme.colors.textSecondary}
              backgroundColor={currentTheme.colors.background}
              cardBackgroundColor={currentTheme.colors.cardSurface}
              borderColor={currentTheme.colors.border}
              showLastMonths={showAllWeightData ? undefined : 6} // Show all or last 6 months
            />
          </View>
        </View>

        {/* Steps Section */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardSurface }]}>
          <View style={[styles.stepsContainer, { backgroundColor: currentTheme.colors.background }]}>
            <PawPrint size={20} color={selectedColor} />
            <Text style={[styles.stepsText, { color: currentTheme.colors.text }]}>
              Today: 5,243 steps
            </Text>
          </View>
        </View>

        {/* Calendar Section */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardSurface }]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Calendar of Events
            </Text>
            <TouchableOpacity>
              <ChevronRight size={20} color={currentTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.calendarNavigation}>
            <Text style={[styles.calendarMonth, { color: currentTheme.colors.text }]}>
              May
            </Text>
            <TouchableOpacity>
              <ChevronRight size={16} color={currentTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGrid}>
            {/* Days of week */}
            <View style={styles.calendarDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={[styles.calendarDay, { color: currentTheme.colors.textSecondary }]}>
                  {day}
                </Text>
              ))}
            </View>
            
            {/* Calendar dates */}
            <View style={styles.calendarDates}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                <View key={date} style={styles.calendarDate}>
                  <Text style={[styles.calendarDateText, { color: currentTheme.colors.text }]}>
                    {date}
                  </Text>
                  {date === 5 && (
                    <View style={[styles.calendarEvent, { backgroundColor: selectedColor }]} />
                  )}
                  {date === 10 && (
                    <Rocket size={16} color={selectedColor} style={styles.calendarIcon} />
                  )}
                  {date === 17 && (
                    <Leaf size={16} color={selectedColor} style={styles.calendarIcon} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* DogBot Card */}
          <View style={[styles.dogBotCard, { backgroundColor: currentTheme.colors.background }]}>
            <View style={[styles.dogBotAvatar, { backgroundColor: selectedColor }]}>
              <PawPrint size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.dogBotText, { color: currentTheme.colors.text }]}>
              DogBot
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={[styles.bottomActions, { backgroundColor: currentTheme.colors.cardSurface }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: currentTheme.colors.cardSurface }]}
          onPress={() => navigation.navigate('PetMarket', { petId: pet.id })}
        >
          <Briefcase size={24} color={selectedColor} />
          <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>
            Market
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: currentTheme.colors.cardSurface }]}
          onPress={() => navigation.navigate('PetCommunity', { petId: pet.id })}
        >
          <Users size={24} color={selectedColor} />
          <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addWeightButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightGraphContainer: {
    backgroundColor: 'transparent',
  },

  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  stepsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  calendarGrid: {
    marginBottom: 16,
  },
  calendarDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDate: {
    width: `${100 / 7}%`,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDateText: {
    fontSize: 14,
  },
  calendarEvent: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  calendarIcon: {
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
  dogBotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  dogBotAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dogBotText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PetDetailScreen;
