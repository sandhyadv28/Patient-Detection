import { useEffect } from 'react';
import { removeToken, removeRefreshToken, removeCurrentUser } from '../utils/localStorage.util';
import { redirectToLogin } from '../utils/utils';

export function useStorageListener() {
  useEffect(() => {
    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout_event' && e.newValue) {
        // Clear all auth data in current tab
        removeToken();
        removeRefreshToken();
        removeCurrentUser();
        
        // Redirect to login service
        redirectToLogin();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
} 