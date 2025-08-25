import { supabase } from '../lib/supabase';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'veterinarian' | 'assistant' | 'member';
  is_active: boolean;
  joined_at: string;
  updated_at: string;
  // Joined data
  organization?: Organization;
  user_profile?: {
    id: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  is_active?: boolean;
}

export class OrganizationService {
  // Get all organizations for current user
  static async getUserOrganizations(): Promise<{ success: boolean; data?: Organization[]; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          organizations (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user organizations:', error);
        return { success: false, error };
      }

      const organizations = data?.map(item => item.organizations).filter(Boolean) as Organization[];
      return { success: true, data: organizations };
    } catch (error) {
      console.error('Error in getUserOrganizations:', error);
      return { success: false, error };
    }
  }

  // Get organization by ID
  static async getOrganization(organizationId: string): Promise<{ success: boolean; data?: Organization; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getOrganization:', error);
      return { success: false, error };
    }
  }

  // Create new organization
  static async createOrganization(organizationData: CreateOrganizationData): Promise<{ success: boolean; data?: Organization; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user found' };
      }

      const { data, error } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select()
        .single();

      if (error) {
        console.error('Error creating organization:', error);
        return { success: false, error };
      }

      // Add user as owner of the organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: data.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) {
        console.error('Error adding user as owner:', memberError);
        // Continue anyway, the organization was created
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createOrganization:', error);
      return { success: false, error };
    }
  }

  // Update organization
  static async updateOrganization(organizationId: string, updateData: UpdateOrganizationData): Promise<{ success: boolean; data?: Organization; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', organizationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating organization:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateOrganization:', error);
      return { success: false, error };
    }
  }

  // Get organization members
  static async getOrganizationMembers(organizationId: string): Promise<{ success: boolean; data?: OrganizationMember[]; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (*),
          user_profiles!organization_members_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching organization members:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getOrganizationMembers:', error);
      return { success: false, error };
    }
  }

  // Add member to organization
  static async addMember(organizationId: string, userId: string, role: OrganizationMember['role'] = 'member'): Promise<{ success: boolean; data?: OrganizationMember; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          role
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding member:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in addMember:', error);
      return { success: false, error };
    }
  }

  // Update member role
  static async updateMemberRole(organizationId: string, userId: string, role: OrganizationMember['role']): Promise<{ success: boolean; data?: OrganizationMember; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('organization_id', organizationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating member role:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateMemberRole:', error);
      return { success: false, error };
    }
  }

  // Remove member from organization
  static async removeMember(organizationId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ is_active: false })
        .eq('organization_id', organizationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing member:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in removeMember:', error);
      return { success: false, error };
    }
  }

  // Upload organization logo
  static async uploadLogo(base64Data: string, fileName: string): Promise<{ success: boolean; url?: string; error?: any }> {
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
      const finalFileName = `${user.id}/logo_${Date.now()}.${fileExtension}`;
      
      console.log('Uploading logo:', { finalFileName, base64Length: base64Data.length });

      // Upload usando base64 directamente
      const { data, error } = await supabase.storage
        .from('organization-logos')
        .upload(finalFileName, decode(base64Data), {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading logo:', error);
        return { success: false, error };
      }

      console.log('Logo uploaded successfully:', data);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(finalFileName);

      console.log('Public URL:', urlData.publicUrl);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Error in uploadLogo:', error);
      return { success: false, error };
    }
  }
}
