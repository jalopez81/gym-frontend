import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("auth-storage");
      if (storage) {
        const authStorage = JSON.parse(storage);
        const token = authStorage.state.token;
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
