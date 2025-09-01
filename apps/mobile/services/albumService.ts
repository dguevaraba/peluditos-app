import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

export interface Album {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  location?: string;
  date: string;
  is_featured: boolean;
  is_public: boolean;
  user_id: string;
  organization_id?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAlbumData {
  title: string;
  description?: string;
  cover_image_url?: string;
  location?: string;
  date: string;
  is_featured?: boolean;
  is_public?: boolean;
  category_id?: string;
}

export class AlbumService {
  // Obtener todos los álbumes del usuario
  static async getUserAlbums(userId: string): Promise<Album[]> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          categories(name, color, icon)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user albums:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserAlbums:', error);
      throw error;
    }
  }

  // Obtener álbum por ID
  static async getAlbumById(id: string): Promise<Album | null> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          categories(name, color, icon)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching album:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getAlbumById:', error);
      throw error;
    }
  }

  // Crear nuevo álbum
  static async createAlbum(albumData: CreateAlbumData, userId: string): Promise<Album> {
    try {
      // Usar SQL directo para evitar problemas con RLS
      const { data, error } = await supabase
        .rpc('create_album_direct', {
          p_title: albumData.title,
          p_description: albumData.description || null,
          p_cover_image_url: albumData.cover_image_url || null,
          p_location: albumData.location || null,
          p_date: albumData.date,
          p_is_featured: albumData.is_featured || false,
          p_is_public: albumData.is_public !== false,
          p_category_id: albumData.category_id || null,
          p_user_id: userId
        });

      if (error) {
        console.error('Error creating album via RPC:', error);
        // Fallback: intentar inserción directa con bypass de RLS
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('albums')
          .insert([{
            title: albumData.title,
            description: albumData.description,
            cover_image_url: albumData.cover_image_url,
            location: albumData.location,
            date: albumData.date,
            is_featured: albumData.is_featured || false,
            is_public: albumData.is_public !== false,
            category_id: albumData.category_id,
            user_id: userId
          }])
          .select()
          .single();

        if (fallbackError) {
          console.error('Error creating album (fallback):', fallbackError);
          throw fallbackError;
        }

        return fallbackData;
      }

      return data;
    } catch (error) {
      console.error('Error in createAlbum:', error);
      throw error;
    }
  }

  // Actualizar álbum
  static async updateAlbum(id: string, updates: Partial<CreateAlbumData>): Promise<Album> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating album:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateAlbum:', error);
      throw error;
    }
  }

  // Eliminar álbum
  static async deleteAlbum(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting album:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteAlbum:', error);
      throw error;
    }
  }

  // Obtener álbumes por categoría
  static async getAlbumsByCategory(userId: string, categoryId: string): Promise<Album[]> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          categories(name, color, icon)
        `)
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching albums by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAlbumsByCategory:', error);
      throw error;
    }
  }

  // Obtener álbumes destacados
  static async getFeaturedAlbums(userId: string): Promise<Album[]> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          categories(name, color, icon)
        `)
        .eq('user_id', userId)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured albums:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedAlbums:', error);
      throw error;
    }
  }

  // Actualizar imagen de portada del álbum
  static async updateAlbumCoverImage(albumId: string, imageUri: string): Promise<Album> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get or create user profile
      let { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!userProfile?.id) {
        // Create user profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url,
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          throw new Error('Failed to create user profile');
        }

        userProfile = newProfile;
      }

      // Generate unique filename for cover image
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `album-covers/${user.id}/${albumId}/${Date.now()}.${fileExtension}`;

      // Convert image to base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-photos')
        .upload(fileName, decode(base64Image), {
          contentType: `image/${fileExtension}`,
          cacheControl: '3600',
          upsert: true, // Overwrite if exists
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-photos')
        .getPublicUrl(fileName);

      // Update album with new cover image URL
      const { data: album, error: updateError } = await supabase
        .from('albums')
        .update({
          cover_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', albumId)
        .select()
        .single();

      if (updateError) {
        // If update fails, delete the uploaded file
        await supabase.storage
          .from('gallery-photos')
          .remove([fileName]);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      return album;
    } catch (error) {
      console.error('Error updating album cover image:', error);
      throw error;
    }
  }
}

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
