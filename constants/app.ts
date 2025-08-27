/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  NAME: 'Peluditos',
  VERSION: '1.0.0',
  REDIRECT_URL: 'peluditos://auth/callback',
  DEFAULT_ORGANIZATION: 'Peluditos Test',
} as const;

export const STORAGE_KEYS = {
  USER_PROFILE: '@peluditos:user_profile',
  THEME: '@peluditos:theme',
  SELECTED_COLOR: '@peluditos:selected_color',
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_NOT_CONFIRMED: 'Please check your email and verify your account.',
    AUTH_ERROR: 'Authentication error. Please try again or contact support.',
  },
  PROFILE: {
    LOAD_ERROR: 'Failed to load profile. Please try again.',
    UPDATE_ERROR: 'Failed to update profile. Please try again.',
  },
  PHOTO: {
    UPLOAD_ERROR: 'Failed to upload photo. Please try again.',
    LOAD_ERROR: 'Failed to load photos. Please try again.',
  },
  ALBUM: {
    CREATE_ERROR: 'Failed to create album. Please try again.',
    UPDATE_ERROR: 'Failed to update album. Please try again.',
    DELETE_ERROR: 'Failed to delete album. Please try again.',
  },
  CATEGORY: {
    CREATE_ERROR: 'Failed to create category. Please try again.',
    UPDATE_ERROR: 'Failed to update category. Please try again.',
    DELETE_ERROR: 'Failed to delete category. Please try again.',
  },
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  ALBUM_TITLE_MAX_LENGTH: 100,
  CATEGORY_NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

export const UI_CONFIG = {
  SKELETON_ANIMATION_DURATION: 1000,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 1024 * 1024, // 1MB
} as const;
