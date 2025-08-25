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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { ArrowLeft, Camera, Trash2, Save, User, Calendar, MapPin, Heart } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { UserService, UserProfile, UpdateUserProfileData } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EditProfileSkeleton, AvatarSkeleton } from '../components/Skeleton';
import AvatarSelector from '../components/AvatarSelector';
import CountrySelector from '../components/CountrySelector';

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
      } else {
        // Si no hay perfil, crear uno con datos básicos del usuario
        const fullName = user?.user_metadata?.full_name || '';
        const firstName = fullName.split(' ')[0] || '';
        const lastName = fullName.split(' ').slice(1).join(' ') || '';
        
        const basicData = {
          first_name: firstName,
          last_name: lastName,
          phone: user?.phone || '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          country: '',
          date_of_birth: '',
          preferred_vet: '',
          emergency_contact: '',
          pet_preferences: [],
        };
        setFormData(basicData);
        const avatarUrl = user?.user_metadata?.avatar_url || null;
        setAvatar(avatarUrl);
        if (avatarUrl) {
          updateUserAvatar(avatarUrl);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateUserProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_of_birth = 'Birth date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('date_of_birth', formattedDate);
    }
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleAvatarSelected = async (avatarUrl: string) => {
    setAvatar(avatarUrl);
    
    // Si es una URL local (upload), subir a Supabase
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
          Alert.alert('Success', 'Avatar updated successfully');
          loadUserProfile();
        } else {
          console.error('Upload failed:', uploadResult.error);
          Alert.alert('Error', uploadResult.error?.message || 'Failed to upload avatar');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        Alert.alert('Error', `Failed to upload avatar: ${error.message}`);
      } finally {
        setSaving(false);
      }
    } else {
      // Si es una URL predefinida, actualizar directamente
      try {
        const updateResult = await UserService.updateUserProfile({ avatar_url: avatarUrl });
        if (updateResult.success) {
          setAvatar(avatarUrl);
          updateUserAvatar(avatarUrl);
          Alert.alert('Success', 'Avatar updated successfully');
          loadUserProfile();
        } else {
          Alert.alert('Error', 'Failed to update avatar');
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        Alert.alert('Error', 'Failed to update avatar');
      }
    }
  };

  const deleteAvatar = async () => {
    Alert.alert(
      'Delete Avatar',
      'Are you sure you want to delete your avatar?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
                          const result = await UserService.deleteAvatar();
            if (result.success) {
              setAvatar(null);
              updateUserAvatar('');
              Alert.alert('Success', 'Avatar deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete avatar');
            }
            } catch (error) {
              console.error('Error deleting avatar:', error);
              Alert.alert('Error', 'Failed to delete avatar');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const saveProfile = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      const result = await UserService.updateUserProfile(formData);
      
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const styles = createStyles(currentTheme);

  if (loading) {
    return <EditProfileSkeleton />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${selectedColor}05`, currentTheme.colors.background]}
        style={styles.backgroundGradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header con gradiente */}
          <LinearGradient
            colors={[`${selectedColor}15`, `${selectedColor}05`, 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: `${selectedColor}20` }]}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={24} color={selectedColor} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
                Edit Profile
              </Text>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: selectedColor }]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Save size={20} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Avatar Section con tarjeta */}
          <View style={[styles.avatarCard, { backgroundColor: currentTheme.colors.cardSurface }]}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                {saving ? (
                  <AvatarSkeleton size={120} />
                ) : avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: selectedColor }]}>
                    <User size={40} color="#ffffff" />
                  </View>
                )}
              </View>
              <View style={styles.avatarActions}>
                <TouchableOpacity
                  style={[styles.avatarButton, { backgroundColor: selectedColor }]}
                  onPress={() => setShowAvatarSelector(true)}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Camera size={16} color="#ffffff" />
                      <Text style={styles.avatarButtonText}>Change</Text>
                    </>
                  )}
                </TouchableOpacity>
                {avatar && (
                  <TouchableOpacity 
                    style={[styles.avatarButton, styles.deleteButton]}
                    onPress={deleteAvatar}
                  >
                    <Trash2 size={16} color="#ffffff" />
                    <Text style={styles.avatarButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={[styles.formCard, { backgroundColor: currentTheme.colors.cardSurface }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: `${selectedColor}20` }]}>
                <User size={20} color={selectedColor} />
              </View>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Personal Information
              </Text>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  First Name <Text style={{ color: '#ff6b6b' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    color: currentTheme.colors.text,
                    borderColor: errors.first_name ? '#ff6b6b' : currentTheme.colors.border,
                  }]}
                  value={formData.first_name}
                  onChangeText={(text) => handleInputChange('first_name', text)}
                  placeholder="Enter first name"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
                {errors.first_name && (
                  <Text style={styles.errorText}>{errors.first_name}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Last Name <Text style={{ color: '#ff6b6b' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    color: currentTheme.colors.text,
                    borderColor: errors.last_name ? '#ff6b6b' : currentTheme.colors.border,
                  }]}
                  value={formData.last_name}
                  onChangeText={(text) => handleInputChange('last_name', text)}
                  placeholder="Enter last name"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
                {errors.last_name && (
                  <Text style={styles.errorText}>{errors.last_name}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                Phone Number
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: currentTheme.colors.cardSurface,
                  color: currentTheme.colors.text,
                  borderColor: errors.phone ? '#ff6b6b' : currentTheme.colors.border,
                }]}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="Enter phone number"
                placeholderTextColor={currentTheme.colors.textSecondary}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                Date of Birth
              </Text>
              <TouchableOpacity
                style={[styles.dateInput, { 
                  backgroundColor: currentTheme.colors.cardSurface,
                  borderColor: errors.date_of_birth ? '#ff6b6b' : currentTheme.colors.border,
                }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[
                  styles.dateInputText, 
                  { 
                    color: formData.date_of_birth ? currentTheme.colors.text : currentTheme.colors.textSecondary 
                  }
                ]}>
                  {formData.date_of_birth ? formatDateForDisplay(formData.date_of_birth) : 'Select date'}
                </Text>
                <Calendar size={20} color={currentTheme.colors.textSecondary} />
              </TouchableOpacity>
              {errors.date_of_birth && (
                <Text style={styles.errorText}>{errors.date_of_birth}</Text>
              )}
            </View>

            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: `${selectedColor}20` }]}>
                <MapPin size={20} color={selectedColor} />
              </View>
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Address Information
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                Address
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: currentTheme.colors.cardSurface,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border,
                }]}
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="Enter address"
                placeholderTextColor={currentTheme.colors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  City
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }]}
                  value={formData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  placeholder="Enter city"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  State
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }]}
                  value={formData.state}
                  onChangeText={(text) => handleInputChange('state', text)}
                  placeholder="Enter state"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  ZIP Code
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }]}
                  value={formData.zip_code}
                  onChangeText={(text) => handleInputChange('zip_code', text)}
                  placeholder="Enter ZIP code"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
                  Country
                </Text>
                <CountrySelector
                  value={formData.country}
                  onSelect={(country) => handleInputChange('country', country)}
                  placeholder="Select country"
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.cardSurface,
                    borderColor: currentTheme.colors.border,
                  }]}
                />
              </View>
           </View>

           <View style={styles.sectionHeader}>
             <View style={[styles.sectionIcon, { backgroundColor: `${selectedColor}20` }]}>
               <Heart size={20} color={selectedColor} />
             </View>
             <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
               Pet Care Preferences
             </Text>
           </View>

           <View style={styles.inputContainer}>
             <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
               Preferred Veterinarian
             </Text>
             <TextInput
               style={[styles.input, { 
                 backgroundColor: currentTheme.colors.cardSurface,
                 color: currentTheme.colors.text,
                 borderColor: currentTheme.colors.border,
               }]}
               value={formData.preferred_vet}
               onChangeText={(text) => handleInputChange('preferred_vet', text)}
               placeholder="Enter preferred veterinarian"
               placeholderTextColor={currentTheme.colors.textSecondary}
             />
           </View>

           <View style={styles.inputContainer}>
             <Text style={[styles.inputLabel, { color: currentTheme.colors.textSecondary }]}>
               Emergency Contact
             </Text>
             <TextInput
               style={[styles.input, { 
                 backgroundColor: currentTheme.colors.cardSurface,
                 color: currentTheme.colors.text,
                 borderColor: currentTheme.colors.border,
               }]}
               value={formData.emergency_contact}
               onChangeText={(text) => handleInputChange('emergency_contact', text)}
               placeholder="Enter emergency contact"
               placeholderTextColor={currentTheme.colors.textSecondary}
             />
           </View>
                   </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Avatar Selector Modal */}
      <AvatarSelector
        visible={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onAvatarSelected={handleAvatarSelected}
        currentAvatar={avatar}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerGradient: {
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
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

  avatarCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...(Platform.OS === 'android' ? {
      elevation: 4,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
  },
  avatarButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    gap: 20,
    ...(Platform.OS === 'android' ? {
      elevation: 4,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
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
  dateInput: {
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
  dateInputText: {
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
