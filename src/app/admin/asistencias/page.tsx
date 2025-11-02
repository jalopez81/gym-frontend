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

const AdminAsistencias = () => {
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [nueva, setNueva] = useState({ clienteId: '', sesionId: '' });

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
            headerName: 'Cliente',
            flex: 1,
            valueGetter: (value, row) => row.cliente?.nombre ?? '',
        },
        {
            field: 'clase',
            headerName: 'Clase',
            flex: 1,
            valueGetter: (value, row) => row.sesion.clase?.nombre ?? '',
        },
        {
            field: 'sesion',
            headerName: 'Sesión',
            flex: 1,
            valueGetter: (value, row) => formatDateTime(row.sesion?.fechaHora) ?? '',
        },
        { field: 'estado', headerName: 'Estado', flex: 1 },
        {
            field: 'horaEntrada',
            headerName: 'Hora entrada',
            flex: 1,
            valueGetter: (value, row) => formatDateTime(row.horaEntrada) ?? '',
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
                Asistencias
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 1, justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <Box>
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Cliente</InputLabel>
                        <Autocomplete
                            value={clientes.find(c => c.id === filtroCliente) || null}
                            onChange={(_, nuevo) => setFiltroCliente(nuevo ? nuevo.id : '')}
                            options={clientes}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) => <TextField {...params} label="Cliente" />}
                            sx={{ minWidth: 180 }}
                        />
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="asistio">Asistió</MenuItem>
                            <MenuItem value="ausente">Ausente</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Registrar asistencia
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
