'use client';

import { useState } from 'react';
import { Modal, Box, TextField, Button, Stack, Paper } from '@mui/material';
import apiClient from '@/utils/apiClient';
import { CldImage } from 'next-cloudinary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function EditProducto({ producto, onClose }: any) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [precio, setPrecio] = useState(producto.precio);
  const [stock, setStock] = useState(producto.stock);
  const [categoria, setCategoria] = useState(producto.categoria);
  const [imagen, setImagen] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio.toString());
    formData.append('stock', stock.toString());
    formData.append('categoria', categoria);
    if (imagen) formData.append('imagen', imagen);

    try {
      await apiClient.put(`/productos/actualizar/${producto.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ width: 400, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: '10%' }}>
        <Stack spacing={2}>
          <Paper sx={{ width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: 1 }}>
            <CldImage
              src={producto.imagenSecureUrl}
              width={100}
              height={100}
              crop="fill"
              gravity="auto"
              quality="auto"
              alt="Producto"
              loading="lazy"
            />
            {imagen && <>
              <ArrowForwardIcon />
              <img src={imagen ? URL.createObjectURL(imagen) : undefined} alt="new image" width={100} height={100} />
            </>}

          </Paper>
          <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <TextField label="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <TextField label="Precio" type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} />
          <TextField label="Stock" type="number" value={stock} onChange={e => setStock(Number(e.target.value))} />
          <TextField label="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
          <Button variant="outlined" component="label">
            Subir Imagen
            <input
              type="file"
              hidden
              onChange={e => setImagen(e.target.files?.[0] || null)}
            />
          </Button>

          <Button variant="contained" onClick={handleSubmit}>Actualizar</Button>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        </Stack>
      </Box>
    </Modal>
  );
}
