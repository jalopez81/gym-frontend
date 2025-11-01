'use client'

import { Entrenador } from "@/types";
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
  TextField
} from "@mui/material";
import { useState } from "react";

interface SesionTemp {
  fechaHora: string;
}

interface ClaseFormDialogProps {
  open: boolean;
  onClose: () => void;
  newClase: any;
  setNewClase: (data: any) => void;
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

  const handleAddSesion = () => {
    if (!sesionNueva.fechaHora) return;
    setSesiones([...sesiones, sesionNueva]);
    setSesionNueva({ fechaHora: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Agregar Nueva Clase</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={newClase.nombre}
          onChange={(e) => setNewClase({ ...newClase, nombre: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          value={newClase.descripcion}
          onChange={(e) => setNewClase({ ...newClase, descripcion: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Duración (minutos)"
          type="number"
          fullWidth
          value={newClase.duracion}
          onChange={(e) => setNewClase({ ...newClase, duracion: Number(e.target.value) })}
        />
        <TextField
          margin="dense"
          label="Capacidad"
          type="number"
          fullWidth
          value={newClase.capacidad}
          onChange={(e) => setNewClase({ ...newClase, capacidad: Number(e.target.value) })}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-entrenador-label">Entrenador</InputLabel>
          <Select
            labelId="select-entrenador-label"
            id="select-entrenador"
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

        {/* Subformulario de Sesiones */}
        <h3 style={{ marginTop: 20 }}>Sesiones</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <TextField
            type="datetime-local"
            label="Fecha y hora"
            InputLabelProps={{ shrink: true }}
            value={sesionNueva.fechaHora}
            onChange={(e) => setSesionNueva({ fechaHora: e.target.value })}
          />
          <Button variant="outlined" onClick={handleAddSesion}>
            Agregar sesión
          </Button>
        </div>

        {sesiones.length > 0 && (
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha y hora</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sesiones.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(s.fechaHora).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => { onSave(sesiones.map(s => new Date(s.fechaHora).toISOString(),)) }}
          variant="contained"
          disabled={!entrenadorSeleccionado}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
