'use client';

import { useMemo } from 'react'; import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
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

    const sesionesCliente = useMemo(() => {
    if (!nueva.clienteId) return [];
    
    return reservas
      .filter(r => r.clienteId === nueva.clienteId)
      .map(r => sesiones.find(s => s.id === r.sesionId))
      .filter((s): s is Sesion => !!s);
  }, [nueva.clienteId, reservas, sesiones]);

    const idsClientesConReserva = useMemo(() => {
    return new Set(reservas.map(r => r.clienteId));
  }, [reservas]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Asistencia</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        
        {/* Selector de Cliente */}
        <FormControl fullWidth>
          <InputLabel id="select-cliente-label">Cliente</InputLabel>
          <Select
            labelId="select-cliente-label"
            value={nueva.clienteId}
            onChange={(e) => setNueva({ ...nueva, clienteId: e.target.value, sesionId: '' })}
            label="Cliente"
          >
            {clientes
              .filter(c => idsClientesConReserva.has(c.id))               .map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Selector de Sesión */}
        <FormControl fullWidth disabled={!nueva.clienteId}>
          <InputLabel id="select-sesion-label">Sesión Reservada</InputLabel>
          <Select
            labelId="select-sesion-label"
            value={nueva.sesionId}
            onChange={(e) => setNueva({ ...nueva, sesionId: e.target.value })}
            label="Sesión Reservada"
          >
            {sesionesCliente.length > 0 ? (
              sesionesCliente.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.clase?.nombre
                    ? `${s.clase.nombre} — ${formatDateTime(s.fechaHora)}`
                    : formatDateTime(s.fechaHora)}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay reservas para este cliente</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onGuardar}
          disabled={!nueva.clienteId || !nueva.sesionId}
        >
          Confirmar Asistencia
        </Button>
      </DialogActions>
    </Dialog>
  );
}