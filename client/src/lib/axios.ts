import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: dispatch logout action or redirect
            // But usually, the context handles the state based on failed verification
            console.warn("Unauthorized access - user might be logged out");
        }
        return Promise.reject(error);
    }
);

export default api;
