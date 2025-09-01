import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { ArrowLeft, Camera, Plus } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { PetService, CreatePetData } from '../services/petService';
import * as ImagePicker from 'expo-image-picker';

interface AddPetScreenProps {
  navigation: any;
}

export default function AddPetScreen({ navigation }: AddPetScreenProps) {
  const { currentTheme, selectedColor } = useTheme();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePetData>({
    name: '',
    species: 'dog',
    breed: '',
    color: '',
    birth_date: '',
    weight: undefined,
    weight_unit: 'kg',
    gender: 'unknown',
    microchip_id: '',
  });

  const speciesOptions = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'fish', label: 'Fish' },
    { value: 'reptile', label: 'Reptile' },
    { value: 'other', label: 'Other' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const weightUnitOptions = [
    { value: 'kg', label: 'kg' },
    { value: 'lb', label: 'lb' },
  ];

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Pet name is required');
      return;
    }

    if (!formData.species) {
      Alert.alert('Error', 'Please select a species');
      return;
    }

    setLoading(true);
    try {
      const result = await PetService.createPet(formData);
      if (result.success) {
        Alert.alert('Success', 'Pet added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to add pet');
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      Alert.alert('Error', 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CreatePetData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Add Pet
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={[styles.avatarContainer, { borderColor: currentTheme.colors.border }]}
            onPress={pickImage}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Camera size={32} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.avatarText, { color: currentTheme.colors.textSecondary }]}>
                  Add Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Pet Name *
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter pet name"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>

          {/* Species */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Species *
            </Text>
            <View style={styles.optionsContainer}>
              {speciesOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    { backgroundColor: currentTheme.colors.cardBackground },
                    formData.species === option.value && { backgroundColor: selectedColor }
                  ]}
                  onPress={() => updateFormData('species', option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: formData.species === option.value ? '#FFFFFF' : currentTheme.colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Breed */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Breed
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={formData.breed}
              onChangeText={(text) => updateFormData('breed', text)}
              placeholder="Enter breed"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>

          {/* Color */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Color
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={formData.color}
              onChangeText={(text) => updateFormData('color', text)}
              placeholder="Enter color"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>

          {/* Birth Date */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Birth Date
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={formData.birth_date}
              onChangeText={(text) => updateFormData('birth_date', text)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>

          {/* Weight */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Weight
            </Text>
            <View style={styles.weightContainer}>
              <TextInput
                style={[styles.weightInput, { 
                  backgroundColor: currentTheme.colors.cardBackground,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }]}
                value={formData.weight?.toString() || ''}
                onChangeText={(text) => updateFormData('weight', parseFloat(text) || undefined)}
                placeholder="0.0"
                placeholderTextColor={currentTheme.colors.textSecondary}
                keyboardType="numeric"
              />
              <View style={styles.weightUnitContainer}>
                {weightUnitOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.unitButton,
                      { backgroundColor: currentTheme.colors.cardBackground },
                      formData.weight_unit === option.value && { backgroundColor: selectedColor }
                    ]}
                    onPress={() => updateFormData('weight_unit', option.value)}
                  >
                    <Text style={[
                      styles.unitText,
                      { color: formData.weight_unit === option.value ? '#FFFFFF' : currentTheme.colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Gender
            </Text>
            <View style={styles.optionsContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    { backgroundColor: currentTheme.colors.cardBackground },
                    formData.gender === option.value && { backgroundColor: selectedColor }
                  ]}
                  onPress={() => updateFormData('gender', option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: formData.gender === option.value ? '#FFFFFF' : currentTheme.colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Microchip ID */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: currentTheme.colors.text }]}>
              Microchip ID
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={formData.microchip_id}
              onChangeText={(text) => updateFormData('microchip_id', text)}
              placeholder="Enter microchip ID"
              placeholderTextColor={currentTheme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: selectedColor },
            loading && { opacity: 0.6 }
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Pet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
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
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    marginTop: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weightInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  weightUnitContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
