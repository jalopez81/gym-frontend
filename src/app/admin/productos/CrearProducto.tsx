'use client';

import apiClient from '@/utils/apiClient';
import { Box, Button, Modal, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function CrearProducto({ onClose }: any) {
  const [nombre, setNombre] = useState('Producto1');
  const [descripcion, setDescripcion] = useState('Este producto es de color');
  const [precio, setPrecio] = useState(600);
  const [stock, setStock] = useState(5);
  const [categoria, setCategoria] = useState('Equipos');
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
      await apiClient.post('/productos/crear', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
            <img src={imagen ? URL.createObjectURL(imagen) : '/image-placeholder.png'} alt="new image" width={100} height={100} />
          </Paper>
          <Button variant="outlined" component="label">
            Subir Imagen
            <input
              type="file"
              hidden
              onChange={e => setImagen(e.target.files?.[0] || null)}
            />
          </Button>
          <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <TextField label="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <TextField label="Precio" type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} />
          <TextField label="Stock" type="number" value={stock} onChange={e => setStock(Number(e.target.value))} />
          <TextField label="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
          <Button variant="contained" onClick={handleSubmit}>Crear</Button>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        </Stack>
      </Box>
    </Modal>
  );
}
