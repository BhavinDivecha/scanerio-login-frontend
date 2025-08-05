import axios from 'axios';
// import { header } from 'framer-motion/client';

// Create Axios instance
const api = axios.create({
  baseURL: '/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedRequests:any[] = [];
let _window=typeof window !== 'undefined' ? window : null
// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = _window?.sessionStorage.getItem('refresh');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the new token
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const refreshToken = _window?.sessionStorage.getItem('refresh');
        const accessToken = _window?.sessionStorage.getItem('access');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/v1/user/auth/refresh',{token: refreshToken}, {
            headers:{
                'Authorization':`Bearer ${accessToken}`
            }
        //   refreshToken
        });

        // Update tokens
        const { accessToken: newaccessToken } = response.data;
        // _window?.sessionStorage.setItem('access', accessToken);
        if (newaccessToken) {
          _window?.sessionStorage.setItem('access', newaccessToken);
        }

        // Retry all failed requests
        failedRequests.forEach(prom => prom.resolve());
        failedRequests = [];

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        _window?.sessionStorage.removeItem('access');
        _window?.sessionStorage.removeItem('refresh');
        failedRequests.forEach(prom => prom.reject(refreshError));
        failedRequests = [];
        
        // Redirect to login page
        window.location.href = 'https://login.scanerio.codexlab.in';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;