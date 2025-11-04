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

      login: async (email, password) => {
        const { data } = await apiClient.post("/auth/login", { email, password });
        set({ usuario: data.usuario, token: data.token });
      },

      logout: () => {
        set({ usuario: null, token: null });
      },

      loadUsuario: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const { data } = await apiClient.get("/auth/me");
          set({ usuario: data.usuario, token });
        } catch {
          set({ usuario: null, token: null });
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
