import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { 
  Activity, 
  Bell, 
  MapPin, 
  Home, 
  Calendar, 
  Users, 
  User, 
  Heart, 
  PawPrint, 
  Image as ImageIcon,
  Edit,
  Syringe,
  ShoppingCart
} from 'lucide-react-native';
import { defaultTheme, Theme } from './theme';
import ProfileScreen from './screens/ProfileScreen';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { defaultColor } from './colorConfig';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import PetGalleryScreen from './screens/PetGalleryScreen';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeSkeleton, AvatarSkeleton } from './components/Skeleton';
import { UserService } from './services/userService';
import { AlbumService } from './services/albumService';

const petAlbums = [
  {
    title: 'London Walk',
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop',
    photoCount: 10,
  },
  {
    title: 'Vet Visit',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
    photoCount: 3,
  },
  {
    title: 'Park Day',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    photoCount: 7,
  },
  {
    title: 'Rocky\'s Birthday',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop',
    photoCount: 15,
  },
];

const nearbyVets = [
  {
    id: 1,
    name: "PetCare Veterinary Clinic",
    distance: "0.8 km",
    rating: 4.8,
    coordinate: { latitude: 34.0522, longitude: -118.2437 },
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    name: "Animal Hospital Center",
    distance: "1.2 km",
    rating: 4.6,
    coordinate: { latitude: 34.0582, longitude: -118.2487 },
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    name: "VetCare Express",
    distance: "1.5 km",
    rating: 4.9,
    coordinate: { latitude: 34.0462, longitude: -118.2387 },
    phone: "+1 (555) 345-6789"
  }
];

// Hook para detectar la barra de navegación del sistema en Android
function useNavigationBarDetection() {
  const [hasNavigationBar, setHasNavigationBar] = useState(false);
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);

  useEffect(() => {
    const checkNavigationBar = () => {
      if (Platform.OS === 'android') {
        try {
          // Obtener información del dispositivo usando solo APIs nativas
          const screenHeight = Dimensions.get('window').height;
          const screenWidth = Dimensions.get('window').width;
          const pixelRatio = Dimensions.get('window').scale;
          
          // Calcular relación de aspecto
          const aspectRatio = screenHeight / screenWidth;
          
          // En Android, dispositivos con relación de aspecto menor a 2.0 
          // típicamente tienen barra de navegación
          const likelyHasNavBar = aspectRatio < 2.0;
          
          // Altura aproximada de la barra de navegación (48dp = ~24px en densidad media)
          const estimatedNavBarHeight = likelyHasNavBar ? 24 : 0;
          
          setHasNavigationBar(likelyHasNavBar);
          setNavigationBarHeight(estimatedNavBarHeight);
          
          console.log('Navigation bar detection (Expo Go compatible):', {
            screenHeight,
            screenWidth,
            pixelRatio,
            aspectRatio,
            likelyHasNavBar,
            estimatedNavBarHeight
          });
        } catch (error) {
          console.log('Error detecting navigation bar:', error);
          // Por defecto, asumir que tiene barra de navegación en Android
          setHasNavigationBar(true);
          setNavigationBarHeight(24);
        }
      }
    };

    checkNavigationBar();
  }, []);

  return { hasNavigationBar, navigationBarHeight };
}

function HomeScreen({ navigation }: any) {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [selectedAlbum, setSelectedAlbum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredAlbums, setFeaturedAlbums] = useState<any[]>([]);
  const [albumPhotoCounts, setAlbumPhotoCounts] = useState<{[key: string]: number}>({});
  const { hasNavigationBar, navigationBarHeight } = useNavigationBarDetection();

  const styles = createStyles(currentTheme);

  // Function to get dynamic color based on selected color
  const getDynamicColor = () => {
    return selectedColor;
  };

  // Obtener álbumes para mostrar (destacados reales o de ejemplo)
  const getDisplayAlbums = () => {
    if (featuredAlbums.length > 0) {
      // Transformar álbumes reales al formato esperado
      return featuredAlbums.map((album) => ({
        id: album.id,
        title: album.title,
        image: album.cover_image_url || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop',
        photoCount: albumPhotoCounts[album.id] || 0,
        albumData: album, // Datos completos del álbum para navegación
      }));
    }
    // Fallback a álbumes de ejemplo si no hay destacados
    return petAlbums;
  };

  const navigateToGallery = () => {
    navigation.navigate('Gallery');
  };

  // Navegar a un álbum específico
  const navigateToAlbum = (albumData: any) => {
    navigation.navigate('Gallery', { 
      selectedAlbum: albumData,
      openAlbumDetail: true 
    });
  };

  // Cargar álbumes destacados
  const loadFeaturedAlbums = async () => {
    try {
      if (user?.id) {
        const albums = await AlbumService.getUserAlbums(user.id);
        const featured = albums.filter(album => album.is_featured);
        setFeaturedAlbums(featured);
        
        // Cargar conteo de fotos para cada álbum destacado
        await loadAlbumPhotoCounts(featured);
      }
    } catch (error) {
      console.error('Error loading featured albums:', error);
    }
  };

  // Cargar conteo de fotos para álbumes
  const loadAlbumPhotoCounts = async (albums: any[]) => {
    try {
      const { PhotoService } = await import('./services/photoService');
      const counts: {[key: string]: number} = {};
      
      for (const album of albums) {
        try {
          const photos = await PhotoService.getPhotosByAlbum(album.id);
          counts[album.id] = photos.length;
        } catch (error) {
          console.error(`Error loading photos for album ${album.id}:`, error);
          counts[album.id] = 0;
        }
      }
      
      setAlbumPhotoCounts(counts);
    } catch (error) {
      console.error('Error loading album photo counts:', error);
    }
  };

  // Simular carga de datos
  useEffect(() => {
    const loadData = async () => {
      await loadFeaturedAlbums();
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Mostrar skeleton por 2 segundos

      return () => clearTimeout(timer);
    };
    
    loadData();
  }, []);

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
                   <LinearGradient
               colors={[`${getDynamicColor()}08`, '#f8f9fa']}
               start={{ x: 0, y: 0 }}
               end={{ x: 0, y: 1 }}
               style={styles.container}
             >
        <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.headerGlass}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoIcon, { backgroundColor: `${getDynamicColor()}20` }]}>
                  <Image 
                    source={require('./assets/icon.png')} 
                    style={styles.logoImage} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.appName}>Peluditos</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.notificationButton}
                  onPress={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 2000);
                  }}
                >
                  <View style={styles.notificationIconContainer}>
                    <Bell size={22} color={getDynamicColor()} />
                    <View style={[styles.notificationBadge, { backgroundColor: getDynamicColor() }]}>
                      <Text style={styles.notificationCount}>3</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  {user?.user_metadata?.avatar_url ? (
                    <Image 
                      source={{ uri: user.user_metadata.avatar_url }} 
                      style={styles.profilePic} 
                    />
                  ) : (
                    <View style={[styles.profilePic, { backgroundColor: getDynamicColor(), justifyContent: 'center', alignItems: 'center' }]}>
                      <User size={20} color="#ffffff" />
                    </View>
                  )}
                  <View style={styles.profileIndicator} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

                       {/* Pet Card */}
               <LinearGradient
                 colors={[`${getDynamicColor()}20`, getDynamicColor()]}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
                 style={styles.petCardGradient}
               >
                 <View style={styles.avatarContainer}>
                   <Image 
                     source={{ uri: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop' }} 
                     style={styles.petImage} 
                   />
                   <TouchableOpacity style={[styles.editButton, { backgroundColor: getDynamicColor() }]}>
                     <Edit size={16} color="#ffffff" />
                   </TouchableOpacity>
                 </View>
                 <View style={styles.petInfo}>
                   <Text style={styles.petName}>Rocky</Text>
                   <Text style={styles.petStatus}>Happy today</Text>
                   <Text style={styles.petDetails}>6 years - Canino</Text>
                 </View>
               </LinearGradient>

        {/* Clinical History */}
        <View style={styles.clinicalHistorySection}>
          <View style={styles.sectionHeader}>
                               <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                     <FontAwesome5 name="notes-medical" size={24} color="#ffffff" />
                   </View>
            <Text style={[styles.sectionTitle, { color: getDynamicColor() }]}>Clinical History</Text>
          </View>
          <View style={styles.historyList}>
                                 <TouchableOpacity style={[styles.historyItem, { borderBottomColor: getDynamicColor() }]}>
                       <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                         <FontAwesome5 name="syringe" size={16} color="#ffffff" />
                       </View>
                       <View style={styles.historyContent}>
                         <Text style={[styles.historyTitle, { color: getDynamicColor() }]}>Vaccination</Text>
                         <Text style={styles.historyDate}>March 15, 2024</Text>
                       </View>
                       <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
                     </TouchableOpacity>
                                 <TouchableOpacity style={[styles.historyItem, { borderBottomColor: getDynamicColor() }]}>
                       <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                         <FontAwesome5 name="stethoscope" size={16} color="#ffffff" />
                       </View>
                       <View style={styles.historyContent}>
                         <Text style={[styles.historyTitle, { color: getDynamicColor() }]}>Check-up</Text>
                         <Text style={styles.historyDate}>February 28, 2024</Text>
                       </View>
                       <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
                     </TouchableOpacity>
            <TouchableOpacity style={[styles.historyItem, styles.lastHistoryItem]}>
              <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                <FontAwesome5 name="pills" size={16} color="#ffffff" />
              </View>
              <View style={styles.historyContent}>
                <Text style={[styles.historyTitle, { color: getDynamicColor() }]}>Deworming</Text>
                <Text style={styles.historyDate}>January 10, 2024</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Summary */}
                         <View style={styles.sectionHeader}>
                   <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                     <FontAwesome5 name="chart-line" size={20} color="#ffffff" />
                   </View>
                   <Text style={[styles.sectionTitle, { color: getDynamicColor() }]}>Today's Summary</Text>
                 </View>
        <View style={styles.summary}>
          <View style={styles.stepsCard}>
                              <Activity size={24} color={getDynamicColor()} />
            <View style={styles.stepsTextContainer}>
              <Text style={styles.stepsValue}>4,567 steps</Text>
              <Text style={styles.stepsLabel}>latest walk</Text>
            </View>
          </View>
          <View style={styles.vaccineCard}>
                            <Syringe size={24} color={getDynamicColor()} />
            <View style={styles.vaccineTextContainer}>
              <Text style={styles.vaccineValue}>Next vaccine</Text>
              <Text style={styles.vaccineLabel}>3 days</Text>
            </View>
          </View>
        </View>

                       {/* Events */}
               <View style={styles.eventsSection}>
                 <View style={styles.sectionHeader}>
                   <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                     <FontAwesome5 name="calendar-alt" size={20} color="#ffffff" />
                   </View>
                   <Text style={[styles.sectionTitle, { color: getDynamicColor() }]}>Upcoming Events</Text>
                 </View>
                 <View style={styles.eventsList}>
                                        <TouchableOpacity style={[styles.eventItem, { borderBottomColor: getDynamicColor() }]}>
                       <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                         <FontAwesome5 name="dog" size={16} color="#ffffff" />
                       </View>
                       <View style={styles.eventContent}>
                         <Text style={[styles.eventTitle, { color: getDynamicColor() }]}>Dog Training Class</Text>
                         <Text style={styles.eventDate}>Tomorrow, 3:00 PM</Text>
                       </View>
                       <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
                     </TouchableOpacity>
                   <TouchableOpacity style={[styles.eventItem, { borderBottomColor: getDynamicColor() }]}>
                     <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                       <FontAwesome5 name="heartbeat" size={16} color="#ffffff" />
                     </View>
                     <View style={styles.eventContent}>
                       <Text style={[styles.eventTitle, { color: getDynamicColor() }]}>Vaccination Appointment</Text>
                       <Text style={styles.eventDate}>Friday, 10:00 AM</Text>
                     </View>
                     <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.eventItem, styles.lastEventItem]}>
                     <View style={[styles.historyIconCircle, { backgroundColor: getDynamicColor() }]}>
                       <FontAwesome5 name="cut" size={16} color="#ffffff" />
                     </View>
                     <View style={styles.eventContent}>
                       <Text style={[styles.eventTitle, { color: getDynamicColor() }]}>Grooming Session</Text>
                       <Text style={styles.eventDate}>Next Monday, 2:00 PM</Text>
                     </View>
                     <FontAwesome5 name="chevron-right" size={16} color={getDynamicColor()} />
                   </TouchableOpacity>
                 </View>
               </View>

               {/* Nearby Veterinarians */}
               <View style={styles.nearbyVetsSection}>
                 <View style={styles.sectionHeader}>
                   <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                     <MapPin size={20} color="#ffffff" />
                   </View>
                   <Text style={[styles.sectionTitle, { color: getDynamicColor() }]}>Nearby Veterinarians</Text>
                 </View>
                 <View style={styles.mapContainer}>
                   <View style={styles.mapImageContainer}>
                     <Image
                       source={require('./assets/7db8a3f6-428b-4243-af80-7a64b0899528.png')}
                       style={styles.mapImage}
                       resizeMode="cover"
                     />

                     <View style={styles.mapInfo}>
                       <Text style={styles.mapInfoText}>3 veterinarians nearby</Text>
                     </View>
                   </View>
                 </View>
               </View>

               {/* Tips */}
               <View style={styles.tipOuterContainer}>
                 <View style={styles.tipHeader}>
                   <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                     <FontAwesome5 name="lightbulb" size={20} color="#ffffff" />
                   </View>
                   <Text style={[styles.tipTitle, { color: currentTheme.colors.text }]}>Daily Tip</Text>
                 </View>
                 <View style={[styles.tipInnerCard, { backgroundColor: `${getDynamicColor()}45` }]}>
                   <Text style={styles.tipText}>🐾 How to calm a nervous dog</Text>
                   <View style={styles.tipsList}>
                     <Text style={styles.tipItem}>• Create a safe space with familiar toys</Text>
                     <Text style={styles.tipItem}>• Use gentle petting and soft voice</Text>
                     <Text style={styles.tipItem}>• Try calming music or white noise</Text>
                   </View>
                   <TouchableOpacity style={styles.askMoreButton}>
                     <Text style={styles.askMoreText}>Ask for more tips</Text>
                   </TouchableOpacity>
                 </View>
               </View>

               {/* Pet Photos */}
               <View style={styles.gallerySection}>
                 <View style={styles.galleryHeader}>
                   <View style={styles.titleContainer}>
                                            <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                         <FontAwesome5 name="images" size={20} color="#ffffff" />
                       </View>
                     <Text style={[styles.galleryTitle, { color: getDynamicColor() }]}>Pet Photos</Text>
                   </View>
                   <TouchableOpacity onPress={navigateToGallery}>
                     <Text style={styles.seeAllText}>See all</Text>
                   </TouchableOpacity>
                 </View>
                 <View style={styles.albumContainer}>
                   <View style={styles.albumInfo}>
                     <Text style={[styles.albumTitle, { color: getDynamicColor() }]}>{getDisplayAlbums()[selectedAlbum]?.title || 'No featured albums'}</Text>
                     <View style={[styles.photoCountBadge, { backgroundColor: getDynamicColor() }]}>
                       <FontAwesome5 name="images" size={12} color="#ffffff" />
                       <Text style={styles.photoCountText}>{getDisplayAlbums()[selectedAlbum]?.photoCount || 0} photos</Text>
                     </View>
                   </View>
                   <FlatList
                     horizontal
                     data={getDisplayAlbums()}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, index }) => (
                       <TouchableOpacity 
                         style={[
                           styles.albumPage, 
                           selectedAlbum === index && [styles.selectedAlbumPage, { borderColor: getDynamicColor() }]
                         ]}
                         onPress={() => {
                           if (selectedAlbum === index) {
                             // Si ya está seleccionado, navegar al álbum
                             if ('albumData' in item && item.albumData) {
                               navigateToAlbum(item.albumData);
                             }
                           } else {
                             // Si no está seleccionado, seleccionarlo
                             setSelectedAlbum(index);
                           }
                         }}
                         onLongPress={() => {
                           // Long press siempre navega al álbum
                           if ('albumData' in item && item.albumData) {
                             navigateToAlbum(item.albumData);
                           }
                         }}
                       >
                         <Image source={{ uri: item.image }} style={styles.albumImage} />
                         <View style={[styles.albumBadge, { backgroundColor: getDynamicColor() }]}>
                           <Text style={styles.albumBadgeText}>{item.photoCount}</Text>
                         </View>
                         <View style={styles.albumTitleOverlay}>
                           <Text style={[styles.albumTitleText, { color: getDynamicColor() }]}>{item.title}</Text>
                         </View>
                       </TouchableOpacity>
                     )}
                     style={styles.gallery}
                     showsHorizontalScrollIndicator={false}
                     nestedScrollEnabled={false}
                     scrollEnabled={true}
                     ListEmptyComponent={
                       <View style={styles.emptyAlbumsContainer}>
                         <Text style={[styles.emptyAlbumsText, { color: currentTheme.colors.textSecondary }]}>
                           No featured albums yet
                         </Text>
                       </View>
                     }
                   />
                 </View>
               </View>
              </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Tab Navigation Component
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { currentTheme, selectedColor } = useTheme();
  const { hasNavigationBar, navigationBarHeight } = useNavigationBarDetection();
  const insets = useSafeAreaInsets();
  
  // Opción para ajuste manual - puedes cambiar esto si la detección automática no funciona
  const manualNavigationBarAdjustment = 20; // Ajustado a 20 para subirlo un poco más
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: selectedColor,
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: currentTheme.colors.background,
          borderTopWidth: 1,
          borderTopColor: currentTheme.colors.border,
          paddingBottom: Platform.OS === 'android' && hasNavigationBar ? 10 + navigationBarHeight + manualNavigationBarAdjustment : 10,
          paddingTop: 10,
          height: Platform.OS === 'android' && hasNavigationBar ? 80 + navigationBarHeight + manualNavigationBarAdjustment : 80,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        }
      }}
    >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Home size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Agenda" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Calendar size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Gallery" 
          component={PetGalleryScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <ImageIcon size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Community" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Users size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Marketplace" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <ShoppingCart size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack} 
          options={{ 
            tabBarIcon: ({ color }) => <User size={20} color={color} /> 
          }} 
        />
      </Tab.Navigator>
    );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Dynamic styles function
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    padding: Platform.OS === 'android' ? 16 : 20,
    paddingBottom: 40, // Reduced padding to eliminate excess space
  },
  headerContainer: {
    marginBottom: 24,
    marginHorizontal: Platform.OS === 'android' ? -16 : -20,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  headerGlass: {
    // Sin card, solo layout
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(101, 182, 173, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#65b6ad',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  appName: { 
    fontSize: 24, 
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    position: 'relative',
    marginRight: 8,
  },
  profilePic: { 
    width: 36, 
    height: 36, 
    borderRadius: 18,
  },
  petCard: { 
    flexDirection: 'row', 
    borderRadius: 20, 
    padding: Platform.OS === 'android' ? 28 : 24, // Más padding en Android para las sombras
    alignItems: 'center', 
    marginBottom: 24,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
    ...(Platform.OS === 'android' ? {
      elevation: 8,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }),
    // Gradient effect with overlay
    position: 'relative',
  },
  petCardGradient: { 
    flexDirection: 'row', 
    borderRadius: 20, 
    padding: Platform.OS === 'android' ? 28 : 24, // Más padding en Android para las sombras
    alignItems: 'center', 
    marginBottom: 24,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
    // Gradient effect with overlay
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  petImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 28, 
    borderWidth: Platform.OS === 'android' ? 2 : 4,
    borderColor: Platform.OS === 'android' ? '#ffffff' : theme.colors.background,
    transform: Platform.OS === 'android' ? [] : [{ rotate: '3deg' }],
    ...(Platform.OS === 'android' ? {
      elevation: 8,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    }),
  },
  editButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 2 : -2,
    right: Platform.OS === 'android' ? 2 : -2,
    backgroundColor: defaultColor, // More vibrant green
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Platform.OS === 'android' ? 2 : 3,
    borderColor: '#ffffff',
    ...(Platform.OS === 'android' ? {
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    }),
  },
  petInfo: {
    flex: 1,
    marginLeft: 16, // Add space between image and text
  },
  petName: { 
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#142725',
    marginBottom: 4,
  },
  petStatus: {
    fontSize: 16,
    color: '#142725',
  },
  petDetails: {
    fontSize: 14,
    color: '#142725',
    marginTop: 4,
  },
  summary: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    gap: 16,
  },
  stepsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    flex: 1,
    ...(Platform.OS === 'android' ? {
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
    }),
  },
  stepsTextContainer: {
    flex: 1,
  },
  stepsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  stepsLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    flex: 1,
    ...(Platform.OS === 'android' ? {
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
    }),
  },
  vaccineTextContainer: {
    flex: 1,
  },
  vaccineValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  vaccineLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tipOuterContainer: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32, // Increased spacing
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
  },
  eventsSection: {
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    marginBottom: 32,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
    ...(Platform.OS === 'android' ? {
      elevation: 8,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  eventsList: {
    marginTop: 16,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardSurface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: defaultColor,
  },
  lastEventItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  eventIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d0e8e4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#65b6ad',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  tipInnerCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  tipText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  clinicalHistorySection: {
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24, // Add side padding for title
    marginBottom: 32, // Increased spacing
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
    ...(Platform.OS === 'android' ? {
      elevation: 8,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColor,
  },
  historyList: {
    gap: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardSurface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: defaultColor,
  },
  historyIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#65b6ad',
  },
  historyDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  gallerySection: {
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginBottom: 32,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0, // Margen horizontal en Android
    ...(Platform.OS === 'android' ? {
      elevation: 10,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    }),
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'left',
  },
  seeAllText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  gallery: { 
    marginBottom: 20 
  },
  albumContainer: {
    marginTop: 16,
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColor,
    marginBottom: 4,
    textAlign: 'left',
  },
  albumSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  albumPage: {
    position: 'relative',
    marginRight: 12,
    ...(Platform.OS === 'android' ? {
      elevation: 8,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    }),
  },
  selectedAlbumPage: {
    borderWidth: 3,
    borderColor: defaultColor,
    borderRadius: 12,
  },
  albumTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  albumTitleText: {
    color: defaultColor,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  albumImage: {
    width: 120,
    height: 140,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  albumPageNumber: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: defaultColor,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pageNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  galleryImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 16, 
    marginRight: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  nearbyVetsSection: {
    marginBottom: 32, // Increased spacing
  },
  mapContainer: {
    width: Dimensions.get('window').width - 40, // Account for padding
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'android' ? {
      elevation: 5,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    }),
  },
  mapImageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 3,
    ...(Platform.OS === 'android' ? {
      elevation: 3,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    }),
  },
  mapInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  mapInfoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  vetsList: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'android' ? {
      elevation: 5,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    }),
  },
  vetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  vetDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vetDistance: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 10,
  },
  vetRating: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  callButton: {
    padding: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#65b6ad', // More vibrant green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryIcon: {
    marginRight: 12,
  },
  historyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4a9b8f', // More vibrant green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lastHistoryItem: {
    borderBottomWidth: 0, // Remove bottom border
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  tipsList: {
    marginTop: 16,
    marginBottom: 20,
  },
  tipItem: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  askMoreButton: {
    backgroundColor: theme.colors.cardSurface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  askMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  albumInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: defaultColor,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  photoCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  albumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  albumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  glowIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  seeAllButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  glowPhotoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ff88',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  glowPhotoCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  glowAlbumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00ff88',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 28,
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  glowAlbumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profilePicContainer: {
    borderWidth: 3,
    borderColor: '#65b6ad',
    borderRadius: 23,
    padding: 2,
  },
  emptyAlbumsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyAlbumsText: {
    fontSize: 14,
    textAlign: 'center',
  },

});
