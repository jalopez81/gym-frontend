import apiClient from "@/utils/apiClient";
import { CarritoItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from 'zustand/middleware';

type CartState = {
  items: CarritoItem[];
  add: (item: CarritoItem) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  fetch: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        add: (item: CarritoItem) => {
          set(
            (state) => ({
              items: state.items.some(el => el.producto.id === item.producto.id)
                ? state.items
                : [...state.items, item],
            }),
            false,
            'cart/add'
          );
        },

        setQty: (id: string, qty: number) => {
          set(
            (state) => ({
              items: state.items.map(el =>
                el.producto.id === id ? { ...el, cantidad: qty } : el
              )
            }),
            false,
            'cart/setQty'
          );
        },

        remove: (id: string) => {
          set(
            { items: get().items.filter(el => el.producto.id !== id) },
            false,
            'cart/remove'
          );
        },

        clearCart: () => {
          set({ items: [] }, false, 'cart/clear');
        },

        fetch: async () => {
          const response = await apiClient.get('/carrito');
          const data = response.data.items;
          data.forEach((item: any) => {
            get().add(item);
          });
        }
      }),
      {
        name: "cart-storage",
      }
    )
  )
);
