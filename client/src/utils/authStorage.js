const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

function migrateLegacyStorage() {
  const legacyToken = localStorage.getItem('token');
  const legacyUser = localStorage.getItem('user');
  if (legacyToken && !localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, legacyToken);
    localStorage.removeItem('token');
  }
  if (legacyUser && !localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, legacyUser);
    localStorage.removeItem('user');
  }
}

migrateLegacyStorage();

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  isAdmin() {
    return this.getUser()?.role === 'admin';
  },
};
