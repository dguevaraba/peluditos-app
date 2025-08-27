/**
 * Common types used across the application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface UserContext {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'recent' | 'favorites';

export interface NavigationParams {
  [key: string]: any;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface SelectableItem {
  id: string;
  name: string;
  selected?: boolean;
}
