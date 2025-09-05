'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface UXPreferences {
  organizationsViewMode: 'grid' | 'list';
  // Futuras preferencias se pueden agregar aquí
  // usersViewMode?: 'grid' | 'list';
  // petsViewMode?: 'grid' | 'list';
  // defaultFilters?: Record<string, any>;
}

interface UXContextType {
  preferences: UXPreferences;
  isLoading: boolean;
  updatePreference: <K extends keyof UXPreferences>(
    key: K,
    value: UXPreferences[K]
  ) => void;
}

const defaultPreferences: UXPreferences = {
  organizationsViewMode: 'grid',
};

const UXContext = createContext<UXContextType | undefined>(undefined);

export function UXProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UXPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar preferencias de la DB cuando el usuario se autentica
  useEffect(() => {
    if (user && !hasLoaded) {
      loadPreferences();
    }
  }, [user, hasLoaded]);

  // Debounced save - solo guarda después de 1 segundo de inactividad
  useEffect(() => {
    if (hasLoaded && user) {
      const timeoutId = setTimeout(() => {
        savePreferences();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [preferences, hasLoaded, user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.warn('Error loading preferences:', error);
      } else if (data) {
        setPreferences({ ...defaultPreferences, ...data.preferences });
      }
    } catch (error) {
      console.warn('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  const savePreferences = async () => {
    if (!user || !hasLoaded) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: preferences
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.warn('Error saving preferences:', error);
      }
    } catch (error) {
      console.warn('Error saving preferences:', error);
    }
  };

  const updatePreference = <K extends keyof UXPreferences>(
    key: K,
    value: UXPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <UXContext.Provider value={{ preferences, isLoading, updatePreference }}>
      {children}
    </UXContext.Provider>
  );
}

export function useUX() {
  const context = useContext(UXContext);
  if (context === undefined) {
    throw new Error('useUX must be used within a UXProvider');
  }
  return context;
}
