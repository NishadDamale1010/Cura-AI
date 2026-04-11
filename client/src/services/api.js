import axios from 'axios';

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS || 30000);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: DEFAULT_TIMEOUT,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '')) {
      error.userMessage = 'The server is taking longer than expected. Please retry in a few seconds.';
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
