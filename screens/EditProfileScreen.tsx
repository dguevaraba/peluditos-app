import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { X, Camera, Save, User, Calendar, MapPin, Heart, Phone, Mail, Globe } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { UserService, UserProfile, UpdateUserProfileData } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EditProfileSkeleton, AvatarSkeleton } from '../components/Skeleton';
import AvatarSelector from '../components/AvatarSelector';
import CountrySelector from '../components/CountrySelector';
import Toast from '../components/Toast';
import CowIcon from '../components/CowIcon';
import PenguinIcon from '../components/PenguinIcon';
import FishIcon from '../components/FishIcon';
import HamsterIcon from '../components/HamsterIcon';

interface EditProfileScreenProps {
  navigation: any;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { currentTheme, selectedColor } = useTheme();
  const { user, updateUserAvatar } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  // Form fields
  const [formData, setFormData] = useState<UpdateUserProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    date_of_birth: '',
    preferred_vet: '',
    emergency_contact: '',
    pet_preferences: [],
  });

  const getDynamicColor = () => selectedColor;

  // Custom avatars para renderizar
  const customAvatars = [
    {
      id: 'penguin',
      name: 'Penguin',
      icon: PenguinIcon,
      color: '#4ECDC4'
    },
    {
      id: 'cow',
      name: 'Cow',
      icon: CowIcon,
      color: '#FF6B6B'
    },
    {
      id: 'fish',
      name: 'Fish',
      icon: FishIcon,
      color: '#45B7D1'
    },
    {
      id: 'hamster',
      name: 'Hamster',
      icon: HamsterIcon,
      color: '#96CEB4'
    },
  ];

  const renderCustomAvatar = (avatarUrl: string, containerSize: number = 32) => {
    const avatarId = avatarUrl.replace('custom-', '').replace('-icon', '');
    const avatar = customAvatars.find(a => a.id === avatarId);
    
    if (avatar) {
      const IconComponent = avatar.icon;
      // Calcular el tamaño del icono basado en el contenedor (80% del tamaño del contenedor)
      const iconSize = Math.floor(containerSize * 0.8);
      return <IconComponent size={iconSize} color="#ffffff" />;
    }
    
    return <User size={containerSize} color="#ffffff" />;
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Recargar datos cuando el usuario regrese a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const result = await UserService.getCurrentUserProfile();
      
      if (result.success && result.data) {
        setProfile(result.data);
        const avatarUrl = result.data.avatar_url || null;
        setAvatar(avatarUrl);
        if (avatarUrl) {
          updateUserAvatar(avatarUrl);
        }
        // Extraer first_name y last_name del full_name si están vacíos
        const fullName = result.data.full_name || '';
        const firstName = result.data.first_name || fullName.split(' ')[0] || '';
        const lastName = result.data.last_name || fullName.split(' ').slice(1).join(' ') || '';
        
        const formDataToSet = {
          first_name: firstName,
          last_name: lastName,
          phone: result.data.phone || '',
          address: result.data.address || '',
          city: result.data.city || '',
          state: result.data.state || '',
          zip_code: result.data.zip_code || '',
          country: result.data.country || '',
          date_of_birth: result.data.date_of_birth || '',
          preferred_vet: result.data.preferred_vet || '',
          emergency_contact: result.data.emergency_contact || '',
          pet_preferences: result.data.pet_preferences || [],
        };
        
        setFormData(formDataToSet);
        
        // Set date of birth if available
        if (result.data.date_of_birth) {
          setDateOfBirth(new Date(result.data.date_of_birth));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
      setToast({ visible: true, message: 'First name and last name are required', type: 'error' });
      return;
    }

    setSaving(true);
    
    try {
      const updateData: UpdateUserProfileData = {
        ...formData,
        first_name: formData.first_name?.trim() || '',
        last_name: formData.last_name?.trim() || '',
        date_of_birth: dateOfBirth.toISOString().split('T')[0],
      };

      const result = await UserService.updateUserProfile(updateData);
      
      if (result.success) {
        setToast({ visible: true, message: 'Profile updated successfully', type: 'success' });
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        setToast({ visible: true, message: result.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ visible: true, message: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };





  const handleAvatarSelected = async (avatarUrl: string) => {
    setAvatar(avatarUrl);
    
    // Si es un icono personalizado (custom-), actualizar directamente
    if (avatarUrl.startsWith('custom-')) {
      try {
        const updateResult = await UserService.updateUserProfile({ avatar_url: avatarUrl });
        if (updateResult.success) {
          setAvatar(avatarUrl);
          updateUserAvatar(avatarUrl);
          setToast({ visible: true, message: 'Avatar updated successfully', type: 'success' });
          loadUserProfile();
        } else {
          setToast({ visible: true, message: 'Failed to update avatar', type: 'error' });
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        setToast({ visible: true, message: 'Failed to update avatar', type: 'error' });
      }
      return;
    }
    
    // Si es una URL local (upload desde cámara o galería), subir a Supabase
    if (avatarUrl.startsWith('file://')) {
      setSaving(true);
      try {
        const fileInfo = await FileSystem.getInfoAsync(avatarUrl);
        if (!fileInfo.exists || fileInfo.size === 0) {
          throw new Error('File does not exist or is empty');
        }
        
        const base64Data = await FileSystem.readAsStringAsync(avatarUrl, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const timestamp = Date.now();
        const fileName = `avatar_${timestamp}.jpg`;
        
        const uploadResult = await UserService.uploadAvatar(base64Data, fileName);
        if (uploadResult.success) {
          const newAvatarUrl = uploadResult.url || avatarUrl;
          setAvatar(newAvatarUrl);
          updateUserAvatar(newAvatarUrl);
          setToast({ visible: true, message: 'Avatar updated successfully', type: 'success' });
          loadUserProfile();
        } else {
          console.error('Upload failed:', uploadResult.error);
          setToast({ visible: true, message: uploadResult.error?.message || 'Failed to upload avatar', type: 'error' });
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setToast({ visible: true, message: `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
      } finally {
        setSaving(false);
      }
    } else {
      // Si es una URL predefinida o de Supabase, actualizar directamente
      try {
        const updateResult = await UserService.updateUserProfile({ avatar_url: avatarUrl });
        if (updateResult.success) {
          setAvatar(avatarUrl);
          updateUserAvatar(avatarUrl);
          setToast({ visible: true, message: 'Avatar updated successfully', type: 'success' });
          loadUserProfile();
        } else {
          setToast({ visible: true, message: 'Failed to update avatar', type: 'error' });
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        setToast({ visible: true, message: 'Failed to update avatar', type: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <LinearGradient
          colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
          style={styles.gradient}
        >
          <EditProfileSkeleton />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <X size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
            Edit Profile
          </Text>
                      <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: getDynamicColor(),
                  opacity: formData.first_name?.trim() && formData.last_name?.trim() ? 1 : 0.5
                }
              ]}
              onPress={handleSaveProfile}
              disabled={saving || !formData.first_name?.trim() || !formData.last_name?.trim()}
            >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Profile Avatar */}
            <View style={styles.avatarSection}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Profile Photo
              </Text>
              <View style={[
                styles.avatarCard, 
                { 
                  backgroundColor: `${getDynamicColor()}08`,
                  borderColor: `${getDynamicColor()}20`
                }
              ]}>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={() => setShowAvatarSelector(true)}
                  activeOpacity={0.7}
                >
                  {avatar ? (
                    avatar.startsWith('custom-') ? (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: getDynamicColor() }]}>
                        {renderCustomAvatar(avatar, 120)}
                      </View>
                    ) : (
                      <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    )
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: getDynamicColor() }]}>
                      <User size={32} color="#ffffff" />
                    </View>
                  )}
                                      <View style={[styles.cameraButton, { backgroundColor: getDynamicColor() }]}>
                      <Camera size={20} color="#ffffff" />
                    </View>
                </TouchableOpacity>
                <Text style={[styles.avatarLabel, { color: currentTheme.colors.textSecondary }]}>
                  Tap to change photo
                </Text>
              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.detailsContainer}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Personal Information
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  First Name *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.first_name}
                  onChangeText={(text) => setFormData({...formData, first_name: text})}
                  placeholder="Enter your first name"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Last Name *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.last_name}
                  onChangeText={(text) => setFormData({...formData, last_name: text})}
                  placeholder="Enter your last name"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Date of Birth
                </Text>
                <TouchableOpacity
                  style={[styles.selectorButton, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    borderColor: getDynamicColor()
                  }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.selectorContent}>
                    <Calendar size={20} color={getDynamicColor()} />
                    <Text style={[styles.selectorText, { color: currentTheme.colors.text }]}>
                      {dateOfBirth.toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Phone Number
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder="Enter your phone number"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  keyboardType="phone-pad"
                  maxLength={20}
                />
              </View>
            </View>

            {/* Address Information */}
            <View style={styles.detailsContainer}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Address Information
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Address
                </Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter your address"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  multiline
                  numberOfLines={2}
                  maxLength={200}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  City
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.city}
                  onChangeText={(text) => setFormData({...formData, city: text})}
                  placeholder="Enter your city"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={100}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  State/Province
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.state}
                  onChangeText={(text) => setFormData({...formData, state: text})}
                  placeholder="Enter your state or province"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={100}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  ZIP/Postal Code
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.zip_code}
                  onChangeText={(text) => setFormData({...formData, zip_code: text})}
                  placeholder="Enter your ZIP or postal code"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={20}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Country
                </Text>
                <CountrySelector
                  value={formData.country || ''}
                  onSelect={(country) => setFormData({...formData, country})}
                  placeholder="Select Country"
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    borderColor: getDynamicColor()
                  }]}
                />
              </View>
            </View>

            {/* Pet Information */}
            <View style={styles.detailsContainer}>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Pet Information
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Preferred Veterinarian
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.preferred_vet}
                  onChangeText={(text) => setFormData({...formData, preferred_vet: text})}
                  placeholder="Enter your preferred veterinarian"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  maxLength={200}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Emergency Contact
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: `${getDynamicColor()}08`,
                    color: currentTheme.colors.text,
                    borderColor: getDynamicColor()
                  }]}
                  value={formData.emergency_contact}
                  onChangeText={(text) => setFormData({...formData, emergency_contact: text})}
                  placeholder="Enter emergency contact information"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  multiline
                  numberOfLines={2}
                  maxLength={200}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Date Picker */}
        {showDatePicker && (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerModalOverlay}>
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerHeader}>
                  <Text style={[styles.datePickerTitle, { color: currentTheme.colors.text }]}>
                    Select Date of Birth
                  </Text>
                  <TouchableOpacity
                    style={styles.datePickerCloseButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[styles.datePickerCloseText, { color: getDynamicColor() }]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        )}



        {/* Avatar Selector */}
        <AvatarSelector
          visible={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          onAvatarSelected={handleAvatarSelected}
          currentAvatar={avatar}
        />

        {/* Toast */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  closeButton: {
    padding: 12,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 12,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    marginBottom: 24,
  },
  avatarCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    ...(Platform.OS === 'android' ? {
      elevation: 2,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    }),
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'visible',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    ...(Platform.OS === 'android' ? {
      elevation: 2,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }),
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    ...(Platform.OS === 'android' ? {
      elevation: 2,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }),
  },
  selectorButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    ...(Platform.OS === 'android' ? {
      elevation: 2,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }),
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorText: {
    fontSize: 16,
  },

  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    height: 200,
  },
});

