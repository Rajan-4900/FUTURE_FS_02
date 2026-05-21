import api from './axios';

export const getFollowUps = (params) => api.get('/follow-ups', { params });
export const getFollowUpStats = () => api.get('/follow-ups/stats');
export const getTimeline = (params) => api.get('/follow-ups/timeline', { params });
export const getFollowUp = (id) => api.get(`/follow-ups/${id}`);
export const createFollowUp = (data) => api.post('/follow-ups', data);
export const updateFollowUp = (id, data) => api.put(`/follow-ups/${id}`, data);
export const completeFollowUp = (id) => api.patch(`/follow-ups/${id}/complete`);
export const deleteFollowUp = (id) => api.delete(`/follow-ups/${id}`);
