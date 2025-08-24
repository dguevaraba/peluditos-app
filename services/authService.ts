import { supabase } from '../lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export class AuthService {
    // Sign in with Google
  static async signInWithGoogle() {
    try {
      console.log('🔵 Starting Google sign in...');

      // Get the redirect URI for the current platform
      const redirectUri = makeRedirectUri({
        scheme: 'peluditos',
        path: 'auth/callback',
      });

      console.log('🔵 Redirect URI:', redirectUri);

      const response = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      console.log('🔵 Google OAuth response:', response);
      
      if (response.error) {
        console.error('🔴 Google OAuth error:', response.error);
        return { success: false, error: response.error };
      }

      // Return the response directly - let Supabase handle the redirect
      console.log('🔵 Returning OAuth response for browser handling');
      return { success: true, data: response.data, error: response.error };
    } catch (error) {
      console.error('🔴 Google sign in error:', error);
      return { success: false, error: error as Error };
    }
  }

  // Sign in with Facebook
  static async signInWithFacebook() {
    try {
      console.log('🔵 Starting Facebook sign in...');

      // Get the redirect URI for the current platform
      const redirectUri = makeRedirectUri({
        scheme: 'peluditos',
        path: 'auth/callback',
      });

      console.log('🔵 Redirect URI:', redirectUri);

      const response = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUri,
          scopes: 'public_profile', // Solo solicitamos public_profile por ahora
        },
      });

      console.log('🔵 Facebook OAuth response:', response);
      
      if (response.error) {
        console.error('🔴 Facebook OAuth error:', response.error);
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data, error: response.error };
    } catch (error) {
      console.error('🔴 Facebook sign in error:', error);
      return { success: false, error: error as Error };
    }
  }

  // Sign in with Apple
  static async signInWithApple() {
    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'peluditos://auth/callback',
        },
      });

      return { success: true, data: response.data, error: response.error };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { success: !error, error };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { success: !error, user, error };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { success: !error, session, error };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // Sign up with email and password
  static async signUpWithEmail(email: string, password: string, fullName: string) {
    try {
      console.log('🔵 Starting email sign up...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('🔵 Email sign up response:', data);
      
      if (error) {
        console.error('🔴 Email sign up error:', error);
        return { success: false, error };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('🔴 Email sign up error:', error);
      return { success: false, error: error as Error };
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string) {
    try {
      console.log('🔵 Starting email sign in...');
      console.log('🔵 Email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔵 Email sign in response:', data);
      console.log('🔵 Email sign in error:', error);
      
      if (error) {
        console.error('🔴 Email sign in error:', error);
        console.error('🔴 Error message:', error.message);
        console.error('🔴 Error status:', error.status);
        return { success: false, error };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('🔴 Email sign in error:', error);
      return { success: false, error: error as Error };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
