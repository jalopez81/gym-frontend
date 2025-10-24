import apiClient from "@/utils/apiClient";
import { CarritoItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: CarritoItem[];
  add: (item: CarritoItem) => void;
  addQuantity: (id: string) => void;
  subtractQuantity: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  syncWithBackend: (token: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item: CarritoItem) =>
        set((state) => ({
          items: state.items.some(el => el.producto.id === item.producto.id)
            ? state.items
            : [...state.items, item],
        })),

      addQuantity: (id: string) =>
        set(state => ({
          items: state.items.map(el =>
            el.producto.id === id ? { ...el, cantidad: el.cantidad + 1 } : el
          )
        })),

      subtractQuantity: (id: string) =>
        set(state => ({
          items: state.items.map(el =>
            el.producto.id === id
              ? { ...el, cantidad: Math.max(1, el.cantidad - 1) }
              : el
          )
        })),

      remove: (id: string) => set({ items: get().items.filter(el => el.producto.id !== id) }),

      clear: () => set({ items: [] }),

      syncWithBackend: async (token: string) => {
        if (!token) return;

        await apiClient.post('/carrito/sync', { items: get().items })
      }
    }), {
    name: "cart-storage",
  }),
)

