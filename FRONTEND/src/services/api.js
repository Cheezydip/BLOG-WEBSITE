import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Auth service
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  me: (token) =>
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

// Blog service
export const blogService = {
  getPosts: () => api.get('/posts'),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),

  createPost: (data, token) => {
    return api.post('/posts', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Let axios set Content-Type for FormData automatically
      }
    })
  },

  updatePost: (slug, data, token) => {
    return api.put(`/posts/${slug}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  deletePost: (slug, token) => {
    return api.delete(`/posts/${slug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  updateStatus: (slug, status, token) => {
    return api.patch(`/posts/${slug}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  generateAIStream: (payload) => {
    return fetch(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
};

export default api;
