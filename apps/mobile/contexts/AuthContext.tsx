import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Linking } from 'react-native';
import { AuthService } from '../services/authService';
import { User } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: any;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Check for existing session on app start
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as User);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          // Re-check user after token refresh
          checkUser();
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { success, user } = await AuthService.getCurrentUser();
      if (success && user) {
        setUser(user as User);
        // Load user profile immediately after setting user
        await loadUserProfile(user.id);
      }
    } catch (error) {
      // Error handling - could integrate with crash reporting in production
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { UserService } = await import('../services/userService');
      const result = await UserService.getCurrentUserProfile();
      if (result.success && result.data) {
        setUserProfile(result.data);
        // Update user with profile data including avatar
        if (result.data.avatar_url) {
          setUser(prevUser => prevUser ? {
            ...prevUser,
            user_metadata: {
              ...prevUser.user_metadata,
              avatar_url: result.data.avatar_url,
              full_name: result.data.full_name || prevUser.user_metadata?.full_name
            }
          } : null);
        }
      }
    } catch (error) {
      // Error handling - could integrate with crash reporting in production
    }
  };

  const signInWithGoogle = async () => {
    try {

      setLoading(true);
      const result = await AuthService.signInWithGoogle();
      
      if (result.success && result.data?.url) {
        try {
          const authResult = await WebBrowser.openAuthSessionAsync(
            result.data.url,
            'peluditos://auth/callback'
          );
          
          if (authResult.type === 'success' && authResult.url) {
            // The session should be automatically handled by Supabase
            // We just need to wait for the auth state change
          } else if (authResult.type === 'cancel') {
            // User cancelled authentication
          } else {
            // Auth failed
          }
        } catch (browserError) {
          // WebBrowser error handling
        }
      } else if (!result.success) {
        // Google sign in error handling
      }
    } catch (error) {
      // Google sign in error handling
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log('🔵 AuthContext: Starting Facebook sign in...');
      setLoading(true);
      const result = await AuthService.signInWithFacebook();
      console.log('🔵 AuthContext: Facebook sign in result:', result);
      
      if (result.success && result.data?.url) {
        console.log('🔵 AuthContext: Opening URL with WebBrowser...');
        try {
          const authResult = await WebBrowser.openAuthSessionAsync(
            result.data.url,
            'peluditos://auth/callback'
          );
          
          console.log('🔵 AuthContext: WebBrowser result:', authResult);
          
          if (authResult.type === 'success' && authResult.url) {
            console.log('🔵 AuthContext: Auth successful, URL:', authResult.url);
            // The session should be automatically handled by Supabase
            // We just need to wait for the auth state change
          } else if (authResult.type === 'cancel') {
            console.log('🔵 AuthContext: Auth cancelled by user');
          } else {
            console.error('🔴 AuthContext: Auth failed:', authResult);
          }
        } catch (browserError) {
          console.error('🔴 AuthContext: WebBrowser error:', browserError);
        }
      } else if (!result.success) {
        console.error('🔴 AuthContext: Facebook sign in error:', result.error);
      }
    } catch (error) {
      console.error('🔴 AuthContext: Facebook sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const result = await AuthService.signInWithApple();
      if (!result.success) {
        // Apple sign in error handling
      }
    } catch (error) {
      // Apple sign in error handling
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const result = await AuthService.signUpWithEmail(email, password, fullName);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await AuthService.signInWithEmail(email, password);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const result = await AuthService.signOut();
      if (!result.success) {
        // Sign out error handling
      }
    } catch (error) {
      // Sign out error handling
    } finally {
      setLoading(false);
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          avatar_url: avatarUrl,
        },
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    userProfile,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    updateUserAvatar,
    refreshUserProfile: () => loadUserProfile(user?.id || ''),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
