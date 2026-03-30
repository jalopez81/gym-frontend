'use client';

import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle'
import { useCartStore } from '@/store/cartStore';
import { Producto, CarritoItem } from '@/types';
import apiClient from '@/utils/apiClient';
import { debounce } from '@/utils/debounce';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Grid,
  useTheme
} from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

const update = async (_id: string, producto: Producto, cantidad: number) => { 
  await apiClient.post(`/carrito`, { producto, cantidad }) 
}
const debouncedUpdate = debounce(update, 1500)

export default function CartPage() {
  const router = useRouter();
  const theme = useTheme();
  const { remove, clearCart, setQty, fetch, items } = useCartStore();
  const { isAuthenticated } = useAuthStore()
  const [total, setTotal] = useState(0);
  const t = useTranslations('Cart');
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    const totalCalc = items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
    setTotal(totalCalc);
  }, [items]);

  useEffect(() => { fetch(); }, [fetch]);

  if (items.length === 0) {
    return (
      <MyContainer isAuthGuard={true} sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>{t('empty')}</Typography>
        <Button component={Link} href="/productos" variant="contained" sx={{ mt: 2 }}>
          {t('goProducts')}
        </Button>
      </MyContainer>
    );
  }

  return (
    <MyContainer isAuthGuard={true} sx={{ py: 4 }}>
      <MainTitle title={t('title')} subtitle={t('subtitle')} />

      <Grid container spacing={4}>
        {/* LIST OF ITEMS */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {items.map((item: CarritoItem) => (
              <Paper 
                key={item.producto.id} 
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid #eee',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <CldImage
                    src={item.producto.imagenSecureUrl}
                    width={isMobile ? 80 : 100}
                    height={isMobile ? 80 : 100}
                    crop="fill"
                    alt={item.producto.nombre}
                  />
                </Box>

                <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 4 }}>
                    <Typography fontWeight="bold" variant="subtitle1">{item.producto.nombre}</Typography>
                    <Typography fontWeight="bold" color="primary.main">${(item.producto.precio * item.cantidad).toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" sx={{ bgcolor: '#f5f5f5', borderRadius: 2, px: 1 }}>
                      <IconButton size="small" onClick={() => item.cantidad > 1 && setQty(item.producto.id, item.cantidad - 1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{item.cantidad}</Typography>
                      <IconButton size="small" onClick={() => {
                        setQty(item.producto.id, item.cantidad + 1);
                        debouncedUpdate(item.producto.id, item.producto, item.cantidad + 1);
                      }}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <IconButton 
                      onClick={() => remove(item.producto.id)} 
                      sx={{ color: theme.palette.error.light }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
          
          <Button 
            variant="text" 
            color="inherit" 
            onClick={clearCart} 
            sx={{ mt: 2, textTransform: 'none', color: 'text.secondary' }}
          >
            {t('clearCart')}
          </Button>
        </Grid>

        {/* SUMMARY SIDEBAR */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fafafa', position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{t('summary')}</Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">{t('subtotal')}</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">{t('shipping')}</Typography>
                <Typography color="success.main">{t('free')}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight="900">{t('total')}</Typography>
              <Typography variant="h5" fontWeight="900" color="primary">${total.toFixed(2)}</Typography>
            </Box>
            
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={() => router.push('/pago')}
              sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
            >
              {t('checkout')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MyContainer>
  );
}