import axios from 'axios';


const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        
        const isLoginRequest = error.config?.url?.includes('/login');
        
        if (!isLoginRequest) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    } else if (error.message === 'Network Error') {
      console.error('Cannot reach backend. Is Spring Boot running on port 8080?');
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };