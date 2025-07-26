import api from './api';

// Get all tech posts (with optional search/filter)
export const getTechPosts = (params) => api.get('/techfeed', { params });

// Get a single tech post by ID
export const getTechPost = (id) => api.get(`/techfeed/${id}`);

// Admin: Create a new tech post
export const createTechPost = (data) => api.post('/techfeed', data);

// Admin: Update a tech post
export const updateTechPost = (id, data) => api.put(`/techfeed/${id}`, data);

// Admin: Delete a tech post
export const deleteTechPost = (id) => api.delete(`/techfeed/${id}`);

// Student: Save/bookmark a post
export const saveTechPost = (id) => api.post(`/techfeed/${id}/save`);

// Student: Unsave/unbookmark a post
export const unsaveTechPost = (id) => api.delete(`/techfeed/${id}/save`);

// Student: Get all saved posts
export const getSavedTechPosts = () => api.get('/techfeed/saved/all');

