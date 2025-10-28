'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import apiClient from '@/utils/apiClient';

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mis Órdenes
      </Typography>

      {ordenes.length === 0 && <Typography>No tienes órdenes aún.</Typography>}

      {ordenes.map((orden) => (
        <Paper key={orden.id} sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6">Orden: {orden.id}</Typography>
          <Typography sx={{ color: getStatusColor(orden.estado as Estado) }}>Estado: {orden.estado}</Typography>
          <Typography>Total: ${orden.total.toFixed(2)}</Typography>
          <Typography>Fecha: {new Date(orden.creado).toLocaleString()}</Typography>

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
        </Paper>
      ))}
    </Container>
  );
}
