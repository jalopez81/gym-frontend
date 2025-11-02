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
    MenuItem
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import apiClient from '@/utils/apiClient';
import { Usuario } from '@/types';

interface AddUsuarioProps {
    open: boolean;
    onClose: () => void;
    onGuardado: () => Promise<void>;
    usuario?: Usuario | null;
}


export const AddUsuario: React.FC<AddUsuarioProps> = ({ open, onClose, onGuardado, usuario }) => {
    const [form, setForm] = useState<Partial<Usuario>>({
        nombre: '',
        email: '',
        rol: '',
        status: 'activo',
    });

    useEffect(() => {
        if (usuario) {
            setForm(usuario);
        } else {
            setForm({ nombre: '', email: '', rol: '', status: 'activo' });
        }
    }, [usuario]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name as string]: value }));
    };

    const handleGuardar = async () => {
        try {
            if (usuario?.id) {
                await apiClient.put(`/usuarios/${usuario.id}`, form);
            } else {
                await apiClient.post('/usuarios', form);
            }
            await onGuardado();
            onClose();
        } catch (error) {
            console.error('Error guardando usuario:', error);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleInputChange}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select name="rol" value={form.rol} onChange={handleSelectChange} label="Rol">
                        <MenuItem value="cliente">Cliente</MenuItem>
                        <MenuItem value="entrenador">Entrenador</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select name="status" value={form.status} onChange={handleSelectChange} label="Estado">
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                        <MenuItem value="suspendido">Suspendido</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGuardar}
                    disabled={!form.nombre || !form.email || !form.password}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
