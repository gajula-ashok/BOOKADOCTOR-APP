import axios from 'axios';
// Configure Axios Defaults
axios.defaults.baseURL = ''; // proxy handles locally, empty string is correct
// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medicare-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor for global error catching (e.g. 401 redirects)
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage if token expired/unauthorized
      localStorage.removeItem('medicare-token');
      localStorage.removeItem('medicare-user');
      // optional reload to redirect to login
    }
    return Promise.reject(error);
  }
);
export default axios;
