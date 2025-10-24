import apiClient from "@/utils/apiClient"
import { CrearProducto } from "@/types";

// rutas publicas
export const listarProductos = () => apiClient.get('/productos');
export const obtenerProductoId = (id: string) => apiClient.get(`/productos/${id}`);

// rutas privadas
export const crearProducto = (payload: CrearProducto) => apiClient.post('/producto', payload);
