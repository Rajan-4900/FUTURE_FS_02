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
      // On 401 clear session and send user to the dashboard (login removed)
      if (error.response?.status === 401) {
        authStorage.clear();
        window.location.href = '/';
      }

    return Promise.reject(error);
  }
);

export default api;
