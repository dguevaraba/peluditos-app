import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://goycdfmmrtqnfkhmiotn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveWNkZm1tcnRxbmZraG1pb3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDUwMjgsImV4cCI6MjA3MTYyMTAyOH0.IcWzqWy1MviVP0BvWlYTPxf5HqaNDXCUFfGtcYnlF6g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types for better TypeScript support
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
    role?: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type AuthError = {
  message: string;
  status?: number;
};

export type Session = {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_at?: number;
};

// Check if user is admin (you can customize this logic)
export const isAdmin = (user: User): boolean => {
  // For now, allow any authenticated user to access the admin panel
  // You can customize this logic later based on your needs
  return true;
  
  // Original strict logic (commented out for now):
  // return user.user_metadata?.role === 'admin' || 
  //        user.email?.endsWith('@admin.peluditos.com') || 
  //        user.email === 'admin@peluditos.com';
};
