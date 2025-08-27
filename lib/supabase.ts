import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment } from '../config/environment';

export const supabase = createClient(
  Environment.SUPABASE_URL, 
  Environment.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Types for better TypeScript support
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
  };
  created_at: string;
  updated_at: string;
};

export type AuthError = {
  message: string;
  status?: number;
};
