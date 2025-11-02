'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Usuario, Sesion, Reserva } from '@/types';
import { formatDateTime } from '@/utils';

interface RegistrarAsistenciaDialogProps {
  open: boolean;
  onClose: () => void;
  clientes: Usuario[];
  sesiones: Sesion[];
  reservas: Reserva[];
  nueva: { clienteId: string; sesionId: string };
  setNueva: (data: { clienteId: string; sesionId: string }) => void;
  onGuardar: () => void;
}

//RegistrarAsistenciaDialog
export default function AddAsistencia({
  open,
  onClose,
  clientes,
  sesiones,
  reservas,
  nueva,
  setNueva,
  onGuardar
}: RegistrarAsistenciaDialogProps) {

  const sesionesCliente = nueva.clienteId
    ? reservas
      .filter(r => r.clienteId === nueva.clienteId)
      .map(r => sesiones.find(s => s.id === r.sesionId))
      .filter((s): s is Sesion => !!s)
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Registrar Asistencia</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <FormControl fullWidth>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={nueva.clienteId}
            onChange={(e) => setNueva({ ...nueva, clienteId: e.target.value, sesionId: '' })}
            label="Cliente"
          >
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!nueva.clienteId}>
          <InputLabel>Sesión</InputLabel>
          <Select
            value={nueva.sesionId}
            onChange={(e) => setNueva({ ...nueva, sesionId: e.target.value })}
            label="Sesión"
          >
            {sesionesCliente.map((s: any) => (
              <MenuItem key={s.id} value={s.id}>
                {s.clase?.nombre
                  ? `${s.clase.nombre} — ${formatDateTime(s.fechaHora)}`
                  : formatDateTime(s.fechaHora)}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onGuardar}
          disabled={!nueva.clienteId || !nueva.sesionId}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
