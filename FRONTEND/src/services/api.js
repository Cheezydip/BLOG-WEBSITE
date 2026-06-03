import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const blogService = {
  getPosts: () => api.get('/posts'),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  createPost: (data, config = {}) => {
    // If data is FormData, let axios set headers
    return api.post('/posts', data, config)
  },
};

export default api;
