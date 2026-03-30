'use client';

import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EditProducto from './EditProducto';
import apiClient from '@/utils/apiClient';
import { CldImage } from 'next-cloudinary';
import { Producto } from '@/types';

export default function ProductoRow({ producto, refresh }: { producto: Producto, refresh: () => void }) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await apiClient.delete(`/productos/${producto.id}`);
      refresh();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{producto.nombre}</TableCell>
        <TableCell>
          <CldImage src={producto.imagenSecureUrl} width={50} height={50} crop="fill" alt="Producto" />
        </TableCell>
        <TableCell sx={{ textAlign: 'right' }}>${producto.precio}</TableCell>
        <TableCell>{producto.stock}</TableCell>
        <TableCell>{producto.categoria}</TableCell>
        <TableCell>
          <IconButton onClick={() => setOpenEdit(true)} color="primary" size="small"><EditIcon /></IconButton>
          <IconButton onClick={handleDelete} color="error" size="small"><DeleteIcon /></IconButton>
        </TableCell>
      </TableRow>
      {openEdit && <EditProducto producto={producto} onClose={() => { setOpenEdit(false); refresh(); }} />}
    </>
  );
}