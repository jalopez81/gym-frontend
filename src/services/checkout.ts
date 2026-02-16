import { CarritoItem } from '@/types';
import apiClient from '@/utils/apiClient';

export async function crearOrden(carrito: CarritoItem[]) { 
  const res = await apiClient.post('/ordenes', carrito)
  return res
}
