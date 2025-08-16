import { useCallback, useRef } from 'react';

/**
 * Smart debounce hook that provides immediate visual feedback
 * and optimizes update frequency based on user interaction state
 */
export function useSmartDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100,
  immediateDelay: number = 16
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use immediate delay for active interactions, regular delay otherwise
      const currentDelay = isActiveRef.current ? immediateDelay : delay;
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, currentDelay);
    },
    [callback, delay, immediateDelay]
  );

  const startActiveMode = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  const endActiveMode = useCallback(() => {
    isActiveRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    debouncedCallback,
    startActiveMode,
    endActiveMode,
    flush
  };
}

export default useSmartDebounce;
