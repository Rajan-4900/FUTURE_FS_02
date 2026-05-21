import api from './axios';

export const registerAdmin = (data) => api.post('/auth/admin/register', data);
export const loginAdmin = (data) => api.post('/auth/admin/login', data);
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const updateProfile = (data) => api.put('/auth/profile', data);
