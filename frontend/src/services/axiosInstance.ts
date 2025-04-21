import axios from 'axios';
import { store } from '../redux/store';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get the latest token from Redux
    const state = store.getState(); // Access Redux store
    const token = state.user.token || localStorage.getItem('token'); // Fallback to localStorage

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
