'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../lib/auth';
import { User, Session } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check for existing session on app start
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user as User);
          setSession(session as Session);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user as User);
          setSession(session as Session);
          // Don't set loading to false here, keep current state
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionResult = await AuthService.getCurrentSession();
      if (sessionResult.success && sessionResult.session) {
        setUser(sessionResult.user!);
        setSession(sessionResult.session);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setLoading(false);
    } finally {
      setInitialized(true);
    }
  };

  const signOut = async () => {
    try {
      // Don't set loading to true for signout
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      // Redirect to login after signout
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  // Only show loading if we haven't initialized yet
  const shouldShowLoading = loading && !initialized;

  const value: AuthContextType = {
    user,
    session,
    loading: shouldShowLoading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
