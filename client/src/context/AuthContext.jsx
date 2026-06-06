import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

const MOCK_USER = {
  id: '6a230d9ab36709c535e2dcb6',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  company: 'Future CRM',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  const login = useCallback(async () => {
    return { token: 'mock_token', user: MOCK_USER };
  }, []);

  const register = useCallback(async () => {
    return { token: 'mock_token', user: MOCK_USER };
  }, []);

  const logout = useCallback(async () => {
    // No-op
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  }, []);

  const refreshUser = useCallback(async () => {
    // No-op
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: true,
        isAdmin: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
