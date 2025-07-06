import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken, setCurrentUser, removeCurrentUser } from './localStorage.util';
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