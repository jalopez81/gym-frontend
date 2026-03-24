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
    IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';
import { formatDateTime } from '@/utils';
import { AddUsuario } from './AddUsuario';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslations } from 'next-intl';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filtroRol, setFiltroRol] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
    const [editando, setEditando] = useState(false);
    const t = useTranslations('AdminUsers');

    const handleEditar = (usuario: Usuario) => {
        setUsuarioEditar(usuario);
        setOpenDialog(true);
        setEditando(true);
    };


    const fetchUsuarios = async () => {
        const res = await apiClient.get('/usuarios');
        setUsuarios(res.data);
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);


    const columnas: GridColDef<Usuario>[] = [
        { field: 'nombre', headerName: t('name'), flex: 1 },
        { field: 'email', headerName: t('email'), flex: 1 },
        { field: 'rol', headerName: t('role'), flex: 1 },
        { field: 'status', headerName: t('status'), flex: 1 },
        {
            field: 'creado',
            headerName: t('registrationDate'),
            flex: 1,
            valueGetter: (value) => formatDateTime(value),
        },
        {
            field: 'acciones',
            headerName: t('actions'),
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
                {t('title')}
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
                        label={t('searchPlaceholder')}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>{t('roleLabel')}</InputLabel>
                        <Select
                            value={filtroRol}
                            onChange={(e) => setFiltroRol(e.target.value)}
                            label={t('roleLabel')}
                        >
                            <MenuItem value="">{t('allRoles')}</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="entrenador">Entrenador</MenuItem>
                            <MenuItem value="cliente">Cliente</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button variant="contained" color="primary" onClick={() => {
                    setUsuarioEditar(null);
                    setEditando(false);
                    setOpenDialog(true);
                }}>
                    {t('createButton')}
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
                editando={editando}
            />
        </Box>
    );
};

export default AdminUsuarios;
