import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Create Supabase admin client (for privileged operations)
// Only available on server-side
export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase admin client can only be used on the server side');
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Missing required SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

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
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) throw error;
  return data;
};
