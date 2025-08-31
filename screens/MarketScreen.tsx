import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import { 
  Search, 
  ShoppingCart, 
  Plus,
  Leaf,
  Bone,
  Scissors,
  Pill,
  Star
} from 'lucide-react-native';
import { useTheme } from '../ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const MarketScreen: React.FC = () => {
  const { currentTheme, selectedColor } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Food', icon: Bone, color: '#FF6B6B' },
    { id: 2, name: 'Toys', icon: Bone, color: '#4ECDC4' },
    { id: 3, name: 'Grooming', icon: Scissors, color: '#45B7D1' },
    { id: 4, name: 'Vets', icon: Pill, color: '#96CEB4' },
  ];

  const recommendedProducts = [
    {
      id: 1,
      name: 'Dog Food',
      description: 'Recommended for Rocky',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=150&fit=crop',
      price: '$24.99',
      rating: 4.8,
    },
  ];

  const products = [
    {
      id: 1,
      name: 'Dog Bed',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=150&fit=crop',
      price: '$45.99',
      originalPrice: '$57.99',
      discount: '20% OFF',
      rating: 4.6,
    },
    {
      id: 2,
      name: 'Rope Toy',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=150&fit=crop',
      price: '$12.99',
      rating: 4.4,
    },
    {
      id: 3,
      name: 'Cat Scratching Post',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=150&fit=crop',
      price: '$34.99',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Pet Carrier',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=150&fit=crop',
      price: '$29.99',
      rating: 4.5,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Market
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: currentTheme.colors.cardSurface }]}>
          <Search size={20} color={currentTheme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.colors.text }]}
            placeholder="Buscar productos, veterinarios, servicios..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Icons */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, { backgroundColor: currentTheme.colors.cardSurface }]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <IconComponent size={24} color="#FFFFFF" />
                </View>
                <Text style={[styles.categoryText, { color: currentTheme.colors.text }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recommended for Rocky */}
        <View style={styles.recommendedSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Recommended for Rocky
          </Text>
          {recommendedProducts.map((product) => (
            <View key={product.id} style={[styles.recommendedCard, { backgroundColor: currentTheme.colors.cardSurface }]}>
              <Image source={{ uri: product.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedContent}>
                <Text style={[styles.recommendedTitle, { color: currentTheme.colors.text }]}>
                  {product.name}
                </Text>
                <Text style={[styles.recommendedDescription, { color: currentTheme.colors.textSecondary }]}>
                  {product.description}
                </Text>
                <View style={styles.recommendedActions}>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={selectedColor} fill={selectedColor} />
                    <Text style={[styles.ratingText, { color: currentTheme.colors.textSecondary }]}>
                      {product.rating}
                    </Text>
                  </View>
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: selectedColor }]}>
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promotional Banner */}
        <View style={[styles.promoBanner, { backgroundColor: selectedColor }]}>
          <Leaf size={24} color="#FFFFFF" />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Especial invierno</Text>
            <Text style={styles.promoSubtitle}>20% OFF en camas</Text>
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.productsSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Featured Products
          </Text>
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[styles.productCard, { backgroundColor: currentTheme.colors.cardSurface }]}
              >
                {product.discount && (
                  <View style={[styles.discountBadge, { backgroundColor: selectedColor }]}>
                    <Text style={styles.discountText}>{product.discount}</Text>
                  </View>
                )}
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productContent}>
                  <Text style={[styles.productName, { color: currentTheme.colors.text }]}>
                    {product.name}
                  </Text>
                  <View style={styles.productPriceContainer}>
                    <Text style={[styles.productPrice, { color: selectedColor }]}>
                      {product.price}
                    </Text>
                    {product.originalPrice && (
                      <Text style={[styles.originalPrice, { color: currentTheme.colors.textSecondary }]}>
                        {product.originalPrice}
                      </Text>
                    )}
                  </View>
                  <View style={styles.productRating}>
                    <Star size={14} color={selectedColor} fill={selectedColor} />
                    <Text style={[styles.ratingText, { color: currentTheme.colors.textSecondary }]}>
                      {product.rating}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Shopping Cart */}
      <TouchableOpacity style={[styles.floatingCart, { backgroundColor: selectedColor }]}>
        <ShoppingCart size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  recommendedCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
  recommendedImage: {
    width: 120,
    height: 120,
  },
  recommendedContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendedDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  recommendedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  promoContent: {
    marginLeft: 12,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  productsSection: {
    marginBottom: 24,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  productCard: {
    width: (screenWidth - 52) / 2,
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
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 100,
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
});

export default MarketScreen;
