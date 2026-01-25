import { useCallback, useEffect, useState } from 'react';
import { listarProductos } from '@/services/productos';
import { ProductPagination, Producto } from '@/types';

const defaultPagination: ProductPagination = {
  total: 0,
  pagina: 1,
  limite: 10,
  busqueda: '',
  totalPaginas: 0
};

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>(defaultPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchProductos = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await listarProductos({
      pagina: pagination.pagina,
      limite: pagination.limite,
      busqueda: pagination.busqueda,
    });
    
    setProductos(response.data.productos);
    
    setPagination(prev => ({
      ...prev,
      ...response.data.paginacion
    }));
  } catch (err: unknown) {
    const error = err as { message: string };
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, [pagination.pagina, pagination.limite, pagination.busqueda]); // Dependencias de la función

useEffect(() => {
  fetchProductos();
}, [fetchProductos]); 

  return { productos, pagination, setPagination, loading, error, fetchProductos };
}
