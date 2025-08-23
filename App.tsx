import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const petPhotos = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop',
];

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ddeee6" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>PetCare+</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#2c5530" />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop' }} 
          style={styles.profilePic} 
        />
      </View>

      {/* Pet Card */}
      <View style={styles.petCard}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop' }} 
          style={styles.petImage} 
        />
        <View style={styles.petInfo}>
          <Text style={styles.petName}>Rocky</Text>
          <Text style={styles.petStatus}>Happy today</Text>
        </View>
      </View>

      {/* Today's Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryBox}>
          <FontAwesome5 name="walking" size={24} color="#2c5530" />
          <Text style={styles.summaryText}>4,567 steps</Text>
          <Text style={styles.summarySubtext}>latest walk</Text>
        </View>
        <View style={styles.summaryBox}>
          <MaterialIcons name="vaccines" size={24} color="#2c5530" />
          <Text style={styles.summaryText}>Next vaccine</Text>
          <Text style={styles.summarySubtext}>3 days</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tip}>
        <Text style={styles.tipText}>🐾 How to calm a nervous dog</Text>
      </View>

      {/* Pet Photos */}
      <View style={styles.gallerySection}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>Pet Photos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={petPhotos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
          style={styles.gallery}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

// Tab Navigation
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{ 
          headerShown: false,
          tabBarActiveTintColor: '#2c5530',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#ddeee6',
            paddingBottom: 10,
            paddingTop: 10,
            height: 80,
          }
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Agenda" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <FontAwesome5 name="calendar" size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Community" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Marketplace" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <FontAwesome5 name="shopping-cart" size={20} color={color} /> 
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} /> 
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ddeee6',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24,
    paddingHorizontal: 5,
  },
  appName: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#2c5530'
  },
  notificationButton: {
    padding: 8,
  },
  profilePic: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  petCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 16 
  },
  petInfo: {
    flex: 1,
  },
  petName: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 4,
  },
  petStatus: {
    fontSize: 16,
    color: '#666',
  },
  summary: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    gap: 12,
  },
  summaryBox: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginTop: 8,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tip: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tipText: {
    fontSize: 16,
    color: '#2c5530',
    fontWeight: '500',
  },
  gallerySection: {
    marginBottom: 20,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530'
  },
  seeAllText: {
    fontSize: 16,
    color: '#2c5530',
    fontWeight: '500',
  },
  gallery: { 
    marginBottom: 20 
  },
  galleryImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 16, 
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
