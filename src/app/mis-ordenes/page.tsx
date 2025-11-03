'use client';

import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle';
import apiClient from '@/utils/apiClient';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await apiClient.get('/ordenes')
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

  if (loading) return <Typography>Cargando órdenes...</Typography>;

  return (
    <MyContainer className="mis-ordenes" isAuthGuard={true} sx={{ py: 4 }}>
      <MainTitle title="Mis órdenes" subtitle="Historial y estado de tus compras"/>

      {ordenes.length === 0 && <Typography>No tienes órdenes aún.</Typography>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {ordenes.map((orden) => (
          <Paper className="orden" key={orden.id} sx={{ mb: 3, p: 2, maxWidth: 650, width: "100%" }}>
            <Box className="orden-header" sx={{ ml: 2, mr: 2 }}>
              <Typography sx={{ color: getStatusColor(orden.estado as Estado) }}>Estado: {orden.estado}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Fecha: {new Date(orden.creado).toLocaleString()}</Typography>
                <Typography variant="body2">Orden: <i>{orden.id}</i></Typography>
              </Box>
            </Box>

            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orden.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.producto.nombre}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    <TableCell align="right">${item.producto.precio.toFixed(2)}</TableCell>
                    <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography sx={{ textAlign: 'right', fontWeight: 'bold', margin: '1rem 1rem 0 0' }}>Total: ${orden.total.toFixed(2)}</Typography>
          </Paper>
        ))}
      </Box>
    </MyContainer>
  );
}
