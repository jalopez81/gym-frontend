import apiClient from "@/utils/apiClient"
import { CrearProducto } from "@/types";

type ListarProductosArgs = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
}

// rutas publicas
export const listarProductos = ({ pagina = 1, limite = 10, busqueda = "" }: ListarProductosArgs) => {
    return apiClient.get(`/productos?pagina=${pagina}&limite=${limite}&busqueda=${busqueda}`);
};

export const obtenerProductoId = (id: string) => apiClient.get(`/productos/${id}`);

// rutas privadas
export const crearProducto = (payload: CrearProducto) => apiClient.post('/producto', payload);
