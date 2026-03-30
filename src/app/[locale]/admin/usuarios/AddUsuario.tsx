'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
    Typography,
    Divider
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';

interface AddUsuarioProps {
    open: boolean;
    onClose: () => void;
    onGuardado: () => Promise<void>;
    usuario?: Usuario | null;
    editando: boolean;
}

export const AddUsuario: React.FC<AddUsuarioProps> = ({ open, onClose, onGuardado, usuario, editando }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Partial<Usuario>>({
        nombre: '',
        email: '',
        rol: 'cliente',
        status: 'activo',
    });

    useEffect(() => {
        if (open) {
            if (usuario) {
                setForm(usuario);
            } else {
                setForm({ nombre: '', email: '', rol: 'cliente', status: 'activo' });
            }
        }
    }, [usuario, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name as string]: value }));
    };

    const handleGuardar = async () => {
        setLoading(true);
        try {
            if (usuario?.id) {
                await apiClient.put(`/usuarios/${usuario.id}`, form);
            } else {
                await apiClient.post('auth/registro/admin', {
                    ...form,
                    codigoGeneradoHash: '123456',
                    codigoRecibido: '123456'
                });
            }
            await onGuardado();
            onClose();
        } catch (error) {
            console.error('Error guardando usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs" // Keeps it a small, elegant box
            scroll="paper" // Ensures internal scrolling if content is long
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }} component="div">
                <Typography variant="h6" fontWeight="bold" component="h2"> 
                    {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="p">
                    {editando ? 'Modifica los datos del perfil' : 'Registra un nuevo miembro en el sistema'}
                </Typography>
            </DialogTitle>

            <Divider sx={{ mx: 3 }} />

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    disabled={loading}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    disabled={loading}
                />

                {!editando && (
                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={form.password || ''}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        disabled={loading}
                    />
                )}

                <FormControl fullWidth size="small">
                    <InputLabel>Rol</InputLabel>
                    <Select name="rol" value={form.rol} onChange={handleSelectChange} label="Rol" disabled={loading}>
                        <MenuItem value="cliente">Cliente</MenuItem>
                        <MenuItem value="entrenador">Entrenador</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select name="status" value={form.status} onChange={handleSelectChange} label="Estado" disabled={loading}>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                        <MenuItem value="suspendido">Suspendido</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} color="inherit" sx={{ fontWeight: 'bold' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleGuardar}
                    disabled={loading || !form.nombre || !form.email || (!form.password && !editando)}
                    sx={{
                        px: 3,
                        fontWeight: 'bold',
                        minWidth: 100
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}