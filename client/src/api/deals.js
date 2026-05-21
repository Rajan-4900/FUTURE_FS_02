import api from './axios';

export const getDeals = () => api.get('/deals');
export const getDealStats = () => api.get('/deals/stats');
export const createDeal = (data) => api.post('/deals', data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`);
