import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Agregar token en cada petición

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;