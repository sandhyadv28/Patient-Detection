import { useState } from 'react';
import { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  showAuthModal: boolean;
  handleLogin: (userData: User) => void;
  handleLogout: () => void;
  setShowAuthModal: (show: boolean) => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return {
    user,
    showAuthModal,
    handleLogin,
    handleLogout,
    setShowAuthModal,
  };
} 