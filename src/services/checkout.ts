import { CarritoItem } from '@/types';
import apiClient from '@/utils/apiClient';

interface CrearOrdenDTO {
  items: {
    productoId: string;
    cantidad: number;
  }[];
}

export async function crearOrden(carrito: CarritoItem[]) {
  const data: CrearOrdenDTO = {
    items: carrito.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    })),
  };

  const res = await apiClient.post('/ordenes', carrito)


  return res
}
