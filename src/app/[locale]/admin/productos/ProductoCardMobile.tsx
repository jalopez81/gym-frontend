'use client';

import { Paper, Box, Typography, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EditProducto from './EditProducto';
import apiClient from '@/utils/apiClient';
import { CldImage } from 'next-cloudinary';
import { Producto } from '@/types';

export default function ProductoCardMobile({ producto, refresh }: { producto: Producto, refresh: () => void }) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar producto?')) return;
    await apiClient.delete(`/productos/${producto.id}`);
    refresh();
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #eee' }} elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center">
        <CldImage src={producto.imagenSecureUrl} width={80} height={80} crop="fill" alt={producto.nombre} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">{producto.nombre}</Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">${producto.precio}</Typography>
          <Typography variant="caption" display="block">Stock: {producto.stock}</Typography>
          <Typography variant="caption" color="text.secondary">{producto.categoria}</Typography>
        </Box>
        <Stack>
          <IconButton onClick={() => setOpenEdit(true)} color="primary"><EditIcon /></IconButton>
          <IconButton onClick={handleDelete} color="error"><DeleteIcon /></IconButton>
        </Stack>
      </Stack>
      {openEdit && <EditProducto producto={producto} onClose={() => { setOpenEdit(false); refresh(); }} />}
    </Paper>
  );
}