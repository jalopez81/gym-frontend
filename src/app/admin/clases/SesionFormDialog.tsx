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
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";

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

  const handleSave = async () => {
    if (!fechaHora) return;
    await apiClient.post("/sesiones", { claseId, fechaHora: new Date(fechaHora).toISOString(),
 });
    setFechaHora("");
    await fetchSesiones();
  };

  useEffect(() => {
    if (open && claseId) fetchSesiones();
  }, [open, claseId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sesiones de la clase</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {sesiones.length === 0 ? (
              <Typography>No hay sesiones para esta clase</Typography>
            ) : (
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha y hora</TableCell>
                    <TableCell>Creado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sesiones.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{new Date(s.fechaHora).toLocaleString()}</TableCell>
                      <TableCell>{new Date(s.creado).toLocaleString()}</TableCell>
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
              />
              <Button variant="outlined" onClick={handleSave}>
                Agregar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
