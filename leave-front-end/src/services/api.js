import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8000'
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('i am in interceptor', config);
    return config;
});
export default api;