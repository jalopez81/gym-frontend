'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import apiClient from '@/utils/apiClient';
import MyContainer from '@/components/Container';
import { Clase } from '@/types';

export default function ClasesPage() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const res = await apiClient.get('/clases');
                setClases(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClases();
    }, []);

    const handleReserva = async (sesionId: string) => {
        try {
            await apiClient.post('/reservas', { sesionId });
            alert('Reserva realizada correctamente');
        } catch (err) {
            console.error(err);
            alert('No se pudo realizar la reserva');
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
                            <Typography variant="subtitle1">Sesiones:</Typography>
                            {clase.sesiones.length === 0 && (
                                <Typography color="text.secondary">No hay sesiones disponibles</Typography>
                            )}
                            {clase.sesiones.map((sesion) => (
                                <Button
                                    key={sesion.id}
                                    variant="outlined"
                                    sx={{ mt: 1, width: '100%', justifyContent: 'space-between' }}
                                    disabled={sesion.reservas.length >= clase.capacidad} // deshabilita si ya no hay cupo
                                    onClick={() => handleReserva(sesion.id)}
                                >
                                    {new Date(sesion.fechaHora).toLocaleString()}
                                    <Typography variant="body2" color="text.secondary">
                                        {sesion.reservas.length}/{clase.capacidad}
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
