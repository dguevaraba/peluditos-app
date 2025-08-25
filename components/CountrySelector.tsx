import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountrySelectorProps {
  value: string;
  onSelect: (country: string) => void;
  placeholder?: string;
  style?: any;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'EH', name: 'Western Sahara', flag: '🇪🇭' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
];

export default function CountrySelector({ value, onSelect, placeholder = "Select country", style }: CountrySelectorProps) {
  const { currentTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = countries.find(country => country.name === value);
  
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    onSelect(country.name);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: currentTheme.colors.cardSurface,
            borderColor: currentTheme.colors.border,
          },
          style
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedCountry ? (
            <>
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
                             <Text 
                 style={[styles.selectorText, { color: currentTheme.colors.text }]}
                 numberOfLines={1}
                 ellipsizeMode="tail"
               >
                 {selectedCountry.name}
               </Text>
            </>
          ) : (
            <Text style={[styles.placeholderText, { color: currentTheme.colors.textSecondary }]}>
              {placeholder}
            </Text>
          )}
        </View>
        <FontAwesome5 name="chevron-down" size={16} color={currentTheme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: currentTheme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: currentTheme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>
              Select Country
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSearchQuery('');
              }}
            >
              <FontAwesome5 name="times" size={20} color={currentTheme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: currentTheme.colors.cardSurface,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border,
                }
              ]}
              placeholder="Search countries..."
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  {
                    backgroundColor: currentTheme.colors.cardSurface,
                    borderBottomColor: currentTheme.colors.border,
                  }
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={[styles.countryName, { color: currentTheme.colors.text }]}>
                  {item.name}
                </Text>
                {selectedCountry?.code === item.code && (
                  <FontAwesome5 name="check" size={16} color={currentTheme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
            style={styles.countryList}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
    flexShrink: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  placeholderText: {
    fontSize: 16,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  countryName: {
    fontSize: 16,
    flex: 1,
  },
});
