'use client';

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
  IconButton,
  Box,
  Stack,
  Divider
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import apiClient from "@/utils/apiClient";
import { isAxiosError } from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useBreakpoints } from "@/utils/useMediaQuery";

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

export default function EditSesion({ open, onClose, claseId }: SesionFormDialogProps) {
  const { isMobile } = useBreakpoints();
  const [fechaHora, setFechaHora] = useState<string>("");
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues by ensuring dates only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchSesiones = useCallback(async () => {
    if (!claseId) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/sesiones/clase/${claseId}`);
      setSesiones(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [claseId]);

  useEffect(() => {
    if (open) fetchSesiones();
  }, [open, fetchSesiones]);

  const handleSave = async () => {
    if (!fechaHora) return;
    try {
      setError(null);
      await apiClient.post("/sesiones", {
        claseId,
        fechaHora: new Date(fechaHora).toISOString(),
      });
      setFechaHora("");
      await fetchSesiones();
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al guardar la sesión");
      } else {
        setError("Ocurrió un error inesperado");
      }
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Gestionar Sesiones</DialogTitle>
      
      <DialogContent dividers>
        {/* Form section to add new session */}
        <Box sx={{ mb: 4, mt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            Programar nueva sesión
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              type="datetime-local"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              fullWidth
              onFocus={() => setError(null)}
            />
            <Button 
              variant="contained" 
              onClick={handleSave} 
              startIcon={<AddIcon />}
              disabled={!fechaHora}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Agregar
            </Button>
          </Stack>
          {error && (
            <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
              {error}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">SESIONES EXISTENTES</Typography>
        </Divider>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : sesiones.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            No hay sesiones programadas para esta clase.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha y hora</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 'bold' }}>Creado</TableCell>}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sesiones.map((sesion) => (
                <TableRow key={sesion.id} hover>
                  <TableCell>
                    {isClient ? new Date(sesion.fechaHora).toLocaleString([], { 
                      dateStyle: 'short', 
                      timeStyle: 'short' 
                    }) : '...'}
                  </TableCell>
                  {!isMobile && (
                    <TableCell  color="text.secondary">
                      {isClient ? new Date(sesion.creado).toLocaleDateString() : '...'}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(sesion.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}