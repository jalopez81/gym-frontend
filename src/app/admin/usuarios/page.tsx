'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';
import { formatDateTime } from '@/utils';
import { AddUsuario } from './AddUsuario';
import EditIcon from '@mui/icons-material/Edit';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filtroRol, setFiltroRol] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

    const handleEditar = (usuario: Usuario) => {
        setUsuarioEditar(usuario);
        setOpenDialog(true);
    };


    const fetchUsuarios = async () => {
        const res = await apiClient.get('/usuarios');
        setUsuarios(res.data);
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);


    const columnas: GridColDef<Usuario>[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'rol', headerName: 'Rol', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'creado',
            headerName: 'Fecha registro',
            flex: 1,
            valueGetter: (value, row) => formatDateTime(row.creado),
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            renderCell: (params) => (
                <IconButton onClick={() => handleEditar(params.row)}><EditIcon /></IconButton>                
            ),
        },

    ];

    const filtrados = usuarios.filter(
        (u) =>
            (!filtroRol || u.rol === filtroRol) &&
            (!busqueda || u.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Usuarios
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    p: 1,
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Buscar por nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={filtroRol}
                            onChange={(e) => setFiltroRol(e.target.value)}
                            label="Rol"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="entrenador">Entrenador</MenuItem>
                            <MenuItem value="cliente">Cliente</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Crear usuario
                </Button>
            </Box>

            <DataGrid
                rows={filtrados}
                columns={columnas}
                getRowId={(r) => r.id}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
            />

            <AddUsuario
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setUsuarioEditar(null);
                }}
                onGuardado={fetchUsuarios}
                usuario={usuarioEditar}
            />
        </Box>
    );
};

export default AdminUsuarios;
