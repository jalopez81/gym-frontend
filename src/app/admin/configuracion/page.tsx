'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
} from '@mui/material';
import MainTitle from '@/components/MainTitle';
import MyContainer from '@/components/MyContainer';
import apiClient from '@/utils/apiClient';
import { useAuthStore } from '@/store/authStore';

type Configuracion = {
    id: string;
    nombreGimnasio: string;
    direccion: string;
    telefono: string;
    emailContacto: string;
    moneda: string;
    impuestos: number;
    horarioApertura: string;
    horarioCierre: string;
    permitirReservas: boolean;
    duracionSesionMinutos: number;
    maxClasesPorDia: number;
    permitirPagoOnline: boolean;
    metodosPago: string[];
    notificarEmail: boolean;
    emailNotificaciones: string;
    notificarWhatsapp: boolean;
    whatsappNumero: string;
    logoUrl: string;
    colorPrincipal: string;
    colorSecundario: string;
    creadoEn: string;
    actualizadoEn: string;
};

const monedas = ['USD', 'DOP', 'EUR', 'MXN'];
const metodosPagoDisponibles = ['Tarjeta', 'Efectivo', 'Transferencia', 'PayPal'];

export default function AdminConfiguracionPage() {
    const [config, setConfig] = useState<Configuracion | null>(null);
    const [saving, setSaving] = useState(false);
    const [reseteando, setReseteando] = useState(false);
    const { usuario, ROLES } = useAuthStore();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await apiClient.get('/configuracion');
                setConfig(res.data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    // Si no hay configuración, inicializamos una vacía para crearla
                    setConfig({
                        id: '',
                        nombreGimnasio: '',
                        direccion: '',
                        telefono: '',
                        emailContacto: '',
                        moneda: 'DOP',
                        impuestos: 0,
                        horarioApertura: '06:00',
                        horarioCierre: '22:00',
                        permitirReservas: false,
                        duracionSesionMinutos: 60,
                        maxClasesPorDia: 3,
                        permitirPagoOnline: false,
                        metodosPago: [],
                        notificarEmail: false,
                        emailNotificaciones: '',
                        notificarWhatsapp: false,
                        whatsappNumero: '',
                        logoUrl: '',
                        colorPrincipal: '#1976d2',
                        colorSecundario: '#9c27b0',
                        creadoEn: '',
                        actualizadoEn: '',
                    });
                } else {
                    alert('Error al cargar configuración');
                }
            }
        };
        fetchConfig();
    }, []);
    ;

    const handleChange = (field: keyof Configuracion, value: any) => {
        if (config) setConfig({ ...config, [field]: value });
    };

    const handleGuardar = async () => {

        if (!config) return;
        setSaving(true);
        try {
            if (config.id) {
                const res = await apiClient.put(`/configuracion/${config.id}`, config);
                setConfig(res.data);
            } else {
                const res = await apiClient.post('/configuracion', config);
                setConfig(res.data);
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.mensaje || 'Error al guardar configuración.');
        } finally {
            setSaving(false);
        }
    };

    const handleResetear = async () => {
        setReseteando(true);
        try {
            const res = await apiClient.post('/dev/reset-db');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.mensaje || 'Error al resetear.');
        } finally {
            setReseteando(false);
        }
    }


    if (!config) return <Typography>Cargando configuración...</Typography>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title="Configuración del Gimnasio" subtitle="Ajustes generales y de funcionamiento" />

            <Paper sx={{ p: 3, maxWidth: 950, mx: 'auto', mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre del gimnasio"
                            value={config.nombreGimnasio}
                            onChange={(e) => handleChange('nombreGimnasio', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Dirección" value={config.direccion} onChange={(e) => handleChange('direccion', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Teléfono" value={config.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Email de contacto" value={config.emailContacto} onChange={(e) => handleChange('emailContacto', e.target.value)} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Moneda</InputLabel>
                            <Select value={config.moneda} label="Moneda" onChange={(e) => handleChange('moneda', e.target.value)}>
                                {monedas.map((m) => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Impuestos (%)"
                            type="number"
                            value={config.impuestos}
                            onChange={(e) => handleChange('impuestos', parseFloat(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Duración de sesión (min)" type="number" value={config.duracionSesionMinutos} onChange={(e) => handleChange('duracionSesionMinutos', parseInt(e.target.value))} />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Horario apertura" type="time" value={config.horarioApertura} onChange={(e) => handleChange('horarioApertura', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Horario cierre" type="time" value={config.horarioCierre} onChange={(e) => handleChange('horarioCierre', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Máx. clases por día" type="number" value={config.maxClasesPorDia} onChange={(e) => handleChange('maxClasesPorDia', parseInt(e.target.value))} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.permitirReservas} onChange={(e) => handleChange('permitirReservas', e.target.checked)} />} label="Permitir reservas online" />
                        <FormControlLabel control={<Switch checked={config.permitirPagoOnline} onChange={(e) => handleChange('permitirPagoOnline', e.target.checked)} />} label="Permitir pago online" />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Métodos de pago</InputLabel>
                            <Select multiple value={config.metodosPago} onChange={(e) => handleChange('metodosPago', e.target.value as string[])}>
                                {metodosPagoDisponibles.map((mp) => (
                                    <MenuItem key={mp} value={mp}>{mp}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.notificarEmail} onChange={(e) => handleChange('notificarEmail', e.target.checked)} />} label="Notificar por Email" />
                        <TextField fullWidth label="Email de notificaciones" value={config.emailNotificaciones} onChange={(e) => handleChange('emailNotificaciones', e.target.value)} sx={{ mt: 1 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.notificarWhatsapp} onChange={(e) => handleChange('notificarWhatsapp', e.target.checked)} />} label="Notificar por WhatsApp" />
                        {config.notificarWhatsapp && (
                            <TextField fullWidth label="Número WhatsApp" value={config.whatsappNumero} onChange={(e) => handleChange('whatsappNumero', e.target.value)} sx={{ mt: 1 }} />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="URL del logo" value={config.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth type="color" label="Color principal" value={config.colorPrincipal} onChange={(e) => handleChange('colorPrincipal', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth type="color" label="Color secundario" value={config.colorSecundario} onChange={(e) => handleChange('colorSecundario', e.target.value)} />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                    {(process.env.NODE_ENV === 'development' && usuario?.rol === ROLES.ADMIN) && (<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="secondary" onClick={handleResetear} disabled={saving}>
                            {reseteando ? 'Reseteando...' : 'Resetear'}
                        </Button>
                    </Box>)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleGuardar} disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </MyContainer>
    );
}
