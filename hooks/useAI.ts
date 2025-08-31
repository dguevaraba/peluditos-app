import { useState, useCallback } from 'react';
import { aiService, AIResponse } from '../services/aiService';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    conversationId?: string,
    petContext?: any
  ): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.sendMessage(message, conversationId, petContext);
      
      if (!response.success) {
        setError(response.error || 'Error desconocido');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
  };
};
