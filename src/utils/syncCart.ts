import { useCartStore } from "@/store/cartStore";
import apiClient from "./apiClient";

export const syncCart = async () => {
  console.log('hit synchar####')
  const { add } = useCartStore.getState();


  const item = localStorage.getItem('cart-storage') || JSON.stringify({ state: { items: [] } });
  const local = JSON.parse(item).state.items

  const response = await apiClient.get('/carrito')
  const remote = response.data.items;

  const map = new Map();
  [...remote, ...local].forEach(item => {
    const existing = map.get(item.id);
    map.set(item.producto.id, existing ? {
      ...item.producto,
      cantidad: existing.cantidad + item.cantidad
    } : item);
  }
  );
  const synchedCart = Array.from(map.values());
  synchedCart.forEach(item => {
    add(item      
    )
  });

  await apiClient.post('/carrito/sync', synchedCart)
}
  ;
