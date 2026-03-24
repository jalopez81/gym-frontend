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
    Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import AddAsistencia from './AddAsistencia';
import { formatDateTime } from '@/utils';
import { useTranslations } from 'next-intl';

const AdminAsistencias = () => {
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [nueva, setNueva] = useState({ clienteId: '', sesionId: '' });
    const t = useTranslations('AdminAttendance');

    const fetchAsistencias = async () => {
        const res = await apiClient.get('/asistencias');
        setAsistencias(res.data);
    };

    const fetchReservas = async () => {
        const res = await apiClient.get('/reservas/admin');
        setReservas(res.data);
    };

    const fetchClientes = async () => {
        const res = await apiClient.get('/usuarios');
        setClientes(res.data);
    };

    const fetchSesiones = async () => {
        const res = await apiClient.get('/sesiones');
        setSesiones(res.data);
    };


    useEffect(() => {
        fetchAsistencias();
        fetchClientes();
        fetchSesiones();
        fetchReservas();
    }, []);

    const handleCrear = async () => {
        await apiClient.post('/asistencias', nueva);
        setOpenDialog(false);
        setNueva({ clienteId: '', sesionId: '' });
        fetchAsistencias();
    };

    const columnas: GridColDef<Asistencia>[] = [
        {
            field: 'cliente',
            headerName: t('client'),
            flex: 1,
            valueGetter: (_, row) => row.cliente.nombre ?? 'Sin nombre',
        },
        {
            field: 'clase',
            headerName: t('class'),
            flex: 1,
            valueGetter: (_, row) => row.sesion.clase.nombre ?? 'Sin nombre',
        },
        {
            field: 'sesion',
            headerName: t('session'),
            flex: 1,
            valueGetter: (_, row) => formatDateTime(row.sesion?.fechaHora) ?? 'Sin fecha',
        },
        { field: 'estado', headerName: t('status'), flex: 1 },
        {
            field: 'horaEntrada',
            headerName: t('entryTime'),
            flex: 1,
            valueGetter: (_, row) => formatDateTime(row.horaEntrada) ?? 'Sin hora',
        },
    ];


    const asistFiltradas = asistencias.filter(
        (a) =>
            (!filtroCliente || a.clienteId === filtroCliente) &&
            (!filtroEstado || a.estado === filtroEstado)
    );

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                {t('title')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 1, justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <Box>
                    <FormControl sx={{ minWidth: 180 }}>
                        <Autocomplete
                            value={clientes.find(c => c.id === filtroCliente) || null}
                            onChange={(_, nuevo) => setFiltroCliente(nuevo ? nuevo.id : '')}
                            options={clientes}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) => <TextField {...params} label={t('clientLabel')} />}
                            sx={{ minWidth: 180 }}
                        />
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>{t('statusLabel')}</InputLabel>
                        <Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            label={t('statusLabel')}
                        >
                            <MenuItem value="">{t('allStatus')}</MenuItem>
                            <MenuItem value="asistio">{t('attended')}</MenuItem>
                            <MenuItem value="ausente">{t('absent')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    {t('registerButton')}
                </Button>
            </Box>

            <DataGrid
                rows={asistFiltradas}
                columns={columnas}
                getRowId={(r) => r.id}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
            />

            <AddAsistencia
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                clientes={clientes}
                sesiones={sesiones}
                reservas={reservas}
                nueva={nueva}
                setNueva={setNueva}
                onGuardar={handleCrear}
            />

        </Box>
    );
};

export default AdminAsistencias;
