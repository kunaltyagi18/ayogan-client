import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.dispatchEvent(new Event('auth:expired'));
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${encodeURIComponent(token)}`, { password }),
};

export const eventAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getManagedEvents: (params) => api.get('/events/manage', { params }),
  getFeaturedEvents: () => api.get('/events/featured'),
  getEventById: (id) => api.get(`/events/${encodeURIComponent(id)}`),
  createEvent: (eventData) => api.post('/events', eventData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateEvent: (id, eventData) => api.put(`/events/${encodeURIComponent(id)}`, eventData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteEvent: (id) => api.delete(`/events/${encodeURIComponent(id)}`),
  searchEvents: (query) => api.get('/events/search', { params: { q: query } }),
};

export const contactAPI = {
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${encodeURIComponent(id)}`),
  updateStatus: (id, data) => api.put(`/contact/${encodeURIComponent(id)}`, data),
  remove: (id) => api.delete(`/contact/${encodeURIComponent(id)}`),
};

export const registrationAPI = {
  registerForEvent: (registrationData) => api.post('/registrations', registrationData),
  getUserRegistrations: (status) => api.get('/registrations/my-registrations', { params: { status } }),
  checkRegistration: (eventId) => api.get(`/registrations/check/${encodeURIComponent(eventId)}`),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${encodeURIComponent(eventId)}`),
  updateRegistration: (id, data) => api.put(`/registrations/${encodeURIComponent(id)}`, data),
  cancelRegistration: (id) => api.delete(`/registrations/${encodeURIComponent(id)}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAccount: () => api.delete('/users/profile'),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (eventId) => api.post(`/users/favorites/${encodeURIComponent(eventId)}`),
  removeFavorite: (eventId) => api.delete(`/users/favorites/${encodeURIComponent(eventId)}`),
};

export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getEventFeedback: (eventId, params) => api.get(`/feedback/event/${encodeURIComponent(eventId)}`, { params }),
  getUserFeedback: () => api.get('/feedback/my-feedback'),
  updateFeedback: (id, data) => api.put(`/feedback/${encodeURIComponent(id)}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${encodeURIComponent(id)}`),
  approveFeedback: (id) => api.put(`/feedback/${encodeURIComponent(id)}/approve`),
};

export default api;
