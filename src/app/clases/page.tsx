'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import apiClient from '@/utils/apiClient';
import MyContainer from '@/components/Container';
import { Clase, Reserva, Sesion } from '@/types';
import CheckIcon from '@mui/icons-material/Check';

export default function ClasesPage() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);

    const alreadyReservado = (reservas: Reserva[], sesion: Sesion) => {
        const reserva = reservas.find(res => res.sesionId === sesion.id)
        const estado = reserva?.estado;
        return estado === 'reservado'
    }

    const fetchClases = async () => {
        try {
            const [resClases, resReservas] = await Promise.all([
                apiClient.get('/clases'),
                apiClient.get('/reservas'),
            ])
            setClases(resClases.data);
            setReservas(resReservas.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClases();
    }, []);

    const handleReserva = async (sesion: Sesion, reservas: Reserva[]) => {
        try {
            let res;
            const reservaEliminar = reservas.find(res => res.sesionId === sesion.id)

            if (alreadyReservado(reservas, sesion)) {
                res = await apiClient.delete(`/reservas/${reservaEliminar?.id}`)
            } else {
                res = await apiClient.post(`/reservas/${sesion.id}`)
            }
            if (res.status === 201) {
                const newReserva = res.data;
                setReservas(prev => [...prev, newReserva])
            }
            console.log(res)
        } catch (err) {
            console.error(err);
        }finally{
            await fetchClases();
        }
    };


    if (loading) return <Typography>Cargando clases...</Typography>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <Typography variant="h4">Clases</Typography>

            {clases.length === 0 && <Typography>No hay clases disponibles.</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {clases.map((clase: Clase) => (
                    <Paper key={clase.id} sx={{ p: 2, width: 300 }}>
                        {/* Detalles de la clase */}
                        <Box className="clases-detalles">
                            <Typography variant="h6">{clase.nombre}</Typography>
                            <Typography>Instructor: {clase.entrenador.usuario.nombre}</Typography>
                            <Typography>Duración: {clase.duracion} minutos</Typography>
                            <Typography>Cupo: {clase.capacidad}</Typography>
                        </Box>

                        {/* Sesiones */}
                        <Box className="clases-sesiones" sx={{ mt: 2 }}>
                            {clase.sesiones.length > 0 && <Typography variant="subtitle1">Reservar sesiones:</Typography>}
                            {clase.sesiones.length === 0 && (
                                <Typography color="text.secondary">No hay sesiones disponibles</Typography>
                            )}
                            {clase.sesiones.map((sesion) => (
                                <Button
                                    key={sesion.id}
                                    variant="outlined"
                                    sx={{
                                        mt: 1, width: '100%', justifyContent: 'space-between',
                                        background: alreadyReservado(reservas, sesion) ? '#F5F5DC' : 'auto'
                                    }}
                                    disabled={sesion.reservas.length >= clase.capacidad}
                                    onClick={() => handleReserva(sesion, reservas)}
                                >
                                    {new Date(sesion.fechaHora).toLocaleString()}
                                    {alreadyReservado(reservas, sesion) && <CheckIcon sx={{ color: 'green' }} />}
                                    <Typography variant="body2" color="text.secondary">
                                        {sesion.reservas.map(r=> r.estado === 'reservado').length}/{clase.capacidad}
                                    </Typography>
                                </Button>
                            ))}
                        </Box>
                    </Paper>
                ))}
            </Box>

        </MyContainer>
    );
}
