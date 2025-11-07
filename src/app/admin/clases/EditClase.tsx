'use client';

import { useState } from 'react';
import { Modal, Box, TextField, Button, Stack, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import apiClient from '@/utils/apiClient';
import { Clase, Entrenador } from '@/types';

interface EditClaseDialogProps {
  open: boolean;
  onClose: () => void;
  clase: Clase;
  onUpdated: () => void;
  entrenadores: Entrenador[];
}

export default function EditClase({ open, onClose, clase, onUpdated, entrenadores }: EditClaseDialogProps) {
  const [nombre, setNombre] = useState(clase.nombre);
  const [descripcion, setDescripcion] = useState(clase.descripcion || '');
  const [duracion, setDuracion] = useState(clase.duracion);
  const [entrenadorId, setEntrenadorId] = useState(clase.entrenador?.id || '');
  const [capacidad, setCapacidad] = useState(clase.capacidad);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await apiClient.put(`/clases/${clase.id}`, {
        nombre,
        descripcion,
        duracion,
        capacidad,
        entrenadorId
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      const errorMessages = err.response.data.error.message
      const errorMsg = JSON.parse(errorMessages)[0].message
      setError(errorMsg)
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: '10%' }}>
        <Stack spacing={2}>
          <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <TextField label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <TextField label="Duración (min)" type="number" value={duracion} onChange={e => setDuracion(Number(e.target.value))} inputProps={{ min: 1 }} />
          <TextField label="Capacidad" type="number" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))} inputProps={{ min: 1 }} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-entrenador-label">Entrenador</InputLabel>
            <Select
              labelId="select-entrenador-label"
              value={entrenadorId}
              onChange={(e) => setEntrenadorId(e.target.value)}
            >
              {entrenadores?.map((ent) => (
                <MenuItem key={ent.id} value={ent.id}>
                  {ent.usuario.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleSubmit}>Actualizar</Button>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        </Stack>
        <Typography sx={{ color: 'red', paddingTop: 2 }}>{error}</Typography>
      </Box>
    </Modal>
  );
}
