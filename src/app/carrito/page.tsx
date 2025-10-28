'use client';

import { useCartStore } from '@/store/cartStore';
import apiClient from '@/utils/apiClient';
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

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore(s => s.items);
  const {remove, clear, subtractQuantity, addQuantity, fetch} = useCartStore();



  const [total, setTotal] = useState(0);

  useEffect(() => {
    let t = 0;
    items.forEach(item => t += item.producto.precio * item.cantidad);
    setTotal(t);
  }, [items]);

  useEffect(()=>{
    const localStorageExists = Boolean(localStorage.getItem('cart-storage'));
    
    if(!localStorageExists){
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

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5">Tu carrito está vacío</Typography>
        <Link href="/productos" style={{ marginLeft: 10, color: '#1976d2' }}>Ir a productos</Link>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: '#f5f5f5' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Carrito</Typography>
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
                <Typography variant="h6" sx={{ flex: 1, marginX: 2 }}>{item.producto.nombre}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button size="small" onClick={() => subtractQuantity(item.producto.id)}>-</Button>
                  <Typography>{item.cantidad}</Typography>
                  <Button size="small" onClick={() => addQuantity(item.producto.id)}>+</Button>
                </Box>
                <Typography variant="body2" sx={{ width: 130, textAlign: 'right' }}>Precio: ${item.producto.precio}</Typography>
                <IconButton onClick={() => remove(item.producto.id)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" align="right" gutterBottom>Total: ${total.toFixed(2)}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="primary" onClick={clear}>Vaciar carrito</Button>
            <Button variant="contained" color="primary" onClick={handleCheckout}>Proceder al pago</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
