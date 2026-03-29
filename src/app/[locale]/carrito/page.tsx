'use client';

import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle'
import { useCartStore } from '@/store/cartStore';
import { Producto, CarritoItem } from '@/types';
import apiClient from '@/utils/apiClient';
import { debounce } from '@/utils/debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

async function update(_id: string, producto: Producto, cantidad: number) { await apiClient.post(`/carrito`, { producto, cantidad }) }

const debouncedUpdate = debounce(update, 1500)

export default function CartPage() {
  const router = useRouter();
  const { remove, clearCart, setQty, fetch, items } = useCartStore();
  const { isAuthenticated } = useAuthStore()
  const [total, setTotal] = useState(0);
  const t = useTranslations('Cart');
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    let t = 0;
    items.forEach((item: CarritoItem) => t += item.producto.precio * item.cantidad);
    setTotal(t);
  }, [items]);

  useEffect(() => {
    fetch();
  }, [fetch])


  const handleCheckout = async () => {
    try {
      router.push('/pago');
    } catch (err) {
      console.error(err);
      alert(t('errorOrder'));
    }
  };

  const handleClearCart = async () => {
    clearCart();
    if (isAuthenticated()) { await apiClient.delete('/carrito') }
  }

  const handleSubtractQuantity = async (item: CarritoItem) => {
    const cantidad = item.cantidad - 1;

    if (cantidad === 0) return

    setQty(item.producto.id, cantidad)
    if (isAuthenticated()) { debouncedUpdate(item.producto.id, item.producto, cantidad) }
  }

  const handleAddQuantity = async (item: CarritoItem) => {
    const cantidad = item.cantidad + 1;
    setQty(item.producto.id, cantidad)
    debouncedUpdate(item.producto.id, item.producto, cantidad)
  }

  const handleRemove = async (item: CarritoItem) => {
    remove(item.producto.id)
    if (isAuthenticated()) { await apiClient.delete(`/carrito/${item.producto.id}`) }
  }

  if (items.length === 0) {
    return (
      <MyContainer isAuthGuard={true} sx={{ minHeight: '100vh', py: 4 }}>
        <Typography>{t('empty')}</Typography>
        <Link href="/productos" style={{ marginLeft: 10, color: '#1976d2' }}>{t('goProducts')}</Link>
      </MyContainer>
    );
  }

  return (
    <MyContainer isAuthGuard={true} sx={{ minHeight: '100vh', py: 4 }}>
      <MainTitle title={t('title')} subtitle={t('subtitle')} />

      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{ p: isMobile ? 0 : 4, maxWidth: 770 }}
      >
        <Stack spacing={2}>
          {items.map((item: CarritoItem) => (
            <Paper
              key={item.producto.id}
              sx={{ display: 'flex', alignItems: 'stretch' }}
            >
              {/* Product Image */}
              <CldImage
                src={item.producto.imagenSecureUrl}
                width={90}
                height={90}
                crop="fill"
                gravity="auto"
                quality="auto"
                alt="Producto"
                loading="lazy"
              />

              {/* Product Info & Controls */}
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ flex: 1, textAlign: 'center' }}>
                  {item.producto.nombre}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, width: 200 }}>
                  <Button size="small" sx={{ width: 20, fontSize: '1.3rem' }} onClick={() => handleSubtractQuantity(item)}>-</Button>
                  <Typography>{item.cantidad}</Typography>
                  <Button size="small" sx={{ width: 20, fontSize: '1.3rem' }} onClick={() => handleAddQuantity(item)}>+</Button>
                </Box>

                <Typography sx={{ width: 130, textAlign: 'center', fontWeight: 700 }}>
                  {item.producto.precio}
                </Typography>
              </Box>

              {/* Delete Action */}
              <Box
                sx={{
                  backgroundColor: 'red',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconButton onClick={() => handleRemove(item)} sx={{ color: 'white' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Summary & Footer Actions */}
        <Typography
          align="right"
          gutterBottom
          mr={7}
          fontWeight="bold"
        >
          {t('total')}: ${total.toFixed(2)}
        </Typography>

        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          <Button variant="outlined" color="primary" onClick={handleClearCart}>
            {t('clearCart')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            {t('checkout')}
          </Button>
        </Stack>
      </Paper>
    </MyContainer>
  );
}
