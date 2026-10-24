import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if stored in localStorage (as a fallback to cookies)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clean stored token
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const enquiryApi = {
  // Public
  submitEnquiry: (data) => api.post('/enquiries', data),

  // Admin Protected
  getEnquiries: (params) => api.get('/enquiries', { params }),
  getEnquiryById: (id) => api.get(`/enquiries/${id}`),
  updateEnquiry: (id, data) => api.put(`/enquiries/${id}`, data),
  updateStatus: (id, status) => api.patch(`/enquiries/${id}/status`, { status }),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),
  getStats: () => api.get('/enquiries/stats'),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export default api;
