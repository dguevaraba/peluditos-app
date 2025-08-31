import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, MessageCircle, Plus, PawPrint, Scissors, ShoppingBag, Dog, Package, Pin } from 'lucide-react-native';
import RobotDogIcon from '../components/RobotDogIcon';
import { aiService } from '../services/aiService';
import { chatService, ChatConversation } from '../services/chatService';

export default function ChatsScreen({ navigation }: any) {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [aiConversations, setAiConversations] = useState<any[]>([]);
  const [regularConversations, setRegularConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const getDynamicColor = () => selectedColor;

  // Datos de chats predeterminados
  const predeterminedChats = [
    { id: 1, name: 'Vet Clinic', icon: PawPrint, color: '#4ECDC4', description: 'Chat with veterinarians' },
    { id: 2, name: 'Grooming', icon: Scissors, color: '#FF6B6B', description: 'Chat with groomers' },
    { id: 3, name: 'Pet Shop', icon: ShoppingBag, color: '#45B7D1', description: 'Chat with pet store' },
    { id: 4, name: 'Dog Walking', icon: Dog, color: '#96CEB4', description: 'Chat with dog walkers' },
    { id: 5, name: 'Orders / Support', icon: Package, color: '#FFA07A', description: 'Chat with support' },
  ];

  // Conversaciones recientes de ejemplo
  const recentConversations = [
    {
      id: 1,
      name: 'Vet Clinic',
      lastMessage: 'Your appointment is confirmed...',
      time: '10:20 AM',
      avatar: null,
      icon: PawPrint,
      color: '#4ECDC4',
      isPinned: true,
    },
    {
      id: 2,
      name: 'Grooming Store',
      lastMessage: 'Promo: 20% OFF today...',
      time: 'Yesterday',
      avatar: null,
      icon: Scissors,
      color: '#FF6B6B',
      isPinned: false,
    },
    {
      id: 3,
      name: 'AI Assistant',
      lastMessage: 'Tips for dog food portion sizes...',
      time: 'Yesterday',
      avatar: null,
      icon: Dog,
      color: '#45B7D1',
      isPinned: false,
    },
    {
      id: 4,
      name: 'Maria',
      lastMessage: 'Thanks for the help!',
      time: 'Monday',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      icon: null,
      color: null,
      isPinned: false,
    },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const [aiConvs, regularConvs] = await Promise.all([
        aiService.getUserConversations(),
        chatService.getUserConversations()
      ]);
      setAiConversations(aiConvs);
      setRegularConversations(regularConvs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getLastMessage = (conversation: any) => {
    const messages = conversation.messages || [];
    if (messages.length === 0) return 'Nueva conversación';
    
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...' 
      : lastMessage.content;
  };

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: `${getDynamicColor()}15` }]}
      onPress={() => navigation.navigate('ChatDetail', {
        chatName: 'PetBot',
        chatType: 'ai',
        conversationId: item.id
      })}
    >
      <LinearGradient
        colors={[`${getDynamicColor()}15`, 'transparent']}
        style={styles.cardGradient}
      >
        <View style={styles.avatarContainer}>
          <RobotDogIcon size={40} color={getDynamicColor()} />
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, { color: currentTheme.colors.text }]}>
              PetBot
            </Text>
            <Text style={[styles.timestamp, { color: currentTheme.colors.textSecondary }]}>
              {formatTimestamp(item.updated_at)}
            </Text>
          </View>
          
          <Text style={[styles.lastMessage, { color: currentTheme.colors.textSecondary }]}>
            {getLastMessage(item)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRecentConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: `${getDynamicColor()}15` }]}
      onPress={() => navigation.navigate('ChatDetail', { 
        chatName: item.name, 
        chatType: 'conversation',
        conversationId: item.id 
      })}
    >
      <LinearGradient
        colors={[`${getDynamicColor()}15`, 'transparent']}
        style={styles.cardGradient}
      >
        <View style={styles.conversationAvatar}>
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={[styles.avatarImage, { borderColor: getDynamicColor() }]}
            />
          ) : (
            <View style={[styles.avatarIcon, { backgroundColor: item.color || getDynamicColor() }]}>
              {item.icon === Dog ? (
                <RobotDogIcon size={20} color="#FFFFFF" />
              ) : (
                item.icon && <item.icon size={20} color="#FFFFFF" />
              )}
            </View>
          )}
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, { color: currentTheme.colors.text }]}>
              {item.name}
            </Text>
            <View style={styles.conversationTimeContainer}>
              {item.isPinned && (
                <Pin size={12} color={getDynamicColor()} style={styles.pinIcon} />
              )}
              <Text style={[styles.conversationTime, { color: currentTheme.colors.textSecondary }]}>
                {item.time}
              </Text>
            </View>
          </View>
          <Text style={[styles.conversationMessage, { color: currentTheme.colors.textSecondary }]}>
            {item.lastMessage}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRegularConversation = (conversation: ChatConversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={[styles.conversationItem, { backgroundColor: `${getDynamicColor()}15` }]}
      onPress={() => navigation.navigate('ChatDetail', {
        chatName: conversation.title || conversation.category?.display_name || 'Chat',
        chatType: 'conversation',
        conversationId: conversation.id,
        category: conversation.category,
      })}
    >
      <LinearGradient
        colors={[`${getDynamicColor()}15`, 'transparent']}
        style={styles.cardGradient}
      >
        <View style={styles.conversationAvatar}>
          <View style={[styles.avatarIcon, { backgroundColor: conversation.category?.color || getDynamicColor() }]}>
            {/* Aquí podríamos renderizar el icono basado en conversation.category.icon_name */}
            <MessageCircle size={20} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, { color: currentTheme.colors.text }]}>
              {conversation.title || conversation.category?.display_name || 'Chat'}
            </Text>
            <Text style={[styles.timestamp, { color: currentTheme.colors.textSecondary }]}>
              {formatTimestamp(conversation.updated_at)}
            </Text>
          </View>
          <Text style={[styles.lastMessage, { color: currentTheme.colors.textSecondary }]}>
            {getLastMessage(conversation)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                <MessageCircle size={24} color="#ffffff" />
              </View>
              <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                Chats
              </Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>
              Chat with services and PetBot
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* AI Chat Banner */}
          <TouchableOpacity
            style={[styles.aiBanner, { backgroundColor: getDynamicColor() }]}
            onPress={() => navigation.navigate('ChatDetail', {
              chatName: 'PetBot',
              chatType: 'ai'
            })}
          >
            <LinearGradient
              colors={[getDynamicColor(), `${getDynamicColor()}dd`]}
              style={styles.aiBannerGradient}
            >
              <View style={styles.aiBannerContent}>
                <RobotDogIcon size={48} color="white" />
                <View style={styles.aiBannerText}>
                  <Text style={styles.aiBannerTitle}>Chat with PetBot</Text>
                  <Text style={styles.aiBannerSubtitle}>
                    Your AI pet assistant
                  </Text>
                </View>
              </View>
              <MessageCircle size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Recent Conversations */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Recent Conversations
            </Text>
            <View style={styles.conversationsList}>
              {recentConversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={[styles.conversationItem, { backgroundColor: `${getDynamicColor()}15` }]}
                  onPress={() => navigation.navigate('ChatDetail', { 
                    chatName: conversation.name, 
                    chatType: 'conversation',
                    conversationId: conversation.id 
                  })}
                >
                  <LinearGradient
                    colors={[`${getDynamicColor()}15`, 'transparent']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.conversationAvatar}>
                      {conversation.avatar ? (
                        <Image
                          source={{ uri: conversation.avatar }}
                          style={[styles.avatarImage, { borderColor: getDynamicColor() }]}
                        />
                      ) : (
                        <View style={[styles.avatarIcon, { backgroundColor: conversation.color || getDynamicColor() }]}>
                          {conversation.icon === Dog ? (
                            <RobotDogIcon size={20} color="#FFFFFF" />
                          ) : (
                            conversation.icon && <conversation.icon size={20} color="#FFFFFF" />
                          )}
                        </View>
                      )}
                    </View>
                    <View style={styles.conversationContent}>
                      <View style={styles.conversationHeader}>
                        <Text style={[styles.conversationName, { color: currentTheme.colors.text }]}>
                          {conversation.name}
                        </Text>
                        <View style={styles.conversationTimeContainer}>
                          {conversation.isPinned && (
                            <Pin size={12} color={getDynamicColor()} style={styles.pinIcon} />
                          )}
                          <Text style={[styles.conversationTime, { color: currentTheme.colors.textSecondary }]}>
                            {conversation.time}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.conversationMessage, { color: currentTheme.colors.textSecondary }]}>
                        {conversation.lastMessage}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* AI Conversations */}
          {aiConversations.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                PetBot Conversations
              </Text>
              {aiConversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={[styles.conversationItem, { backgroundColor: `${getDynamicColor()}15` }]}
                  onPress={() => navigation.navigate('ChatDetail', {
                    chatName: 'PetBot',
                    chatType: 'ai',
                    conversationId: conversation.id
                  })}
                >
                  <LinearGradient
                    colors={[`${getDynamicColor()}15`, 'transparent']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.avatarContainer}>
                      <RobotDogIcon size={40} color={getDynamicColor()} />
                    </View>
                    
                    <View style={styles.conversationContent}>
                      <View style={styles.conversationHeader}>
                        <Text style={[styles.conversationName, { color: currentTheme.colors.text }]}>
                          PetBot
                        </Text>
                        <Text style={[styles.timestamp, { color: currentTheme.colors.textSecondary }]}>
                          {formatTimestamp(conversation.updated_at)}
                        </Text>
                      </View>
                      
                      <Text style={[styles.lastMessage, { color: currentTheme.colors.textSecondary }]}>
                        {getLastMessage(conversation)}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Regular Conversations */}
          {regularConversations.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                My Service Chats
              </Text>
              <View style={styles.conversationsList}>
                {regularConversations.map(renderRegularConversation)}
              </View>
            </View>
          )}

          {/* Available Services */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Available Services
            </Text>
            <View style={[styles.servicesGrid, { paddingHorizontal: 20 }]}>
              {predeterminedChats.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={[styles.serviceCard, { backgroundColor: `${getDynamicColor()}15` }]}
                  onPress={() => navigation.navigate('ChatDetail', { 
                    chatName: chat.name, 
                    chatType: 'service' 
                  })}
                >
                  <LinearGradient
                    colors={[`${getDynamicColor()}15`, 'transparent']}
                    style={styles.serviceGradient}
                  >
                    <View style={[styles.serviceIconContainer, { backgroundColor: chat.color }]}>
                      <chat.icon size={28} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.serviceName, { color: currentTheme.colors.text }]}>
                      {chat.name}
                    </Text>
                    <Text style={[styles.serviceDescription, { color: currentTheme.colors.textSecondary }]}>
                      {chat.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity 
          style={[styles.floatingAddButton, { backgroundColor: getDynamicColor() }]}
          onPress={() => navigation.navigate('CreateChat')}
        >
          <Plus size={28} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  aiBanner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aiBannerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiBannerText: {
    marginLeft: 16,
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  aiBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  conversationsList: {
    paddingHorizontal: 20,
  },
  conversationItem: {
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
  },
  avatarContainer: {
    marginRight: 12,
    flexShrink: 0,
  },
  conversationAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  avatarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  conversationTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 4,
  },
  conversationTime: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  conversationMessage: {
    fontSize: 14,
    lineHeight: 18,
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    width: '47%',
    aspectRatio: 1.1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  serviceGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.8,
  },
});
