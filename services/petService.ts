import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other';
  breed?: string;
  color?: string;
  birth_date?: string;
  weight?: number;
  weight_unit: 'kg' | 'lb';
  gender?: 'male' | 'female' | 'unknown';
  microchip_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PetMedicalRecord {
  id: string;
  pet_id: string;
  organization_id?: string;
  record_type: 'vaccination' | 'checkup' | 'surgery' | 'treatment' | 'medication' | 'test' | 'other';
  title: string;
  description?: string;
  date: string;
  next_date?: string;
  cost?: number;
  currency: string;
  veterinarian_name?: string;
  notes?: string;
  attachments?: any;
  created_at: string;
  updated_at: string;
  // Joined data
  organization?: {
    id: string;
    name: string;
  };
}

export interface PetReminder {
  id: string;
  pet_id: string;
  title: string;
  description?: string;
  reminder_type: 'vaccination' | 'medication' | 'checkup' | 'grooming' | 'feeding' | 'other';
  due_date: string;
  due_time?: string;
  is_completed: boolean;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePetData {
  name: string;
  species: Pet['species'];
  breed?: string;
  color?: string;
  birth_date?: string;
  weight?: number;
  weight_unit?: 'kg' | 'lb';
  gender?: 'male' | 'female' | 'unknown';
  microchip_id?: string;
  avatar_url?: string;
}

export interface UpdatePetData {
  name?: string;
  species?: Pet['species'];
  breed?: string;
  color?: string;
  birth_date?: string;
  weight?: number;
  weight_unit?: 'kg' | 'lb';
  gender?: 'male' | 'female' | 'unknown';
  microchip_id?: string;
  avatar_url?: string;
  is_active?: boolean;
}

export interface CreateMedicalRecordData {
  pet_id: string;
  organization_id?: string;
  record_type: PetMedicalRecord['record_type'];
  title: string;
  description?: string;
  date: string;
  next_date?: string;
  cost?: number;
  currency?: string;
  veterinarian_name?: string;
  notes?: string;
  attachments?: any;
}

export interface CreateReminderData {
  pet_id: string;
  title: string;
  description?: string;
  reminder_type: PetReminder['reminder_type'];
  due_date: string;
  due_time?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}

export class PetService {
  // Get all pets for current user
  static async getUserPets(): Promise<{ success: boolean; data?: Pet[]; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user pets:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getUserPets:', error);
      return { success: false, error };
    }
  }

  // Get pet by ID
  static async getPet(petId: string): Promise<{ success: boolean; data?: Pet; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching pet:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getPet:', error);
      return { success: false, error };
    }
  }

  // Create new pet
  static async createPet(petData: CreatePetData): Promise<{ success: boolean; data?: Pet; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pets')
        .insert({
          ...petData,
          user_id: user.id,
          weight_unit: petData.weight_unit || 'kg'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating pet:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createPet:', error);
      return { success: false, error };
    }
  }

  // Update pet
  static async updatePet(petId: string, updateData: UpdatePetData): Promise<{ success: boolean; data?: Pet; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating pet:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePet:', error);
      return { success: false, error };
    }
  }

  // Delete pet (soft delete)
  static async deletePet(petId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { error } = await supabase
        .from('pets')
        .update({ is_active: false })
        .eq('id', petId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting pet:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deletePet:', error);
      return { success: false, error };
    }
  }

  // Get pet medical records
  static async getPetMedicalRecords(petId: string): Promise<{ success: boolean; data?: PetMedicalRecord[]; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pet_medical_records')
        .select(`
          *,
          organizations (
            id,
            name
          )
        `)
        .eq('pet_id', petId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching pet medical records:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getPetMedicalRecords:', error);
      return { success: false, error };
    }
  }

  // Create medical record
  static async createMedicalRecord(recordData: CreateMedicalRecordData): Promise<{ success: boolean; data?: PetMedicalRecord; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Verify pet belongs to user
      const { data: pet } = await supabase
        .from('pets')
        .select('id')
        .eq('id', recordData.pet_id)
        .eq('user_id', user.id)
        .single();

      if (!pet) {
        return { success: false, error: 'Pet not found or access denied' };
      }

      const { data, error } = await supabase
        .from('pet_medical_records')
        .insert({
          ...recordData,
          currency: recordData.currency || 'USD'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating medical record:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createMedicalRecord:', error);
      return { success: false, error };
    }
  }

  // Get pet reminders
  static async getPetReminders(petId: string): Promise<{ success: boolean; data?: PetReminder[]; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pet_reminders')
        .select('*')
        .eq('pet_id', petId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching pet reminders:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getPetReminders:', error);
      return { success: false, error };
    }
  }

  // Create reminder
  static async createReminder(reminderData: CreateReminderData): Promise<{ success: boolean; data?: PetReminder; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      // Verify pet belongs to user
      const { data: pet } = await supabase
        .from('pets')
        .select('id')
        .eq('id', reminderData.pet_id)
        .eq('user_id', user.id)
        .single();

      if (!pet) {
        return { success: false, error: 'Pet not found or access denied' };
      }

      const { data, error } = await supabase
        .from('pet_reminders')
        .insert(reminderData)
        .select()
        .single();

      if (error) {
        console.error('Error creating reminder:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createReminder:', error);
      return { success: false, error };
    }
  }

  // Update reminder
  static async updateReminder(reminderId: string, updateData: Partial<PetReminder>): Promise<{ success: boolean; data?: PetReminder; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('pet_reminders')
        .update(updateData)
        .eq('id', reminderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating reminder:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateReminder:', error);
      return { success: false, error };
    }
  }

  // Delete reminder
  static async deleteReminder(reminderId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { error } = await supabase
        .from('pet_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) {
        console.error('Error deleting reminder:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteReminder:', error);
      return { success: false, error };
    }
  }

  // Upload pet avatar
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
      const finalFileName = `${user.id}/pet_avatar_${Date.now()}.${fileExtension}`;
      
      console.log('Uploading pet avatar:', { finalFileName, base64Length: base64Data.length });

      // Upload usando base64 directamente
      const { data, error } = await supabase.storage
        .from('pet-avatars')
        .upload(finalFileName, decode(base64Data), {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading pet avatar:', error);
        return { success: false, error };
      }

      console.log('Pet avatar uploaded successfully:', data);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('pet-avatars')
        .getPublicUrl(finalFileName);

      console.log('Public URL:', urlData.publicUrl);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return { success: false, error };
    }
  }
}
