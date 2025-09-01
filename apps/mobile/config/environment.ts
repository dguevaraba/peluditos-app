/**
 * Environment configuration
 * Centralizes all environment-dependent settings
 */

export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

export const Environment = {
  // App Info
  APP_NAME: 'Peluditos',
  APP_VERSION: '1.0.0',
  
  // Environment
  IS_DEV: isDevelopment,
  IS_PROD: isProduction,
  
  // Supabase (these should come from environment variables in production)
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // OAuth Redirect URLs
  REDIRECT_URL: 'peluditos://auth/callback',
  
  // API Settings
  API_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  
  // Storage Settings
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 1024 * 1024, // 1MB
  STORAGE_BUCKET: 'photos',
  
  // UI Settings
  TOAST_DURATION: 3000,
  SKELETON_ANIMATION_DURATION: 1000,
  DEBOUNCE_DELAY: 300,
  
  // Feature Flags
  FEATURES: {
    GOOGLE_AUTH: true,
    FACEBOOK_AUTH: true,
    APPLE_AUTH: true,
    PUSH_NOTIFICATIONS: false, // TODO: Implement
    ANALYTICS: false, // TODO: Implement
  },
  
  // Debug Settings (only in development)
  DEBUG: {
    SHOW_LOGS: isDevelopment,
    SHOW_REDUX_LOGGER: isDevelopment,
    SHOW_PERFORMANCE_MONITOR: isDevelopment,
  },
} as const;

// Validation
if (isProduction) {
  if (!Environment.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required in production');
  }
  if (!Environment.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is required in production');
  }
}
