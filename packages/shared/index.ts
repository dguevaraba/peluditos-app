// Re-export Supabase types and functions
export * from '@peluditos/supabase';

// Constants
export const APP_NAME = 'Peluditos';
export const APP_VERSION = '1.0.0';

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VET_SUPPORT: 'vet_support',
  SALES: 'sales',
  USER: 'user'
} as const;

export const PERMISSIONS = {
  // User management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Organization management
  CREATE_ORGANIZATION: 'create_organization',
  READ_ORGANIZATION: 'read_organization',
  UPDATE_ORGANIZATION: 'update_organization',
  DELETE_ORGANIZATION: 'delete_organization',
  
  // Pet management
  CREATE_PET: 'create_pet',
  READ_PET: 'read_pet',
  UPDATE_PET: 'update_pet',
  DELETE_PET: 'delete_pet',
  
  // Product management
  CREATE_PRODUCT: 'create_product',
  READ_PRODUCT: 'read_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  
  // Sales management
  CREATE_SALE: 'create_sale',
  READ_SALE: 'read_sale',
  UPDATE_SALE: 'update_sale',
  DELETE_SALE: 'delete_sale',
  
  // System management
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
  VIEW_AUDIT_LOGS: 'view_audit_logs'
} as const;

// Organization types
export const ORGANIZATION_TYPES = {
  VETERINARY_CLINIC: 'veterinary_clinic',
  PET_SHOP: 'pet_shop',
  GROOMING: 'grooming',
  TRAINING: 'training',
  OTHER: 'other'
} as const;

// Pet species
export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  HAMSTER: 'hamster',
  FISH: 'fish',
  REPTILE: 'reptile',
  OTHER: 'other'
} as const;

// Utility functions
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Color utilities
export const getRandomColor = (): string => {
  const colors = [
    '#65b6ad', '#7FB3BA', '#B8A9C9', '#F4C2A1', '#FF6B6B',
    '#98D8C8', '#F7CAC9', '#9CAF88', '#D4A5A5', '#F4A261'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return '#4CAF50';
    case 'pending':
    case 'processing':
      return '#FF9800';
    case 'inactive':
    case 'cancelled':
    case 'error':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};
