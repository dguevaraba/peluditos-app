import { supabase, User, Session, isAdmin } from './supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

export class AuthService {
  // Sign in with email and password
  static async signInWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        return { 
          success: true, 
          user: data.user as User, 
          session: data.session as Session
        };
      }

      return { success: false, error: 'No se pudo iniciar sesión' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (user) {
        return { success: true, user: user as User };
      }

      return { success: false, error: 'Usuario no autenticado' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (session) {
        return { success: true, session: session as Session, user: session.user as User };
      }

      return { success: false, error: 'Sesión no válida' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Use the local isAdmin function
  static isAdmin = isAdmin;
}
