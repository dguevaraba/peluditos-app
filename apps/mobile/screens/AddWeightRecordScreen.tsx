import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { PetService, CreateWeightRecordData } from '../services/petService';
import { ArrowLeft, Plus, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddWeightRecordScreenProps {
  navigation: any;
  route: any;
}

const AddWeightRecordScreen: React.FC<AddWeightRecordScreenProps> = ({ navigation, route }) => {
  const { currentTheme, selectedColor } = useTheme();
  const { petId } = route.params;

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      const weightData: CreateWeightRecordData = {
        pet_id: petId,
        weight: Number(weight),
        weight_unit: weightUnit,
        recorded_date: selectedDate.toISOString().split('T')[0],
        notes: notes.trim() || undefined,
      };

      const result = await PetService.addWeightRecord(weightData);
      
      if (result.success) {
        Alert.alert('Success', 'Weight record added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to add weight record');
      }
    } catch (error) {
      console.error('Error adding weight record:', error);
      Alert.alert('Error', 'Failed to add weight record');
    } finally {
      setLoading(false);
    }
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
          Add Weight Record
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weight Input */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Weight
          </Text>
          
          <View style={styles.weightInputContainer}>
            <TextInput
              style={[styles.weightInput, { 
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              placeholderTextColor={currentTheme.colors.textSecondary}
              keyboardType="numeric"
            />
            
            <View style={styles.unitButtons}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  { borderColor: currentTheme.colors.border },
                  weightUnit === 'kg' && { backgroundColor: selectedColor, borderColor: selectedColor }
                ]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[
                  styles.unitButtonText,
                  { color: weightUnit === 'kg' ? '#FFFFFF' : currentTheme.colors.text }
                ]}>
                  kg
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  { borderColor: currentTheme.colors.border },
                  weightUnit === 'lb' && { backgroundColor: selectedColor, borderColor: selectedColor }
                ]}
                onPress={() => setWeightUnit('lb')}
              >
                <Text style={[
                  styles.unitButtonText,
                  { color: weightUnit === 'lb' ? '#FFFFFF' : currentTheme.colors.text }
                ]}>
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Input */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Date
          </Text>
          
          <TouchableOpacity
            style={[styles.dateButton, { 
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.border
            }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={selectedColor} />
            <Text style={[styles.dateButtonText, { color: currentTheme.colors.text }]}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notes Input */}
        <View style={[styles.section, { backgroundColor: currentTheme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Notes (Optional)
          </Text>
          
          <TextInput
            style={[styles.notesInput, { 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border
            }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this weight record..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomContainer, { borderTopColor: currentTheme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: selectedColor },
            loading && { opacity: 0.6 }
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Add Weight Record'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weightInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddWeightRecordScreen;
