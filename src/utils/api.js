import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// Event APIs
export const eventAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getFeaturedEvents: () => api.get('/events/featured'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => {
    return api.post('/events', eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateEvent: (id, eventData) => {
    return api.put(`/events/${id}`, eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
  searchEvents: (query) => api.get('/events/search', { params: { q: query } }),
};

// Registration APIs
export const registrationAPI = {
  registerForEvent: (registrationData) => api.post('/registrations', registrationData),
  getUserRegistrations: (status) => api.get('/registrations/my-registrations', { params: { status } }),
  checkRegistration: (eventId) => api.get(`/registrations/check/${eventId}`),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  updateRegistration: (id, data) => api.put(`/registrations/${id}`, data),
  cancelRegistration: (id) => api.delete(`/registrations/${id}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => {
    return api.put('/users/profile', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAccount: () => api.delete('/users/profile'),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (eventId) => api.post(`/users/favorites/${eventId}`),
  removeFavorite: (eventId) => api.delete(`/users/favorites/${eventId}`),
};

// Feedback APIs
export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getEventFeedback: (eventId, params) => api.get(`/feedback/event/${eventId}`, { params }),
  getUserFeedback: () => api.get('/feedback/my-feedback'),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
  approveFeedback: (id) => api.put(`/feedback/${id}/approve`),
};

export default api;