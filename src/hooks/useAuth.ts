import { useState, useEffect } from 'react';
import { getCurrentUser } from '../_lib/localStorage.util';
import { UseAuthReturn, User } from '../components/modals';
import { handleLogout, initializeAuthFromURL, checkAuthStatus } from '../utils/auth';

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const logout = () => {
    handleLogout();
  };

  // Initialize auth from URL parameters on mount
  useEffect(() => {
    initializeAuthFromURL();
    
    // Check if user is already authenticated
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Check auth status and redirect if needed
      checkAuthStatus();
    }
  }, []);

  return {
    user,
    showAuthModal,
    handleLogin,
    handleLogout: logout,
    setShowAuthModal,
  };
} 