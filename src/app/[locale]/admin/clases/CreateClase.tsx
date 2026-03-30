'use client';

import { ClaseForm, Entrenador } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  IconButton,
  Box,
  Divider
} from "@mui/material";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface SesionTemp {
  fechaHora: string;
}

interface ClaseFormDialogProps {
  open: boolean;
  onClose: () => void;
  newClase: ClaseForm;  
  setNewClase: Dispatch<SetStateAction<ClaseForm>>;
  entrenadorSeleccionado: string;
  setEntrenadorSeleccionado: (id: string) => void;
  entrenadores: Entrenador[];
  onSave: (sesiones: string[]) => Promise<void>;
}

export default function CreateClase({
  open,
  onClose,
  newClase,
  setNewClase,
  entrenadorSeleccionado,
  setEntrenadorSeleccionado,
  entrenadores,
  onSave
}: ClaseFormDialogProps) {

  const [sesionNueva, setSesionNueva] = useState<SesionTemp>({ fechaHora: '' });
  const [sesiones, setSesiones] = useState<SesionTemp[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration for date rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddSesion = () => {
    if (!sesionNueva.fechaHora) return;
    setSesiones([...sesiones, sesionNueva]);
    setSesionNueva({ fechaHora: '' });
  };

  const handleRemoveSesion = (index: number) => {
    setSesiones(sesiones.filter((_, i) => i !== index));
  };

  const handleFinalSave = () => {
    const isoSesiones = sesiones.map(s => new Date(s.fechaHora).toISOString());
    onSave(isoSesiones);
    setSesiones([]); // Reset for next time
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Nueva Clase</DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre de la Clase"
            fullWidth
            size="small"
            value={newClase.nombre}
            onChange={(e) => setNewClase({ ...newClase, nombre: e.target.value })}
          />
          
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={newClase.descripcion}
            onChange={(e) => setNewClase({ ...newClase, descripcion: e.target.value })}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Minutos"
              type="number"
              fullWidth
              size="small"
              value={newClase.duracion}
              onChange={(e) => setNewClase({ ...newClase, duracion: Number(e.target.value) })}
            />
            <TextField
              label="Cupo"
              type="number"
              fullWidth
              size="small"
              value={newClase.capacidad}
              onChange={(e) => setNewClase({ ...newClase, capacidad: Number(e.target.value) })}
            />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel id="select-entrenador-label">Entrenador</InputLabel>
            <Select
              labelId="select-entrenador-label"
              label="Entrenador"
              value={entrenadorSeleccionado}
              onChange={(e) => setEntrenadorSeleccionado(e.target.value)}
            >
              {entrenadores.map((ent) => (
                <MenuItem key={ent.id} value={ent.id}>
                  {ent.usuario.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Programar Sesiones Iniciales
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                type="datetime-local"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={sesionNueva.fechaHora}
                onChange={(e) => setSesionNueva({ fechaHora: e.target.value })}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddSesion}
                disabled={!sesionNueva.fechaHora}
                startIcon={<AddIcon />}
              >
                Añadir
              </Button>
            </Stack>

            {sesiones.length > 0 && (
              <Table size="small" sx={{ mt: 2, border: '1px solid #eee' }}>
                <TableBody>
                  {sesiones.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ py: 0.5 }}>
                        {isClient ? new Date(s.fechaHora).toLocaleString([], { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                        }) : '...'}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 0.5 }}>
                        <IconButton size="small" color="error" onClick={() => handleRemoveSesion(i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleFinalSave}
          variant="contained"
          disabled={!entrenadorSeleccionado || !newClase.nombre}
          sx={{ px: 4, fontWeight: 'bold' }}
        >
          Guardar Clase
        </Button>
      </DialogActions>
    </Dialog>
  );
}