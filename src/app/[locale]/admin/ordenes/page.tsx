'use client';

import MyContainer from '@/components/MyContainer';
import { Orden } from '@/types';
import { formatDateTime } from '@/utils';
import apiClient from '@/utils/apiClient';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MainTitle from '@/components/MainTitle';
import { useTranslations } from 'next-intl';

const ESTADO_ORDEN = {
    PENDIENTE: 'PENDIENTE',
    COMPLETADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA',
}

const getStatusColor = (estado: string) => {
    const COLORS: Record<string, string> = {
        'PENDIENTE': 'orange',
        'COMPLETADA': 'green',
        'CANCELADA': 'red',
    };
    return COLORS[estado] || 'gray';
};


export default function AdminOrdenesPage() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('');
    const t = useTranslations('AdminOrders');

    const ordenesFiltradas = ordenes.filter(o => {
        const terms = busqueda.toLowerCase().trim().split(/\s+/);
        return terms.every(term =>
            o.usuario.nombre.toLowerCase().includes(term) ||
            o.id.toLowerCase().includes(term) ||
            o.estado.toLowerCase().includes(term)
        );
    });


    const fetchOrdenes = async () => {
        try {
            const res = await apiClient.get('/ordenes');
            setOrdenes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    const handleCompletar = async (id: string, nuevoEstado: string) => {
        try {
            await apiClient.put(`/ordenes/${id}`, { estado: nuevoEstado });
            setOrdenes((prev) =>
                prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelar = async (id: string) => {
        if (!confirm(t('confirmCancel'))) return;
        try {
            const res = await apiClient.delete(`/ordenes/${id}`);
            if (res.status === 200) {
                setOrdenes(prev =>
                    prev.map(o =>
                        o.id === id ? { ...o, estado: ESTADO_ORDEN.CANCELADA } : o
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };


    if (loading) return <Typography>{t('loading')}</Typography>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')}/>

            {ordenes.length === 0 && <Typography>{t('noOrders')}</Typography>}

            <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                <TextField
                    label={t('searchLabel')}
                    variant="outlined"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 400}}
                />
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>{t('statusLabel')}</InputLabel>
                    <Select
                        value={estado}
                        onChange={(e) => { setEstado(e.target.value); setBusqueda(e.target.value === 'TODAS' ? '' : e.target.value) }}
                        label={t('statusLabel')}
                        size='small'
                    >
                        <MenuItem value='TODAS'>{t('allStatus')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.PENDIENTE}>{t('status.pending')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.COMPLETADA}>{t('status.completed')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.CANCELADA}>{t('status.cancelled')}</MenuItem>
                    </Select>
                </FormControl>

            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {ordenesFiltradas.map((orden) => (
                    <Paper key={orden.id} sx={{ mb: 3, p: 2, minWidth: 600, maxWidth: 950, flexDirection: 'column', justifyContent: 'space-between', display: 'flex' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>
                                    <b>{t('orderId')}:</b> {orden.id}
                                </Typography>

                                <Typography>
                                    <b>{t('user')}:</b> {orden.usuario?.nombre || '—'}
                                </Typography>
                                <Typography mb={2}>
                                    <b>{t('date')}:</b> {formatDateTime(orden.creado)}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: getStatusColor(orden.estado), fontWeight: 'bold' }}>
                                {t('statusText')}: {orden.estado.toUpperCase()}
                            </Typography>
                        </Box>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('product')}</TableCell>
                                    <TableCell align="right">{t('quantity')}</TableCell>
                                    <TableCell align="right">{t('subtotal')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orden.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.producto.nombre}</TableCell>
                                        <TableCell align="right">{item.cantidad}</TableCell>
                                        <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {orden.estado === ESTADO_ORDEN.PENDIENTE && (
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', mt: 1, flex: 1, alignItems: 'end' }}>
                                <Button variant="outlined" color="error" size="small" sx={{ mt: 1 }} onClick={() => handleCancelar(orden.id)}>{t('cancelButton')}</Button>
                                <Button variant="contained" color="error" size="small" sx={{ mt: 1 }} onClick={() => handleCompletar(orden.id, ESTADO_ORDEN.COMPLETADA)}>{t('completeButton')}</Button>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Box>
        </MyContainer>
    );
}
