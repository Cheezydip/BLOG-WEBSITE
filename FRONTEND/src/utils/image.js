export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = API_URL.replace('/api', '');
    return `${serverUrl}${url}`;
  }
  return url;
};
