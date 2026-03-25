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
import { useTranslations } from 'next-intl';

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

export default function AdminConfiguracionPage() {
    const [config, setConfig] = useState<Configuracion | null>(null);
    const [saving, setSaving] = useState(false);
    const [reseteando, setReseteando] = useState(false);
    const { usuario, ROLES } = useAuthStore();
    const t = useTranslations('AdminConfiguration');

    const metodosPagoDisponibles = [
        { value: 'Tarjeta', label: t('paymentMethodOptions.card') },
        { value: 'Efectivo', label: t('paymentMethodOptions.cash') },
        { value: 'Transferencia', label: t('paymentMethodOptions.transfer') },
        { value: 'PayPal', label: t('paymentMethodOptions.paypal') }
    ];

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await apiClient.get('/configuracion');
                setConfig(res.data);
                localStorage.setItem('config', JSON.stringify(res.data));
            } catch (err: unknown) {
                if (err && typeof err === 'object' && 'response' in err) {
                    const error = err as { response?: { status?: number } };
                    if (error.response?.status === 404) {
                        // Si no hay configuración, inicializamos una vacía para crearla
                        const defaultConfig: Configuracion = {
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
                            colorPrincipal: '#a43f4a',
                            colorSecundario: '#ffcc29',
                            creadoEn: '',
                            actualizadoEn: '',
                        };
                        setConfig(defaultConfig);
                        localStorage.setItem('config', JSON.stringify(defaultConfig));
                    } else {
                        alert(t('errorLoading'));
                    }
                } else {
                    alert(t('errorLoading'));
                }
            }
        };
        fetchConfig();
    }, [t]);

    const handleChange = (field: keyof Configuracion, value: string | number | boolean | string[]) => {
        if (config) {
            const nextConfig = { ...config, [field]: value };
            setConfig(nextConfig);
            localStorage.setItem('config', JSON.stringify(nextConfig));
        }
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
        } catch (err: unknown) {
            console.error(err);
            const error = err as { response?: { data?: { mensaje?: string } } };
            alert(error.response?.data?.mensaje || t('errorSaving'));
        } finally {
            setSaving(false);
        }
    };

    const handleResetear = async () => {
        setReseteando(true);
        try {
            await apiClient.post('/dev/reset-db');
        } catch (err: unknown) {
            console.error(err);
            const error = err as { response?: { data?: { mensaje?: string } } };
            alert(error.response?.data?.mensaje || t('errorResetting'));
        } finally {
            setReseteando(false);
        }
    }


    if (!config) return <Typography>{t('loading')}</Typography>;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')} />

            <Paper sx={{ p: 3, maxWidth: 950, mx: 'auto', mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('gymName')}
                            value={config.nombreGimnasio}
                            onChange={(e) => handleChange('nombreGimnasio', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('address')} value={config.direccion} onChange={(e) => handleChange('direccion', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('phone')} value={config.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('contactEmail')} value={config.emailContacto} onChange={(e) => handleChange('emailContacto', e.target.value)} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>{t('currency')}</InputLabel>
                            <Select value={config.moneda} label={t('currency')} onChange={(e) => handleChange('moneda', e.target.value)}>
                                {monedas.map((m) => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label={t('taxes')}
                            type="number"
                            value={config.impuestos}
                            onChange={(e) => handleChange('impuestos', parseFloat(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label={t('sessionDuration')} type="number" value={config.duracionSesionMinutos} onChange={(e) => handleChange('duracionSesionMinutos', parseInt(e.target.value))} />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label={t('openingTime')} type="time" value={config.horarioApertura} onChange={(e) => handleChange('horarioApertura', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label={t('closingTime')} type="time" value={config.horarioCierre} onChange={(e) => handleChange('horarioCierre', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth label={t('maxClassesPerDay')} type="number" value={config.maxClasesPorDia} onChange={(e) => handleChange('maxClasesPorDia', parseInt(e.target.value))} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.permitirReservas} onChange={(e) => handleChange('permitirReservas', e.target.checked)} />} label={t('allowReservations')} />
                        <FormControlLabel control={<Switch checked={config.permitirPagoOnline} onChange={(e) => handleChange('permitirPagoOnline', e.target.checked)} />} label={t('allowOnlinePayment')} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>{t('paymentMethods')}</InputLabel>
                            <Select multiple value={config.metodosPago} label={t('paymentMethods')} onChange={(e) => handleChange('metodosPago', e.target.value as string[])}>
                                {metodosPagoDisponibles.map((mp) => (
                                    <MenuItem key={mp.value} value={mp.value}>{mp.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.notificarEmail} onChange={(e) => handleChange('notificarEmail', e.target.checked)} />} label={t('notifyEmail')} />
                        <TextField fullWidth label={t('notificationEmail')} value={config.emailNotificaciones} onChange={(e) => handleChange('emailNotificaciones', e.target.value)} sx={{ mt: 1 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={config.notificarWhatsapp} onChange={(e) => handleChange('notificarWhatsapp', e.target.checked)} />} label={t('notifyWhatsapp')} />
                        {config.notificarWhatsapp && (
                            <TextField fullWidth label={t('whatsappNumber')} value={config.whatsappNumero} onChange={(e) => handleChange('whatsappNumero', e.target.value)} sx={{ mt: 1 }} />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('logoUrl')} value={config.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth type="color" label={t('primaryColor')} value={config.colorPrincipal} onChange={(e) => handleChange('colorPrincipal', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField fullWidth type="color" label={t('secondaryColor')} value={config.colorSecundario} onChange={(e) => handleChange('colorSecundario', e.target.value)} />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                    {(process.env.NODE_ENV === 'development' && usuario?.rol === ROLES.ADMIN) && (<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="secondary" onClick={handleResetear} disabled={saving}>
                            {reseteando ? t('resetting') : t('resetButton')}
                        </Button>
                    </Box>)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleGuardar} disabled={saving}>
                            {saving ? t('saving') : t('saveButton')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </MyContainer>
    );
}
