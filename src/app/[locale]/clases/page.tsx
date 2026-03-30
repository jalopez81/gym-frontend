'use client';

import { Suspense, useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import apiClient from '@/utils/apiClient';
import MyContainer from '@/components/MyContainer';
import { Clase, Reserva, Sesion } from '@/types';
import CheckIcon from '@mui/icons-material/Check';
import SearchClase from './SearchClase';
import MainTitle from '@/components/MainTitle';
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

function ClasesPageContent() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const t = useTranslations('Classes');
    const { isMobile } = useBreakpoints();

    const searchParams = useSearchParams();

    useEffect(()=> {
        const search = searchParams.get('search-class');
        if (search) setSearchTerm(search);
    }, [searchParams])

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
        } catch (err) {
            console.error(err);
        } finally {
            await fetchClases();
        }
    };

    const filteredClases = clases.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Typography>{t('loading')}</Typography>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')}/>
            <SearchClase onSearch={setSearchTerm} />

            {clases.length === 0 && <Typography>{t('noClasses')}</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, ...(isMobile && { justifyContent: 'center' }) }}>
                {filteredClases.map((clase) => (
                    <Paper key={clase.id} sx={{ p: 2, width: 300 }}>
                        {/* Detalles de la clase */}
                        <Box className="clases-detalles">
                            <Typography variant="h4" sx={{ margin: 0}}>{clase.nombre}</Typography>
                            <Typography variant="h6" color="primary">{clase.descripcion}</Typography>
                            <Typography>{t('instructor')}: {clase.entrenador.usuario.nombre}</Typography>
                            <Typography>{t('duration')}: {clase.duracion} {t('minutes')}</Typography>
                            <Typography>{t('capacity')}: {clase.capacidad}</Typography>
                        </Box>

                        {/* Sesiones */}
                        <Box className="clases-sesiones" sx={{ mt: 2 }}>
                            {clase.sesiones.length > 0 && <Typography variant="subtitle1">{t('reserveSessions')}</Typography>}
                            {clase.sesiones.length === 0 && (
                                <Typography color="text.secondary">{t('noSessions')}</Typography>
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
                                        {sesion.reservas.filter(r => r.estado === 'reservado').length}/{clase.capacidad}
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


export default function ClasesPage() {
    const t = useTranslations('Classes');

    return (
        <Suspense fallback={<Typography>{t('loading')}</Typography>}>
            <ClasesPageContent />
        </Suspense>
    );
}