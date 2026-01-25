import apiClient from "@/utils/apiClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Usuario = { id: string; nombre: string; email: string; rol: string; creado: string };

type AuthState = {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  hydrated: boolean;
  ROLES: Record<string, string>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUsuario: () => Promise<void>;
  setHydrated: (v: boolean) => void;
  setAuth: (usuario: Usuario, token: string) => void;
  isAuthenticated: () => boolean;
  loadFromLocalStorage: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      isLoading: false,
      hydrated: false,
      ROLES: {
        ADMIN: 'admin',
        CLIENTE: 'cliente',
        ENTRENADOR: 'entrenador',
        RECEPCIONISTA: 'recepcionista'
      },

      setHydrated: (v) => set({ hydrated: v }),

      isAuthenticated: () => !!get().token && !!get().usuario,

      setAuth: (usuario, token) => set({ usuario, token }),

      loadFromLocalStorage: () => {
        try {
          const storedData = localStorage.getItem("auth-storage");
          if (!storedData) return;

          const parsed = JSON.parse(storedData);
          if (parsed?.state) {
            set({
              usuario: parsed.state.usuario,
              token: parsed.state.token,
            });
          }
        } catch (error) {
          console.error("Error al cargar desde localStorage:", error);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.post("/auth/login", { email, password });
          set({ usuario: data.usuario, token: data.token });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ usuario: null, token: null });
        localStorage.removeItem("auth-storage"); // Limpieza manual opcional
      },

      loadUsuario: async () => {
        const currentToken = get().token;
        if (!currentToken) return;

        set({ isLoading: true });
        try {
          const { data } = await apiClient.get("/auth/me");
          set({ usuario: data.usuario });
        } catch (error) {
          set({ usuario: null, token: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);