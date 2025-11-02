import { useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';

const EstadisticasUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const fetchUsuarios = async () => {
    const res = await apiClient.get('/api/usuarios');
    setUsuarios(res.data);
  };

  const fetchEstadisticas = async (id: string) => {
    if (!id) return;
    setCargando(true);
    const res = await apiClient.get(`/api/asistencia/estadisticas/${id}`);
    setDatos(res.data);
    setCargando(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioId) fetchEstadisticas(usuarioId);
  }, [usuarioId]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Estadísticas de Asistencia
      </Typography>

      <FormControl sx={{ minWidth: 240, mb: 3 }}>
        <InputLabel>Usuario</InputLabel>
        <Select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          label="Usuario"
        >
          {usuarios.map((u:Usuario) => (
            <MenuItem key={u.id} value={u.id}>
              {u.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {cargando ? (
        <CircularProgress />
      ) : datos.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="asistencias" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body1">No hay datos para mostrar.</Typography>
      )}
    </Box>
  );
};

export default EstadisticasUsuario;
