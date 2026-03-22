import { useState } from "react";

/**
 * Hook to persist and restore state from localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setStateInternal] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setState = (value: T) => {
    try {
      setStateInternal(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage may be unavailable in some contexts
      setStateInternal(value);
    }
  };

  return [state, setState];
}
