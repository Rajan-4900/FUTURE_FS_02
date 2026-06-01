import axios from 'axios';
import { authStorage } from '../utils/authStorage';
import { getApiBaseUrl } from '../utils/apiBaseUrl';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = ['/login', '/register'].some((p) =>
      window.location.pathname.startsWith(p)
    );

    if (error.response?.status === 401 && !isAuthPage) {
      authStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
