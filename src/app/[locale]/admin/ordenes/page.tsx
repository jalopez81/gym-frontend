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
    Chip,
    Divider,
    Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MainTitle from '@/components/MainTitle';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

const ESTADO_ORDEN = {
    PENDIENTE: 'PENDIENTE',
    COMPLETADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA',
}

export default function AdminOrdenesPage() {
    const { isMobile } = useBreakpoints();
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('TODAS');
    const t = useTranslations('AdminOrders');

    const getStatusColor = (estado: string): "warning" | "success" | "error" | "default" => {
        switch (estado) {
            case 'PENDIENTE': return 'warning';
            case 'COMPLETADA': return 'success';
            case 'CANCELADA': return 'error';
            default: return 'default';
        }
    };

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

    useEffect(() => { fetchOrdenes(); }, []);

    const handleUpdateStatus = async (id: string, nuevoEstado: string) => {
        if (nuevoEstado === ESTADO_ORDEN.CANCELADA && !confirm(t('confirmCancel'))) return;
        if (nuevoEstado === ESTADO_ORDEN.COMPLETADA && !confirm(t('confirmComplete'))) return;
        
        try {
            await apiClient.put(`/ordenes/${id}`, { estado: nuevoEstado });
            setOrdenes((prev) =>
                prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const ordenesFiltradas = ordenes.filter(o => {
        const matchesEstado = estado === 'TODAS' || o.estado === estado;
        const terms = busqueda.toLowerCase().trim().split(/\s+/);
        const matchesSearch = terms.every(term =>
            o.usuario?.nombre.toLowerCase().includes(term) ||
            o.id.toLowerCase().includes(term)
        );
        return matchesEstado && matchesSearch;
    });

    if (loading) return <Box sx={{ p: 4 }}><Typography>{t('loading')}</Typography></Box>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')}/>

            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 4, mt: 2 }}
            >
                <TextField
                    label={t('searchLabel')}
                    variant="outlined"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                    }}
                    sx={{ maxWidth: { sm: 400 } }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>{t('statusLabel')}</InputLabel>
                    <Select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        label={t('statusLabel')}
                    >
                        <MenuItem value='TODAS'>{t('allStatus')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.PENDIENTE}>{t('status.pending')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.COMPLETADA}>{t('status.completed')}</MenuItem>
                        <MenuItem value={ESTADO_ORDEN.CANCELADA}>{t('status.cancelled')}</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {ordenesFiltradas.length === 0 && <Typography color="text.secondary">{t('noOrders')}</Typography>}

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                {ordenesFiltradas.map((orden) => (
                    <Paper 
                        key={orden.id} 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 2, sm: 3 }, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 2 
                        }}
                    >
                        {/* Header Area */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    ID: {orden.id.slice(-8).toUpperCase()}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {orden.usuario?.nombre || '—'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDateTime(orden.creado)}
                                </Typography>
                            </Box>
                            <Chip 
                                label={t(`status.${orden.estado.toLowerCase()}`)} 
                                color={getStatusColor(orden.estado)} 
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Items Table */}
                        <Table size="small" sx={{ mb: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ pl: 0, fontWeight: 'bold' }}>{t('product')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('quantity')}</TableCell>
                                    {!isMobile && <TableCell align="right" sx={{ pr: 0, fontWeight: 'bold' }}>{t('subtotal')}</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orden.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ pl: 0 }}>{item.producto.nombre}</TableCell>
                                        <TableCell align="right">{item.cantidad}</TableCell>
                                        {!isMobile && <TableCell align="right" sx={{ pr: 0 }}>${item.subtotal.toFixed(2)}</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Actions Area */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                Total: ${orden.items.reduce((acc, curr) => acc + curr.subtotal, 0).toFixed(2)}
                            </Typography>
                            
                            {orden.estado === ESTADO_ORDEN.PENDIENTE && (
                                <Stack direction="row" spacing={1}>
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        size="small" 
                                        onClick={() => handleUpdateStatus(orden.id, ESTADO_ORDEN.CANCELADA)}
                                    >
                                        {t('cancelButton')}
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small" 
                                        onClick={() => handleUpdateStatus(orden.id, ESTADO_ORDEN.COMPLETADA)}
                                    >
                                        {t('completeButton')}
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </MyContainer>
    );
}