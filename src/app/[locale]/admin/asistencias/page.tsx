'use client';

import { Asistencia, Reserva, Sesion, Usuario } from '@/types';
import apiClient from '@/utils/apiClient';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Stack,
    Paper,
    Chip,
    Divider
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import AddAsistencia from './AddAsistencia';
import { formatDateTime } from '@/utils';
import { useTranslations } from 'next-intl';
import MainTitle from '@/components/MainTitle';
import { useBreakpoints } from '@/utils/useMediaQuery'; // Asumiendo que tienes este hook

const AdminAsistencias = () => {
    const { isMobile } = useBreakpoints();
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [nueva, setNueva] = useState({ clienteId: '', sesionId: '' });
    const t = useTranslations('AdminAttendance');

    const fetchData = async () => {
        try {
            const [resAsist, resUsers, resSes, resRes] = await Promise.all([
                apiClient.get('/asistencias'),
                apiClient.get('/usuarios'),
                apiClient.get('/sesiones'),
                apiClient.get('/reservas/admin'),
            ]);
            setAsistencias(resAsist.data);
            setClientes(resUsers.data);
            setSesiones(resSes.data);
            setReservas(resRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const asistFiltradas = asistencias.filter(
        (a) =>
            (!filtroCliente || a.clienteId === filtroCliente) &&
            (!filtroEstado || a.estado === filtroEstado)
    );

    const columnas: GridColDef<Asistencia>[] = [
        {
            field: 'cliente',
            headerName: t('client'),
            flex: 1,
            valueGetter: (_, row) => row.cliente?.nombre ?? '—',
        },
        {
            field: 'clase',
            headerName: t('class'),
            flex: 1,
            valueGetter: (_, row) => row.sesion?.clase?.nombre ?? '—',
        },
        {
            field: 'sesion',
            headerName: t('session'),
            flex: 1,
            valueGetter: (_, row) => formatDateTime(row.sesion?.fechaHora) ?? '—',
        },
        { 
            field: 'estado', 
            headerName: t('status'), 
            width: 130,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={params.value === 'asistio' ? 'success' : 'error'} 
                    variant="outlined" 
                />
            )
        },
    ];

    return (
        <Box p={{ xs: 1, sm: 3 }}>
            <MainTitle title={t('title')} />

            {/* Filtros Adaptables */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={clientes}
                        getOptionLabel={(option) => option.nombre || ''}
                        value={clientes.find(c => c.id === filtroCliente) || null}
                        onChange={(_, v) => setFiltroCliente(v ? v.id : '')}
                        renderInput={(params) => <TextField {...params} label={t('clientLabel')} />}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel>{t('statusLabel')}</InputLabel>
                        <Select
                            value={filtroEstado}
                            label={t('statusLabel')}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <MenuItem value="">{t('allStatus')}</MenuItem>
                            <MenuItem value="asistio">{t('attended')}</MenuItem>
                            <MenuItem value="ausente">{t('absent')}</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        fullWidth={isMobile}
                        variant="contained" 
                        onClick={() => setOpenDialog(true)}
                        sx={{ minWidth: 200, height: 40 }}
                    >
                        {t('registerButton')}
                    </Button>
                </Stack>
            </Paper>

            {/* Vista Condicional: DataGrid o Cards */}
            {isMobile ? (
                <Stack spacing={2}>
                    {asistFiltradas.map((asist) => (
                        <Paper key={asist.id} sx={{ p: 2, borderRadius: 2, borderLeft: `5px solid ${asist.estado === 'asistio' ? '#4caf50' : '#f44336'}` }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {asist.cliente?.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {asist.sesion?.clase?.nombre}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={asist.estado} 
                                    size="small" 
                                    color={asist.estado === 'asistio' ? 'success' : 'error'} 
                                />
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" display="block">
                                📅 {formatDateTime(asist.sesion?.fechaHora)}
                            </Typography>
                            {asist.horaEntrada && (
                                <Typography variant="caption" color="primary">
                                    🕒 Entrada: {formatDateTime(asist.horaEntrada)}
                                </Typography>
                            )}
                        </Paper>
                    ))}
                    {asistFiltradas.length === 0 && (
                        <Typography textAlign="center" py={4} color="text.secondary">No hay asistencias</Typography>
                    )}
                </Stack>
            ) : (
                <Box sx={{ height: 650, width: '100%', backgroundColor: 'white', borderRadius: 2, overflow: 'hidden' }}>
                    <DataGrid
                        rows={asistFiltradas}
                        columns={columnas}
                        getRowId={(r) => r.id}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[10, 20]}
                        disableRowSelectionOnClick
                    />
                </Box>
            )}

            <AddAsistencia
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                clientes={clientes}
                sesiones={sesiones}
                reservas={reservas}
                nueva={nueva}
                setNueva={setNueva}
                onGuardar={async () => {
                    await apiClient.post('/asistencias', nueva);
                    setOpenDialog(false);
                    fetchData();
                }}
            />
        </Box>
    );
};

export default AdminAsistencias;