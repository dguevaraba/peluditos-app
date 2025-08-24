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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'android' ? 16 : 20,
    paddingBottom: 40,
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
});

export default Skeleton;
