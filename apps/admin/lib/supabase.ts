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

// Create Supabase admin client (for privileged operations)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveWNkZm1tcnRxbmZraG1pb3RuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA0NTAyOCwiZXhwIjoyMDcxNjIxMDI4fQ.eJR7g1N5UantbvnKmbb7XGNAVaoQL0UhNMqqQODIT34'
);

// Test function to verify admin client


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
  if (!user) return false;
  
  // Check role in user_metadata
  if (user.user_metadata?.role === 'admin') return true;
  
  // Check if user has admin role in user_profiles
  // This would require a database query in practice
  return false;
};

// Admin functions for user management
export const createAuthUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0], // Default name from email
          role: 'member'
        },
      },
    })

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
};

export const listAuthUsers = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) throw error;
  return data;
};
