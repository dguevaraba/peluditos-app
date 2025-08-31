import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Plus, Users } from 'lucide-react-native';
import VetClinicIcon from '../components/VetClinicIcon';
import DogWalkingIcon from '../components/DogWalkingIcon';
import OrderSupportIcon from '../components/OrderSupportIcon';
import PetShopIcon from '../components/PetShopIcon';
import GroomingIcon from '../components/GroomingIcon';
import { chatService, ChatCategory } from '../services/chatService';

const iconMap: { [key: string]: any } = {
  VetClinicIcon,
  GroomingIcon,
  PetShopIcon,
  DogWalkingIcon,
  OrderSupportIcon,
  Users,
};

export default function CreateChatScreen({ navigation, route }: any) {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const [categories, setCategories] = useState<ChatCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | null>(null);
  const [chatTitle, setChatTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const getDynamicColor = () => selectedColor;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const chatCategories = await chatService.getChatCategories();
      setCategories(chatCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    try {
      const conversationData = {
        category_id: selectedCategory.id,
        title: chatTitle || selectedCategory.display_name,
      };

      const newConversation = await chatService.createConversation(conversationData);
      
      navigation.replace('ChatDetail', {
        chatName: newConversation.title || selectedCategory.display_name,
        chatType: 'conversation',
        conversationId: newConversation.id,
        category: selectedCategory,
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Could not create chat');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = (category: ChatCategory) => {
    const IconComponent = iconMap[category.icon_name];
    const isSelected = selectedCategory?.id === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          { 
            backgroundColor: isSelected ? getDynamicColor() : `${getDynamicColor()}15`,
            borderColor: isSelected ? getDynamicColor() : 'transparent',
          }
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <LinearGradient
          colors={isSelected 
            ? [getDynamicColor(), `${getDynamicColor()}dd`] 
            : [`${getDynamicColor()}15`, 'transparent']
          }
          style={styles.categoryGradient}
        >
          {IconComponent === VetClinicIcon || IconComponent === DogWalkingIcon || IconComponent === OrderSupportIcon || IconComponent === PetShopIcon || IconComponent === GroomingIcon ? (
            <View style={styles.categoryIconNoBg}>
              <IconComponent size={28} />
            </View>
          ) : (
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <IconComponent size={24} color="#FFFFFF" />
            </View>
          )}
          <Text style={[
            styles.categoryName,
            { color: isSelected ? '#FFFFFF' : currentTheme.colors.text }
          ]}>
            {category.display_name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={getDynamicColor()} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
            New Service Chat
          </Text>
          
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Chat Title Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Chat Title (Optional)
            </Text>
            <TextInput
              style={[
                styles.titleInput,
                { 
                  backgroundColor: currentTheme.colors.cardSurface,
                  color: currentTheme.colors.text,
                  borderColor: getDynamicColor()
                }
              ]}
              value={chatTitle}
              onChangeText={setChatTitle}
              placeholder="e.g. Veterinary consultation"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Select a Service
            </Text>
            <View style={styles.categoriesGrid}>
              {categories.map(renderCategoryItem)}
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              { 
                backgroundColor: selectedCategory ? getDynamicColor() : `${getDynamicColor()}40`,
                opacity: selectedCategory ? 1 : 0.6
              }
            ]}
            onPress={handleCreateChat}
            disabled={!selectedCategory || loading}
          >
            <LinearGradient
              colors={selectedCategory 
                ? [getDynamicColor(), `${getDynamicColor()}dd`] 
                : [`${getDynamicColor()}40`, `${getDynamicColor()}40`]
              }
              style={styles.createButtonGradient}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Create Service Chat'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryItem: {
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
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  categoryIcon: {
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
  categoryIconNoBg: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  createButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
});
