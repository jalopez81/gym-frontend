'use client';

import { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    Stack, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Divider
} from '@mui/material';
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/clases/${clase.id}`, {
        nombre,
        descripcion,
        duracion,
        capacidad,
        entrenadorId
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      // Simplified error extraction
      const message = err.response?.data?.error?.message || "Error al actualizar la clase";
      try {
        const parsed = JSON.parse(message);
        setError(Array.isArray(parsed) ? parsed[0]?.message : message);
      } catch {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="xs" // Keeps it compact on desktop
        PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle component="div">
        <Typography variant="h6" fontWeight="bold">Editar Clase</Typography>
        <Typography variant="caption" color="text.secondary">
          Modifica los detalles de la sesión y el entrenador asignado.
        </Typography>
      </DialogTitle>
      
      <Divider sx={{ mx: 3 }} />

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Nombre de la Clase" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            fullWidth
            size="small"
          />
          <TextField 
            label="Descripción" 
            value={descripcion} 
            onChange={e => setDescripcion(e.target.value)} 
            multiline
            rows={2}
            fullWidth
            size="small"
          />
          
          <Stack direction="row" spacing={2}>
              <TextField 
                label="Duración (min)" 
                type="number" 
                value={duracion} 
                onChange={e => setDuracion(Number(e.target.value))} 
                inputProps={{ min: 1 }}
                size="small"
              />
              <TextField 
                label="Capacidad" 
                type="number" 
                value={capacidad} 
                onChange={e => setCapacidad(Number(e.target.value))} 
                inputProps={{ min: 1 }}
                size="small"
              />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel id="select-entrenador-label">Entrenador</InputLabel>
            <Select
              labelId="select-entrenador-label"
              value={entrenadorId}
              label="Entrenador"
              onChange={(e) => setEntrenadorId(e.target.value as string)}
            >
              {entrenadores?.map((ent) => (
                <MenuItem key={ent.id} value={ent.id}>
                  {ent.usuario.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography variant="caption" sx={{ color: 'error.main', textAlign: 'center', fontWeight: 'bold' }}>
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={loading || !nombre || !entrenadorId}
            sx={{ fontWeight: 'bold', px: 4 }}
        >
          {loading ? 'Guardando...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}