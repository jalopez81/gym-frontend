'use client'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import DeleteIcon from '@mui/icons-material/Delete';

interface Sesion {
  id: string;
  fechaHora: string;
  creado: string;
}

interface SesionFormDialogProps {
  open: boolean;
  onClose: () => void;
  claseId: string;
}

export default function SesionFormDialog({ open, onClose, claseId }: SesionFormDialogProps) {
  const [fechaHora, setFechaHora] = useState<string>("");
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const fetchSesiones = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/sesiones/clase/${claseId}`);
      setSesiones(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (open && claseId) fetchSesiones();
  }, [open, claseId]);

  const handleSave = async () => {
    if (!fechaHora) return;
    try {
      await apiClient.post("/sesiones", {
        claseId, fechaHora: new Date(fechaHora).toISOString(),
      });
      setFechaHora("");
      await fetchSesiones();
    } catch (err:any) {
      const message = err.response.data.mensaje;
      setError(message);      
    }
  };

  const handleDelete = async (sesionId: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta sesión?')) return;

    try {
      await apiClient.delete(`/sesiones/${sesionId}`);
      fetchSesiones();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sesiones</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {sesiones.length === 0 ? (
              <Typography variant="caption">No hay sesiones para esta clase</Typography>
            ) : (
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha y hora</TableCell>
                    <TableCell>Creado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sesiones.map((sesion) => (
                    <TableRow key={sesion.id}>
                      <TableCell>{new Date(sesion.fechaHora).toLocaleString()}</TableCell>
                      <TableCell>{new Date(sesion.creado).toLocaleString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(sesion.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Typography sx={{ mt: 2, mb: 1 }}>Agregar nueva sesión</Typography>
            <div style={{ display: "flex", gap: 8 }}>
              <TextField
                type="datetime-local"
                label="Fecha y hora"
                InputLabelProps={{ shrink: true }}
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                fullWidth
                onFocus={()=> setError(null)}
              />
              <Button variant="contained" onClick={handleSave}>
                Agregar
              </Button>
            </div>
              <Typography sx={{color: 'red', paddingTop: 2}}>{error}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
