'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';

const EstadisticasUsuario = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const fetchUsuarios = async () => {
    // Fixed path: removed double /api
    const res = await apiClient.get('/usuarios');
    setUsuarios(res.data);
  };

  const fetchEstadisticas = async (id: string) => {
    if (!id) return;
    setCargando(true);
    try {
        // Fixed path: adjusted to match common patterns
        const res = await apiClient.get(`/asistencias/estadisticas/${id}`);
        setDatos(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setCargando(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  useEffect(() => {
    if (usuarioId) fetchEstadisticas(usuarioId);
  }, [usuarioId]);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📈 Estadísticas de Asistencia
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <FormControl fullWidth sx={{ maxWidth: 400, mb: 4 }}>
            <InputLabel>Seleccionar Usuario</InputLabel>
            <Select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            label="Seleccionar Usuario"
            >
            {usuarios.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                {u.nombre} ({u.email})
                </MenuItem>
            ))}
            </Select>
        </FormControl>

        <Box sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cargando ? (
                <CircularProgress />
            ) : datos.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="asistencias" fill="#1976d2" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <Typography color="text.secondary">
                    {usuarioId ? "No hay asistencias registradas para este periodo." : "Selecciona un usuario para ver su progreso."}
                </Typography>
            )}
        </Box>
      </Paper>
    </Box>
  );
};

export default EstadisticasUsuario;