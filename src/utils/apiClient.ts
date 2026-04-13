import axios from "axios";
import { useApiLoadingStore } from "@/store/apiLoadingStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      useApiLoadingStore.getState().beginRequest();
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
  (error) => {
    if (typeof window !== "undefined") {
      useApiLoadingStore.getState().endRequest();
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
    (response) => {
      if (typeof window !== "undefined") {
        useApiLoadingStore.getState().endRequest();
      }
      return response;
    },
    (error) => {
        if (typeof window !== "undefined") {
          useApiLoadingStore.getState().endRequest();
        }
        if (error.response?.status === 401) {
            localStorage.removeItem("auth-store");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default apiClient;
