'use client';

import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EditProducto from './EditProducto';
import apiClient from '@/utils/apiClient';
import { CldImage } from 'next-cloudinary';

export default function ProductoRow({ producto, refresh }: any) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      await apiClient.delete(`/productos/${producto.id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{producto.nombre}</TableCell>
        <TableCell><CldImage
          src={producto.imagenSecureUrl}
          width={100}
          height={100}
          crop="fill"
          gravity="auto"
          quality="auto"
          alt="Producto"
          loading="lazy"
        /></TableCell>
        <TableCell sx={{ textAlign: 'right' }}>{producto.precio}</TableCell>
        <TableCell>{producto.stock}</TableCell>
        <TableCell>{producto.categoria}</TableCell>
        <TableCell>
          <IconButton onClick={() => setOpenEdit(true)}><EditIcon /></IconButton>
          <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
        </TableCell>
      </TableRow>
      {openEdit && <EditProducto producto={producto} onClose={() => { setOpenEdit(false); refresh(); }} />}
    </>
  );
}
