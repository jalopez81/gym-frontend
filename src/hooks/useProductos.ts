import { useEffect, useState } from 'react';
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

  async function fetchProductos() {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductos();
  }, [pagination.pagina, pagination.limite, pagination.busqueda]);

  return { productos, pagination, setPagination, loading, error, fetchProductos };
}
