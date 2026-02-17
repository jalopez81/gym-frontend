import apiClient from "@/utils/apiClient";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
  devtools(
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

        // IMPORTANTE: Añade false (para no reemplazar todo el estado) 
        // y el nombre de la acción como 3er argumento.
        setHydrated: (v) => set({ hydrated: v }, false, 'auth/setHydrated'),

        isAuthenticated: () => !!get().token && !!get().usuario,

        setAuth: (usuario, token) => set({ usuario, token }, false, 'auth/setAuth'),

        loadFromLocalStorage: () => {
          try {
            const storedData = localStorage.getItem("auth-storage");
            if (!storedData) return;
            const parsed = JSON.parse(storedData);
            if (parsed?.state) {
              set({
                usuario: parsed.state.usuario,
                token: parsed.state.token,
              }, false, 'auth/loadLocal');
            }
          } catch (error) {
            console.error("Error:", error);
          }
        },

        login: async (email, password) => {
          set({ isLoading: true }, false, 'auth/login_loading');
          try {
            const { data } = await apiClient.post("/auth/login", { email, password });
            set({ usuario: data.usuario, token: data.token }, false, 'auth/login_success');
          } finally {
            set({ isLoading: false }, false, 'auth/login_finished');
          }
        },

        logout: () => {
          set({ usuario: null, token: null }, false, 'auth/logout');
          localStorage.removeItem("auth-storage");
        },

        loadUsuario: async () => {
          const currentToken = get().token;
          if (!currentToken) return;

          set({ isLoading: true }, false, 'auth/loadUser_loading');
          try {
            const { data } = await apiClient.get("/auth/me");
            set({ usuario: data.usuario }, false, 'auth/loadUser_success');
          } catch {
            set({ usuario: null, token: null }, false, 'auth/loadUser_error');
          } finally {
            set({ isLoading: false }, false, 'auth/loadUser_finished');
          }
        },
      }),
      {
        name: "auth-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    ),
    { name: "AuthStore" } // Esto ayuda a separarlo en el menú de Redux DevTools
  )
);