export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem("refreshToken", refreshToken);
}

export function removeRefreshToken() {
  localStorage.removeItem("refreshToken");
}

export function getCurrentUser(): any {
  try {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
}

export function setCurrentUser(userData: string) {
  try {
    const decodedUserData = decodeURIComponent(userData);
    localStorage.setItem("currentUser", decodedUserData);
  } catch (error) {
    // Silent fail for production
  }
}

export function removeCurrentUser() {
  localStorage.removeItem("currentUser");
}