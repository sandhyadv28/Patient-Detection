import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../store/hook';
import { getToken } from '../_lib/localStorage.util';
import { redirectToLogin } from '../config';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const isMounted = useRef(true);
  const dispatch = useAppDispatch();

  const initializeAPI = async () => {
    if (!getToken()) {
      redirectToLogin();
      return;
    }

    try {
      // Add your API initialization logic here
      // For example:
      // await dispatch(fetchUserProfile());
      // await dispatch(initializeAppData());
      
      console.log('API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize API:', error);
      // Handle initialization error - could redirect to login or show error
      redirectToLogin();
    } finally {
      if (isMounted.current) {
        setIsInitializing(false);
      }
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      initializeAPI();
    }

    return () => {
      isMounted.current = false;
    };
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 