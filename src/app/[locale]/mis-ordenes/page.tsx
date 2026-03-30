'use client';

import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle';
import apiClient from '@/utils/apiClient';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

interface OrdenItem {
  producto: {
    nombre: string;
    precio: number;
  };
  cantidad: number;
  subtotal: number;
}

interface Orden {
  id: string;
  total: number;
  estado: string;
  creado: string;
  items: OrdenItem[];
}

type Estado = 'pendiente' | 'completada' | 'cancelada';

const getStatusColor = (status: Estado) => {
  const COLORS = {
    pendiente: 'orange',
    completada: 'green',
    cancelada: 'red',
  };
  return COLORS[status];
}

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('MyOrders');
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await apiClient.get('/ordenes/mis-ordenes')
        const data = res.data;
        setOrdenes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('copySuccess'));
  };

  if (loading) return <Typography>{t('loading')}</Typography>;

  return (
    <MyContainer className="mis-ordenes" isAuthGuard={true} sx={{ py: 4 }}>
      <MainTitle title={t('title')} subtitle={t('subtitle')} />

      {ordenes.length === 0 && <Typography>{t('noOrders')}</Typography>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {ordenes.map((orden) => (
          <Paper className="orden" key={orden.id} sx={{ mb: 3, p: 2, maxWidth: isMobile ? '100%' : 650, width: '100%' }}>
            <Box className="orden-header" sx={{ ml: 2, mr: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography>{t('status')}: </Typography>
                <Typography sx={{ color: getStatusColor(orden.estado.toLowerCase() as Estado) }}>{orden.estado}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{t('date')}: {new Date(orden.creado).toLocaleString()}</Typography>
                <Typography variant="body2"
                sx={{ ...(isMobile && { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }) }}
                title={t('order') + ': ' + orden.id}
                onClick={() => copyToClipboard(orden.id)}
                >{t('order')}: <i>{orden.id}</i></Typography>
              </Box>
            </Box>

            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('product')}</TableCell>
                  <TableCell align="right">{t('quantity')}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell align="right">{t('price')}</TableCell>
                      <TableCell align="right">{t('subtotal')}</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {orden.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.producto.nombre}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell align="right">${item.producto.precio.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                      </>
                    )
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography sx={{ textAlign: 'right', fontWeight: 'bold', margin: '1rem 1rem 0 0' }}>{t('total')}: ${orden.total.toFixed(2)}</Typography>
          </Paper>
        ))}
      </Box>
    </MyContainer>
  );
}
