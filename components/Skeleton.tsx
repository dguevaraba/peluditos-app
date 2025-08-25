import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform, SafeAreaView } from 'react-native';
import { useTheme } from '../ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

interface SkeletonItemProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  marginBottom?: number;
  marginTop?: number;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style,
  marginBottom = 8,
  marginTop = 0
}) => {
  const { currentTheme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: currentTheme.colors.border,
          opacity,
          marginBottom,
          marginTop,
        },
        style,
      ]}
    />
  );
};

// Skeleton específico para el Home
export const HomeSkeleton: React.FC = () => {
  const { currentTheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header Skeleton */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <SkeletonItem width={50} height={50} borderRadius={25} />
            <SkeletonItem width={100} height={24} borderRadius={12} style={{ marginLeft: 12 }} />
          </View>
          <View style={styles.headerActions}>
            <SkeletonItem width={40} height={40} borderRadius={20} />
            <SkeletonItem width={40} height={40} borderRadius={20} style={{ marginLeft: 8 }} />
          </View>
        </View>
      </View>

      {/* Pet Card Skeleton */}
      <View style={styles.petCardContainer}>
        <SkeletonItem width="100%" height={140} borderRadius={20} />
      </View>

      {/* Summary Cards Skeleton */}
      <View style={styles.summaryContainer}>
        <SkeletonItem width="48%" height={80} borderRadius={20} />
        <SkeletonItem width="48%" height={80} borderRadius={20} />
      </View>

      {/* Events Section Skeleton */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <SkeletonItem width={32} height={32} borderRadius={16} />
          <SkeletonItem width={150} height={18} borderRadius={9} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.eventsList}>
          <SkeletonItem width="100%" height={60} borderRadius={16} />
          <SkeletonItem width="100%" height={60} borderRadius={16} />
          <SkeletonItem width="100%" height={60} borderRadius={16} />
        </View>
      </View>

      {/* Nearby Vets Section Skeleton */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <SkeletonItem width={32} height={32} borderRadius={16} />
          <SkeletonItem width={180} height={18} borderRadius={9} style={{ marginLeft: 12 }} />
        </View>
        <SkeletonItem width="100%" height={200} borderRadius={16} />
        <View style={styles.vetsList}>
          <SkeletonItem width="100%" height={50} borderRadius={16} />
          <SkeletonItem width="100%" height={50} borderRadius={16} />
          <SkeletonItem width="100%" height={50} borderRadius={16} />
        </View>
      </View>

      {/* Daily Tip Skeleton */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <SkeletonItem width={32} height={32} borderRadius={16} />
          <SkeletonItem width={120} height={18} borderRadius={9} style={{ marginLeft: 12 }} />
        </View>
        <SkeletonItem width="100%" height={120} borderRadius={16} />
      </View>

      {/* Pet Photos Section Skeleton */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <SkeletonItem width={32} height={32} borderRadius={16} />
          <SkeletonItem width={140} height={18} borderRadius={9} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.photosGrid}>
          <SkeletonItem width="48%" height={120} borderRadius={16} />
          <SkeletonItem width="48%" height={120} borderRadius={16} />
          <SkeletonItem width="48%" height={120} borderRadius={16} />
          <SkeletonItem width="48%" height={120} borderRadius={16} />
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
};

// Skeleton para EditProfile
export const EditProfileSkeleton: React.FC = () => {
  const { currentTheme } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.colors.background }]}>
      <View style={[styles.editProfileContainer, { backgroundColor: currentTheme.colors.background }]}>
        {/* Header Skeleton */}
        <View style={styles.editProfileHeader}>
          <SkeletonItem width={24} height={24} borderRadius={12} />
          <SkeletonItem width={100} height={24} />
          <SkeletonItem width={60} height={24} borderRadius={12} />
        </View>
        {/* Avatar Section Skeleton */}
        <View style={styles.editProfileAvatarSection}>
          <SkeletonItem width={100} height={100} borderRadius={50} />
          <SkeletonItem width={80} height={32} borderRadius={16} marginTop={12} />
        </View>
        {/* Form Sections Skeleton */}
        <View style={styles.editProfileFormSection}>
          <SkeletonItem width={120} height={20} marginBottom={16} />
          <View style={styles.editProfileInputRow}>
            <SkeletonItem width="48%" height={48} borderRadius={12} />
            <SkeletonItem width="48%" height={48} borderRadius={12} />
          </View>
          <SkeletonItem width="100%" height={48} borderRadius={12} marginTop={16} />
          <SkeletonItem width="100%" height={48} borderRadius={12} marginTop={16} />
        </View>
        <View style={styles.editProfileFormSection}>
          <SkeletonItem width={140} height={20} marginBottom={16} />
          <SkeletonItem width="100%" height={48} borderRadius={12} />
          <View style={styles.editProfileInputRow}>
            <SkeletonItem width="48%" height={48} borderRadius={12} marginTop={16} />
            <SkeletonItem width="48%" height={48} borderRadius={12} marginTop={16} />
          </View>
          <View style={styles.editProfileInputRow}>
            <SkeletonItem width="48%" height={48} borderRadius={12} marginTop={16} />
            <SkeletonItem width="48%" height={48} borderRadius={12} marginTop={16} />
          </View>
        </View>
        <View style={styles.editProfileFormSection}>
          <SkeletonItem width={160} height={20} marginBottom={16} />
          <SkeletonItem width="100%" height={48} borderRadius={12} />
          <SkeletonItem width="100%" height={48} borderRadius={12} marginTop={16} />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Skeleton específico para avatares
export const AvatarSkeleton: React.FC<{ size?: number; style?: any }> = ({ 
  size = 100, 
  style 
}) => {
  const { currentTheme } = useTheme();
  return (
    <SkeletonItem 
      width={size} 
      height={size} 
      borderRadius={size / 2}
      style={[
        {
          backgroundColor: currentTheme.colors.border,
        },
        style
      ]}
    />
  );
};

// Skeleton genérico reutilizable
export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}) => {
  return (
    <SkeletonItem 
      width={width} 
      height={height} 
      borderRadius={borderRadius} 
      style={style} 
    />
  );
};

// Skeleton para Gallery - Optimizado y más rápido
export const GallerySkeleton: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        {/* Header Skeleton */}
        <View style={styles.galleryHeaderContainer}>
          <View style={styles.galleryHeaderContent}>
            <View style={styles.galleryTitleContainer}>
              <SkeletonItem width={40} height={40} borderRadius={20} />
              <SkeletonItem width={120} height={24} borderRadius={12} style={{ marginLeft: 12 }} />
            </View>
            <SkeletonItem width={180} height={16} borderRadius={8} style={{ marginTop: 8 }} />
          </View>
        </View>

        {/* View Mode Toggle Skeleton */}
        <View style={styles.galleryViewModeContainer}>
          <View style={styles.galleryViewModeButtons}>
            <SkeletonItem width={40} height={40} borderRadius={8} />
            <SkeletonItem width={40} height={40} borderRadius={8} style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* Filter Buttons Skeleton */}
        <View style={styles.galleryFilterContainer}>
          <View style={styles.galleryFilterButtons}>
            {[1, 2, 3, 4].map((item) => (
              <SkeletonItem key={item} width={70} height={32} borderRadius={16} style={{ marginRight: 12 }} />
            ))}
          </View>
        </View>

        {/* Album Cards Skeleton - Grid View */}
        <View style={styles.galleryCardsContainer}>
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <View key={card} style={styles.galleryCardSkeleton}>
              <SkeletonItem width="100%" height={120} borderRadius={12} style={{ marginBottom: 8 }} />
              <SkeletonItem width="80%" height={16} borderRadius={8} style={{ marginBottom: 4 }} />
              <SkeletonItem width="60%" height={12} borderRadius={6} style={{ marginBottom: 4 }} />
              <SkeletonItem width="40%" height={12} borderRadius={6} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'android' ? 16 : 20,
    paddingBottom: 40,
  },
  // Gallery Skeleton styles
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  cardsContainer: {
    gap: 16,
  },
  cardSkeleton: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerContainer: {
    marginBottom: 16,
    marginHorizontal: Platform.OS === 'android' ? -16 : -20,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCardContainer: {
    marginBottom: 16,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
    marginHorizontal: Platform.OS === 'android' ? 4 : 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsList: {
    gap: 4,
  },
  vetsList: {
    marginTop: 12,
    gap: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  // EditProfile Skeleton styles
  editProfileContainer: {
    flex: 1,
    padding: Platform.OS === 'android' ? 16 : 20,
  },
  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  editProfileAvatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  editProfileFormSection: {
    marginBottom: 24,
  },
  editProfileInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Gallery Skeleton styles
  galleryHeaderContainer: {
    marginBottom: 16,
    marginHorizontal: Platform.OS === 'android' ? -16 : -20,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  galleryHeaderContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  galleryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  galleryViewModeContainer: {
    marginBottom: 20,
  },
  galleryViewModeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  galleryFilterContainer: {
    marginBottom: 20,
  },
  galleryFilterButtons: {
    flexDirection: 'row',
  },
  galleryCardsContainer: {
    gap: 16,
  },
  galleryCardSkeleton: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
});

export default Skeleton;
