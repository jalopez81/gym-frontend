import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore"
import { AuthResponse } from "@/types";
import { useEffect } from "react"

export const useAuth = () => {

    const { loadFromLocalStorage, setAuth, usuario, token, logout, isAuthenticated } = useAuthStore();

    useEffect(() => {
        loadFromLocalStorage();
    }, [loadFromLocalStorage])

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
            const { usuario, token } = response.data.datos;
            setAuth(usuario, token)
            return response;
        } catch (error) {
            throw error;

        }
    }

    const registro = async (nombre: string, email: string, password: string) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/registro', { nombre, email, password })
            const { usuario, token } = response.data.datos;
            setAuth(usuario, token)
            return response;
        } catch (error) {
            throw error;

        }
    }



    return {
        usuario,
        token,
        isAuthenticated,
        login,
        registro,
        logout,
        loadFromLocalStorage
    }
}