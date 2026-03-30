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
import { useBreakpoints } from '@/utils/useMediaQuery';

const AdminUsuarios = () => {
    const { isMobile } = useBreakpoints();
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
        try {
            const res = await apiClient.get('/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    
    const columnas: GridColDef<Usuario>[] = [
        { 
            field: 'nombre', 
            headerName: t('name'), 
            flex: 1, 
            minWidth: 150 
        },
        { 
            field: 'email', 
            headerName: t('email'), 
            flex: 1.5, 
            minWidth: 200,
            hideable: true, 
        },
        { 
            field: 'rol', 
            headerName: t('role'), 
            width: 120 
        },
        { 
            field: 'status', 
            headerName: t('status'), 
            width: 100,            
        },
        {
            field: 'creado',
            headerName: t('registrationDate'),
            width: 150,
            valueGetter: (value) => value ? formatDateTime(value) : '',
        },
        {
            field: 'acciones',
            headerName: t('actions'),
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton color="primary" onClick={() => handleEditar(params.row)}>
                    <EditIcon fontSize="small" />
                </IconButton>
            ),
        },
    ];
    
    const visibleColumns = columnas.filter(col => {
        if (isMobile) {            
            return ['nombre', 'rol', 'acciones'].includes(col.field);
        }
        return true;
    });

    const filtrados = usuarios.filter(
        (u) =>
            (!filtroRol || u.rol === filtroRol) &&
            (!busqueda || u.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <Box p={{ xs: 1, sm: 3 }}>
            <Typography variant="h5" mb={3} fontWeight="bold">
                {t('title')}
            </Typography>

            {/* Responsive Filter Bar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    mb: 3,
                    p: 2,
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        label={t('searchPlaceholder')}
                        variant="outlined"
                        size="small"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ minWidth: { sm: 250 } }}
                    />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
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

                <Button 
                    variant="contained" 
                    disableElevation
                    onClick={() => {
                        setUsuarioEditar(null);
                        setEditando(false);
                        setOpenDialog(true);
                    }}
                    sx={{ height: 40 }}
                >
                    {t('createButton')}
                </Button>
            </Box>

            {/* Data Grid Container */}
            <Box sx={{ height: 600, width: '100%', backgroundColor: 'white', borderRadius: 2 }}>
                <DataGrid
                    rows={filtrados}
                    columns={visibleColumns}
                    getRowId={(r) => r.id}
                    pageSizeOptions={[10, 20, 50]}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    }}
                />
            </Box>

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