import { createContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin, registerAdmin, getMe, logout as logoutApi } from '../api/auth';
import { authStorage } from '../utils/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback((token, userData) => {
    authStorage.setAuth(token, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (authStorage.getToken()) await logoutApi();
    } catch {
      // Clear local session even if API call fails
    } finally {
      authStorage.clear();
      setUser(null);
    }
  }, []);

  const login = async (credentials) => {
    const { data } = await loginAdmin(credentials);
    if (data.user.role !== 'admin') {
      authStorage.clear();
      throw new Error('Admin access required');
    }
    setAuth(data.token, data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerAdmin(userData);
    setAuth(data.token, data.user);
    return data;
  };

  const updateUser = (userData) => {
    authStorage.setUser(userData);
    setUser(userData);
  };

  const refreshUser = useCallback(async () => {
    const { data } = await getMe();
    if (data.user.role !== 'admin') {
      await logout();
      return;
    }
    authStorage.setUser(data.user);
    setUser(data.user);
  }, [logout]);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(({ data }) => {
        if (data.user.role !== 'admin') {
          authStorage.clear();
          setUser(null);
          return;
        }
        authStorage.setUser(data.user);
        setUser(data.user);
      })
      .catch(() => {
        authStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAuthenticated = !!user && !!authStorage.getToken();
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
