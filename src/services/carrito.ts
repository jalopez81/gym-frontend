import apiClient from "@/utils/apiClient"
import { CrearProducto, Producto } from "@/types";

// protegidas (usuario autenticado)
export const agregarAlCarrito = (id: string, cantidad: number) => apiClient.post('/carrito', {productoId: id, cantidad});
export const quitarDelCarrito = (id: string) => apiClient.delete(`/carrito/${id}`);
