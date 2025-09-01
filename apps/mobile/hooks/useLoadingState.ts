import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingState = (initialKeys: string[] = []) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(() => {
    const initial: LoadingState = {};
    initialKeys.forEach(key => {
      initial[key] = false;
    });
    return initial;
  });

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingState[key] || false;
  }, [loadingState]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingState).some(loading => loading);
  }, [loadingState]);

  const withLoading = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    loadingState,
  };
};
