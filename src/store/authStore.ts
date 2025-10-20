import { Usuario } from "@/types";
import { create } from "zustand";

interface AuthStore {
    usuario: Usuario | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setAuth: (usuario: Usuario, token: string) => void;
    logout: () => void;
    loadFromLocalStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    usuario: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    setAuth: (usuario: Usuario, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        console.log({
            token, usuario
        })

        set({
            usuario, 
            token,
            isAuthenticated: true
        })
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        set({
            usuario: null,
            token: null,
            isAuthenticated: false
        })
    },
    
    loadFromLocalStorage: () => {
        const token = localStorage.getItem('token');
        const usuarioJson = localStorage.getItem('usuario');

        if(token && usuarioJson){
            set({
                token,
                usuario: JSON.parse(usuarioJson),
                isAuthenticated: true
            })
        }
    },
}))