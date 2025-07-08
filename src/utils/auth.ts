import { getCurrentUser, getToken, removeCurrentUser, removeRefreshToken, removeToken, setCurrentUser, setRefreshToken, setToken } from './localStorage.util';
import { redirectToLogin } from './utils';

export function handleLogout() {
  // Set logout event in localStorage to notify other tabs
  localStorage.setItem('logout_event', Date.now().toString());

  // Clear all auth data in current tab
  removeToken();
  removeRefreshToken();
  removeCurrentUser();
  
  // Redirect to login service
  redirectToLogin();
}

export function initializeAuthFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const newParams = new URLSearchParams(window.location.search);
  
  const token = urlParams.get('token');
  const refreshToken = urlParams.get('refreshToken');
  const currentUser = urlParams.get('currentUser');
  
  let isQueryParamRemoved = false;

  if (token) {
    setToken(token);
    newParams.delete("token");
    isQueryParamRemoved = true;
  }

  if (refreshToken) {
    setRefreshToken(refreshToken);
    newParams.delete("refreshToken");
    isQueryParamRemoved = true;
  }

  if (currentUser) {
    setCurrentUser(currentUser);
    newParams.delete("currentUser");
    isQueryParamRemoved = true;
  }

  if (isQueryParamRemoved) {
    const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
    window.history.replaceState({}, '', newUrl);
  }
}

export function checkAuthStatus() {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return false;
  }
  return true;
}

export function validateCurrentToken(): boolean {
  const token = getToken();
  const currentUser = getCurrentUser();
  
  if (!token || !currentUser) {
    return false;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        removeToken();
        removeRefreshToken();
        removeCurrentUser();
        return false;
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
} 