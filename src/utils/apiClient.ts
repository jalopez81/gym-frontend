import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("auth-store");
      if (storage) {
        const authStorage = JSON.parse(storage) as { state: { token?: string } };
        const token = authStorage.state.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth-store");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default apiClient;
