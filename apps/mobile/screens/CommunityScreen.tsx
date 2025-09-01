import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { 
  Bell, 
  User, 
  Plus, 
  Heart, 
  MessageCircle, 
  MapPin,
  PawPrint,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '../ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const CommunityScreen: React.FC = () => {
  const { currentTheme, selectedColor } = useTheme();
  const [activeTab, setActiveTab] = useState('Friends');

  const tabs = ['Friends', 'Local', 'Global'];

  const avatars = [
    { id: 1, image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=100&h=100&fit=crop', name: 'Rocky' },
    { id: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop', name: 'Luna' },
    { id: 3, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop', name: 'Max' },
    { id: 4, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=100&h=100&fit=crop', name: 'Whiskers' },
    { id: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', name: 'Alex' },
    { id: 6, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop', name: 'Buddy' },
  ];

  const posts = [
    {
      id: 1,
      owner: 'Alex',
      pet: 'Rocky',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=300&h=200&fit=crop',
      description: 'Rocky disfrutando su paseo 🐶',
      likes: 23,
      comments: 5,
    },
    {
      id: 2,
      owner: 'Maria',
      pet: 'Luna',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop',
      description: 'Luna recibiendo mimos 😻',
      likes: 15,
      comments: 3,
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Adoption Day',
      date: 'SAT, MAY 11',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=120&fit=crop',
    },
    {
      id: 2,
      title: 'Pet Walkathon',
      date: 'SUN, JUN 2',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=120&fit=crop',
    },
    {
      id: 3,
      title: 'Training Workshop',
      date: 'SAT, JUN 15',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=120&fit=crop',
    },
  ];

  const trendingPets = [
    { id: 1, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=80&h=80&fit=crop' },
    { id: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=80&h=80&fit=crop' },
    { id: 3, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=80&h=80&fit=crop' },
    { id: 4, image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=80&h=80&fit=crop' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Community
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }}
              style={[styles.avatar, { borderColor: currentTheme.colors.border }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor: activeTab === tab ? selectedColor : currentTheme.colors.cardSurface,
                    borderColor: currentTheme.colors.border,
                  }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === tab ? '#FFFFFF' : currentTheme.colors.text,
                    }
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: selectedColor }]}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Avatar Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.avatarScroll}
          contentContainerStyle={styles.avatarScrollContent}
        >
          {avatars.map((avatar) => (
            <TouchableOpacity key={avatar.id} style={styles.avatarItem}>
              <Image
                source={{ uri: avatar.image }}
                style={[styles.avatarImage, { borderColor: currentTheme.colors.border }]}
              />
              <Text style={[styles.avatarName, { color: currentTheme.colors.textSecondary }]}>
                {avatar.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Content Cards */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={[styles.postCard, { backgroundColor: currentTheme.colors.cardSurface }]}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <View style={styles.postContent}>
                <Text style={[styles.postTitle, { color: currentTheme.colors.text }]}>
                  {post.owner} & {post.pet}
                </Text>
                <Text style={[styles.postDescription, { color: currentTheme.colors.text }]}>
                  {post.description}
                </Text>
                <View style={styles.postActions}>
                  <View style={styles.actionItem}>
                    <Heart size={16} color={selectedColor} />
                    <Text style={[styles.actionText, { color: currentTheme.colors.textSecondary }]}>
                      {post.likes}
                    </Text>
                  </View>
                  <View style={styles.actionItem}>
                    <MessageCircle size={16} color={currentTheme.colors.textSecondary} />
                    <Text style={[styles.actionText, { color: currentTheme.colors.textSecondary }]}>
                      {post.comments}
                    </Text>
                  </View>
                  <PawPrint size={16} color={selectedColor} style={styles.pawIcon} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Next Community Event */}
        <View style={[styles.eventBanner, { backgroundColor: selectedColor }]}>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Next Community Event</Text>
            <Text style={styles.eventDescription}>Playdate in the park on Saturday</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Upcoming Events
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.eventsScroll}
            contentContainerStyle={styles.eventsScrollContent}
          >
            {events.map((event) => (
              <View key={event.id} style={[styles.eventCard, { backgroundColor: currentTheme.colors.cardSurface }]}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventCardContent}>
                  <Text style={[styles.eventCardTitle, { color: currentTheme.colors.text }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventCardDate, { color: currentTheme.colors.textSecondary }]}>
                    {event.date}
                  </Text>
                  <TouchableOpacity style={[styles.eventJoinButton, { backgroundColor: selectedColor }]}>
                    <Text style={styles.eventJoinButtonText}>Join</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending Posts */}
        <View style={styles.trendingSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Trending Posts
          </Text>
          <Text style={[styles.sectionSubtitle, { color: currentTheme.colors.textSecondary }]}>
            Most liked posts
          </Text>
          <View style={[styles.mapContainer, { backgroundColor: currentTheme.colors.cardSurface }]}>
            <View style={styles.mapBackground}>
              {/* Map pins */}
              <MapPin size={16} color={selectedColor} style={styles.mapPin1} />
              <MapPin size={16} color={selectedColor} style={styles.mapPin2} />
              <MapPin size={16} color={selectedColor} style={styles.mapPin3} />
              <PawPrint size={12} color={selectedColor} style={styles.mapPaw1} />
              <PawPrint size={12} color={selectedColor} style={styles.mapPaw2} />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.trendingScroll}
              contentContainerStyle={styles.trendingScrollContent}
            >
              {trendingPets.map((pet) => (
                <Image key={pet.id} source={{ uri: pet.image }} style={styles.trendingPetImage} />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    padding: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  content: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarScroll: {
    marginBottom: 20,
  },
  avatarScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  avatarItem: {
    alignItems: 'center',
    gap: 4,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '500',
  },
  postsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  postCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pawIcon: {
    marginLeft: 'auto',
  },
  eventBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  eventsScroll: {
    marginBottom: 8,
  },
  eventsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventCardContent: {
    padding: 12,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventCardDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  eventJoinButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  eventJoinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  trendingSection: {
    marginBottom: 20,
  },
  mapContainer: {
    marginHorizontal: 20,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    opacity: 0.3,
  },
  mapPin1: {
    position: 'absolute',
    top: 20,
    left: 30,
  },
  mapPin2: {
    position: 'absolute',
    top: 60,
    right: 40,
  },
  mapPin3: {
    position: 'absolute',
    bottom: 30,
    left: 60,
  },
  mapPaw1: {
    position: 'absolute',
    top: 40,
    right: 80,
  },
  mapPaw2: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  trendingScroll: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  trendingScrollContent: {
    gap: 8,
  },
  trendingPetImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default CommunityScreen;
