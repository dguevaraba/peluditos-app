import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft,
  Camera,
  FolderPlus,
  X,
  Image as ImageIcon,
  Tag
} from 'lucide-react-native';

interface AddPhotoOrCategoryScreenProps {
  visible: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  onAddCategory: () => void;
}

const AddPhotoOrCategoryScreen: React.FC<AddPhotoOrCategoryScreenProps> = ({
  visible,
  onClose,
  onAddPhoto,
  onAddCategory,
}) => {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();

  const getDynamicColor = () => selectedColor;

  const handleAddPhoto = () => {
    onClose();
    onAddPhoto();
  };

  const handleAddCategory = () => {
    onClose();
    onAddCategory();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              Add New
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.subtitle, { color: currentTheme.colors.textSecondary }]}>
              What would you like to add to your gallery?
            </Text>

            {/* Photo Option */}
            <TouchableOpacity
              style={[styles.optionCard, { backgroundColor: `${getDynamicColor()}15` }]}
              onPress={handleAddPhoto}
            >
              <LinearGradient
                colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                style={styles.optionGradient}
              >
                <View style={styles.optionIconContainer}>
                  <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                    <Camera size={28} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: currentTheme.colors.text }]}>
                    Add Photo
                  </Text>
                  <Text style={[styles.optionDescription, { color: currentTheme.colors.textSecondary }]}>
                    Upload a new photo to an existing album or create a new one
                  </Text>
                </View>
                <View style={styles.optionArrow}>
                  <ImageIcon size={20} color={getDynamicColor()} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Category Option */}
            <TouchableOpacity
              style={[styles.optionCard, { backgroundColor: `${getDynamicColor()}15` }]}
              onPress={handleAddCategory}
            >
              <LinearGradient
                colors={[`${getDynamicColor()}20`, `${getDynamicColor()}10`]}
                style={styles.optionGradient}
              >
                <View style={styles.optionIconContainer}>
                  <View style={[styles.iconCircle, { backgroundColor: getDynamicColor() }]}>
                    <FolderPlus size={28} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: currentTheme.colors.text }]}>
                    Create Category
                  </Text>
                  <Text style={[styles.optionDescription, { color: currentTheme.colors.textSecondary }]}>
                    Create a new category to organize your photos better
                  </Text>
                </View>
                <View style={styles.optionArrow}>
                  <Tag size={20} color={getDynamicColor()} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={[styles.quickActionsTitle, { color: currentTheme.colors.text }]}>
                Quick Actions
              </Text>
              
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={[styles.quickActionIcon, { backgroundColor: getDynamicColor() }]}>
                    <Camera size={16} color="#ffffff" />
                  </View>
                  <Text style={[styles.quickActionText, { color: currentTheme.colors.textSecondary }]}>
                    Camera
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={[styles.quickActionIcon, { backgroundColor: getDynamicColor() }]}>
                    <ImageIcon size={16} color="#ffffff" />
                  </View>
                  <Text style={[styles.quickActionText, { color: currentTheme.colors.textSecondary }]}>
                    Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={[styles.quickActionIcon, { backgroundColor: getDynamicColor() }]}>
                    <FolderPlus size={16} color="#ffffff" />
                  </View>
                  <Text style={[styles.quickActionText, { color: currentTheme.colors.textSecondary }]}>
                    New Album
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={[styles.quickActionIcon, { backgroundColor: getDynamicColor() }]}>
                    <Tag size={16} color="#ffffff" />
                  </View>
                  <Text style={[styles.quickActionText, { color: currentTheme.colors.textSecondary }]}>
                    Category
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  optionCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionArrow: {
    marginLeft: 12,
  },
  quickActions: {
    marginTop: 32,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionButton: {
    alignItems: 'center',
    width: '45%',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AddPhotoOrCategoryScreen;
