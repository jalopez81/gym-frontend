'use client';

import MyContainer from '@/components/Container';
import { useCartStore } from '@/store/cartStore';
import { Producto } from '@/types';
import apiClient from '@/utils/apiClient';
import { debounce } from '@/utils/debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function update(producto: Producto, cantidad: number) { await apiClient.post(`/carrito`, { producto, cantidad }) }

const debouncedUpdate = debounce(update, 1500)

export default function CartPage() {
  const router = useRouter();
  const { remove, clearCart, setQty, fetch, items } = useCartStore();
  const [disableSubs, setDisableSubs] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let t = 0;
    items.forEach(item => t += item.producto.precio * item.cantidad);
    setTotal(t);
  }, [items]);

  useEffect(() => {
    const localStorageExists = items.length > 0

    if (!localStorageExists) {
      fetch();
    }

  }, [])


  const handleCheckout = async () => {
    try {
      router.push('/pago');
    } catch (err) {
      console.error(err);
      alert('Error al procesar el pedido');
    }
  };

  const handleClearCart = async () => {
    clearCart();
    await apiClient.delete('/carrito')
  }

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Tu carrito está vacío</Typography>
        <Link href="/productos" style={{ marginLeft: 10, color: '#1976d2' }}>Ir a productos</Link>
      </Box>
    );
  }

  const handleSubtractQuantity = async (item: any) => {
    const cantidad = item.cantidad - 1;

    if (cantidad === 0) return

    setQty(item.producto.id, cantidad)
    debouncedUpdate(item.producto, cantidad)

    // disable button if qty=0
    setDisableAdd(cantidad === 0);
  }
  const handleAddQuantity = async (item: any) => {
    const cantidad = item.cantidad + 1;
    setQty(item.producto.id, cantidad)
    debouncedUpdate(item.producto, cantidad)

    // disable button if qty=0
    setDisableAdd(cantidad === 0);
  }
  const handleRemove = async (item: any) => {
    remove(item.producto.id)
    await apiClient.delete(`/carrito/${item.producto.id}`)
  }

  return (
    <MyContainer sx={{ minHeight: '100vh', py: 4, background: '#f5f5f5' }}>
      <Typography variant="h4">Carrito</Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 770 }}>
        <Stack spacing={2}>
          {items.map(item => (
            <Paper key={item.producto.id} sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <CldImage
                src={item.producto.imagenSecureUrl}
                width={50}
                height={50}
                crop="fill"
                gravity="auto"
                quality="auto"
                alt="Producto"
                loading="lazy"
              />
              <Typography sx={{ flex: 1, marginX: 2 }}>{item.producto.nombre}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button size="small" onClick={() => handleSubtractQuantity(item)}>-</Button>
                <Typography>{item.cantidad}</Typography>
                <Button size="small" onClick={() => handleAddQuantity(item)}>+</Button>
              </Box>
              <Typography sx={{ width: 130, textAlign: 'right', }}>{item.producto.precio}</Typography>
              <IconButton onClick={() => handleRemove(item)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography align="right" gutterBottom mr={7} fontWeight={"bold"}>Total: ${total.toFixed(2)}</Typography>
        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          <Button variant="outlined" color="primary" onClick={handleClearCart}>Vaciar carrito</Button>
          <Button variant="contained" color="primary" onClick={handleCheckout}>Proceder al pago</Button>
        </Stack>
      </Paper>
    </MyContainer>
  );
}
