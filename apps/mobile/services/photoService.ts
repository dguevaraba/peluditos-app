import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

export interface Photo {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  album_id?: string;
  uploaded_by: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePhotoData {
  title: string;
  description?: string;
  album_id?: string;
  is_featured?: boolean;
}

export class PhotoService {
  static async uploadPhoto(
    imageUri: string,
    photoData: CreatePhotoData
  ): Promise<Photo> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get or create user profile for uploaded_by reference
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
            id: user.id, // Use user.id as the primary key
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

      // Generate unique filename
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
      const filePath = `gallery-photos/${fileName}`;

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
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-photos')
        .getPublicUrl(fileName);

      // Insert photo record into database
      const { data: photo, error: insertError } = await supabase
        .from('photos')
        .insert({
          title: photoData.title,
          description: photoData.description,
          image_url: publicUrl,
          album_id: photoData.album_id,
          uploaded_by: userProfile.id,
          is_featured: photoData.is_featured || false,
        })
        .select()
        .single();

      if (insertError) {
        // If insert fails, delete the uploaded file
        await supabase.storage
          .from('gallery-photos')
          .remove([fileName]);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      return photo;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  static async getPhotosByAlbum(albumId: string): Promise<Photo[]> {
    try {
      const { data: photos, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`);
      }

      return photos || [];
    } catch (error) {
      console.error('Error fetching photos by album:', error);
      throw error;
    }
  }

  static async getPhotosByUser(): Promise<Photo[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get or create user profile first
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
            id: user.id, // Use user.id as the primary key
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

      const { data: photos, error } = await supabase
        .from('photos')
        .select('*')
        .eq('uploaded_by', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch user photos: ${error.message}`);
      }

      return photos || [];
    } catch (error) {
      console.error('Error fetching user photos:', error);
      throw error;
    }
  }

  static async deletePhoto(photoId: string): Promise<void> {
    try {
      // Get photo details first
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('image_url')
        .eq('id', photoId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch photo: ${fetchError.message}`);
      }

      // Extract filename from URL
      const urlParts = photo.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery-photos')
        .remove([fileName]);

      if (storageError) {
        console.warn('Failed to delete from storage:', storageError);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) {
        throw new Error(`Failed to delete photo: ${deleteError.message}`);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
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
