import { useEffect, useState } from 'react';
import { UseAuthReturn, User } from '../components/modals';
import { checkAuthStatus, handleLogout, initializeAuthFromURL, validateCurrentToken } from '../utils/auth';
import { getCurrentUser } from '../utils/localStorage.util';

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const logout = () => {
    handleLogout();
  };

  // Initialize auth from URL parameters on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        initializeAuthFromURL();

        if (validateCurrentToken()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        } else {
          checkAuthStatus();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        checkAuthStatus();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    showAuthModal,
    handleLogin,
    handleLogout: logout,
    setShowAuthModal,
    isLoading,
  };
} 