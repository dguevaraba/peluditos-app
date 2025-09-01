import { supabase } from '../lib/supabase';

export interface ChatCategory {
  id: string;
  name: string;
  display_name: string;
  icon_name: string;
  color: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  category_id?: string;
  title?: string;
  market_item_id?: string;
  community_user_id?: string;
  messages: any[];
  created_at: string;
  updated_at: string;
  category?: ChatCategory;
}

export interface CreateChatConversationData {
  category_id?: string;
  title?: string;
  market_item_id?: string;
  community_user_id?: string;
}

class ChatService {
  // Obtener todas las categorías activas
  async getChatCategories(): Promise<ChatCategory[]> {
    try {
      const { data, error } = await supabase
        .from('chat_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_name');

      if (error) {
        console.error('Error fetching chat categories:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching chat categories:', error);
      throw error;
    }
  }

  // Obtener conversaciones del usuario
  async getUserConversations(): Promise<ChatConversation[]> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user authenticated, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          category:chat_categories(*)
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user conversations:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      throw error;
    }
  }

  // Crear nueva conversación
  async createConversation(conversationData: CreateChatConversationData): Promise<ChatConversation> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Agregar el user_id a los datos de la conversación
      const conversationWithUserId = {
        ...conversationData,
        user_id: user.id
      };

      console.log('Creating conversation with data:', conversationWithUserId);

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([conversationWithUserId])
        .select(`
          *,
          category:chat_categories(*)
        `)
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Obtener conversación específica
  async getConversation(conversationId: string): Promise<ChatConversation | null> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          category:chat_categories(*)
        `)
        .eq('id', conversationId)
        .eq('user_id', user.id) // Asegurar que solo obtenga sus propias conversaciones
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  // Actualizar conversación con nuevos mensajes
  async updateConversation(conversationId: string, messages: any[]): Promise<ChatConversation> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .update({ 
          messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .eq('user_id', user.id) // Asegurar que solo actualice sus propias conversaciones
        .select(`
          *,
          category:chat_categories(*)
        `)
        .single();

      if (error) {
        console.error('Error updating conversation:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  // Eliminar conversación
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id); // Asegurar que solo elimine sus propias conversaciones

      if (error) {
        console.error('Error deleting conversation:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // Buscar conversación existente por categoría y contexto
  async findExistingConversation(
    categoryId?: string, 
    marketItemId?: string, 
    communityUserId?: string
  ): Promise<ChatConversation | null> {
    try {
      // Verificar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('chat_conversations')
        .select(`
          *,
          category:chat_categories(*)
        `)
        .eq('user_id', user.id); // Asegurar que solo busque sus propias conversaciones

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      if (marketItemId) {
        query = query.eq('market_item_id', marketItemId);
      }
      if (communityUserId) {
        query = query.eq('community_user_id', communityUserId);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data || null;
    } catch (error) {
      console.error('Error finding existing conversation:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
