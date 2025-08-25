import { supabase } from '../lib/supabase';
import { User } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  avatar_url?: string;
  date_of_birth?: string;
  // Campos específicos de la app de mascotas
  preferred_vet?: string;
  emergency_contact?: string;
  pet_preferences?: string[];
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileData {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  date_of_birth?: string;
  avatar_url?: string | null;
  // Campos específicos de la app de mascotas
  preferred_vet?: string;
  emergency_contact?: string;
  pet_preferences?: string[];
}

export class UserService {
  // Get current user profile
  static async getCurrentUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Si el perfil no existe, intentar crearlo
        if (error.code === 'PGRST116') {
          const createResult = await this.createUserProfile(user);
          if (createResult.success) {
            return { success: true, data: createResult.data };
          }
        }
        
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return { success: false, error };
    }
  }

  // Create user profile
  static async createUserProfile(user: any): Promise<{ success: boolean; data?: UserProfile; error?: any }> {
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        phone: user.phone || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return { success: false, error };
    }
  }

  // Debug method to check database state
  static async debugDatabaseState(): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      console.log('🔍 UserService: Debugging database state...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      console.log('🔍 UserService: Current user:', user);

      // Check if table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      console.log('🔍 UserService: Table check:', { tableCheck, tableError });

      // Check if user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id);

      console.log('🔍 UserService: Profile check:', { profileData, profileError });

      return { 
        success: true, 
        data: { 
          user, 
          tableExists: !tableError, 
          profileExists: profileData && profileData.length > 0,
          profileData: profileData?.[0] || null
        } 
      };
    } catch (error) {
      console.error('🔴 UserService: Debug error:', error);
      return { success: false, error };
    }
  }

  // Sync user data between auth.users and user_profiles
  static async syncUserData(): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Update auth user metadata if needed
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        }
      });

      if (authError) {
        console.error('Error updating auth user:', authError);
      }

      // Update profile with auth data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          phone: user.phone || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error syncing profile:', profileError);
        return { success: false, error: profileError };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in syncUserData:', error);
      return { success: false, error };
    }
  }

  // Update user profile
  static async updateUserProfile(profileData: UpdateUserProfileData): Promise<{ success: boolean; data?: UserProfile; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email || '', // Asegurar que siempre incluya el email
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return { success: false, error };
    }
  }

  // Upload user avatar
  static async uploadAvatar(base64Data: string, fileName: string): Promise<{ success: boolean; url?: string; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Verificar que el base64 no esté vacío
      if (!base64Data || base64Data.length === 0) {
        console.error('Base64 data is empty or invalid');
        return { success: false, error: 'Base64 data is empty or invalid' };
      }

      // Generar nombre único para el archivo
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const finalFileName = `${user.id}/avatar_${Date.now()}.${fileExtension}`;
      
      console.log('Uploading avatar:', { finalFileName, base64Length: base64Data.length });

      // Upload usando base64 directamente
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(finalFileName, decode(base64Data), {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        return { success: false, error };
      }

      console.log('Avatar uploaded successfully:', data);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(finalFileName);

      console.log('Public URL:', urlData.publicUrl);

      // Actualizar perfil con nueva URL de avatar
      const updateResult = await this.updateUserProfile({ avatar_url: urlData.publicUrl });
      if (!updateResult.success) {
        console.error('Failed to update profile with avatar URL:', updateResult.error);
        return { success: false, error: 'Failed to update profile with avatar URL' };
      }

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return { success: false, error };
    }
  }

  // Delete user avatar
  static async deleteAvatar(): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Get current profile to find avatar URL
      const profileResult = await this.getCurrentUserProfile();
      if (!profileResult.success || !profileResult.data?.avatar_url) {
        return { success: false, error: 'No avatar found' };
      }

      // Extract file path from URL
      const url = profileResult.data.avatar_url;
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      console.log('Deleting avatar:', { url, filePath });

      if (fileName) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('user-avatars')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting avatar from storage:', storageError);
          // Continuar aunque falle el borrado del storage
        } else {
          console.log('Avatar deleted from storage successfully');
        }
      }

      // Update profile to remove avatar URL
      const updateResult = await this.updateUserProfile({
        avatar_url: null
      });

      return updateResult;
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      return { success: false, error };
    }
  }

  // Update user email
  static async updateEmail(newEmail: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        console.error('Error updating email:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateEmail:', error);
      return { success: false, error };
    }
  }

  // Update user password
  static async updatePassword(newPassword: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return { success: false, error };
    }
  }

  // Delete user account
  static async deleteAccount(): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
      }

      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        console.error('Error deleting user account:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      return { success: false, error };
    }
  }
}
