'use client';

import { useEffect, useState, useCallback } from 'react';
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
    Divider,
    Stack,
    CircularProgress,
} from '@mui/material';
import MainTitle from '@/components/MainTitle';
import MyContainer from '@/components/MyContainer';
import apiClient from '@/utils/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery'; // Assuming you have this helper

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
    const { isMobile } = useBreakpoints();
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

    const fetchConfig = useCallback(async () => {
        try {
            const res = await apiClient.get('/configuracion');
            setConfig(res.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
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
            }
        }
    }, []);

    useEffect(() => { fetchConfig(); }, [fetchConfig]);

    const handleChange = (field: keyof Configuracion, value: any) => {
        if (config) setConfig({ ...config, [field]: value });
    };

    const handleGuardar = async () => {
        if (!config) return;
        setSaving(true);
        try {
            const method = config.id ? 'put' : 'post';
            const url = config.id ? `/configuracion/${config.id}` : '/configuracion';
            const res = await apiClient[method](url, config);
            setConfig(res.data);
            alert(t('saveSuccess')); // Good to have feedback
        } catch (err: any) {
            alert(err.response?.data?.mensaje || t('errorSaving'));
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

    if (!config) return (
        <Box display="flex" justifyContent="center" pt={10}><CircularProgress /></Box>
    );

    const SectionTitle = ({ title }: { title: string }) => (
        <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mt: 2, mb: 1 }}>
                {title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
        </Grid>
    );

    return (
        <MyContainer sx={{ py: { xs: 2, md: 4 } }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')} />

            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 950, mx: 'auto', mt: 2, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    
                    {/* SECTION: General Info */}
                    <SectionTitle title={t('sections.general')} />
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('gymName')} value={config.nombreGimnasio} onChange={(e) => handleChange('nombreGimnasio', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label={t('contactEmail')} value={config.emailContacto} onChange={(e) => handleChange('emailContacto', e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={t('address')} value={config.direccion} onChange={(e) => handleChange('direccion', e.target.value)} />
                    </Grid>

                    {/* SECTION: Operations */}
                    <SectionTitle title={t('sections.operations')} />
                    <Grid item xs={6} sm={4}>
                        <TextField fullWidth label={t('openingTime')} type="time" InputLabelProps={{ shrink: true }} value={config.horarioApertura} onChange={(e) => handleChange('horarioApertura', e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField fullWidth label={t('closingTime')} type="time" InputLabelProps={{ shrink: true }} value={config.horarioCierre} onChange={(e) => handleChange('horarioCierre', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>{t('currency')}</InputLabel>
                            <Select value={config.moneda} label={t('currency')} onChange={(e) => handleChange('moneda', e.target.value)}>
                                {monedas.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* SECTION: Policies */}
                    <SectionTitle title={t('sections.policies')} />
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label={t('sessionDuration')} type="number" value={config.duracionSesionMinutos} onChange={(e) => handleChange('duracionSesionMinutos', parseInt(e.target.value))} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label={t('maxClassesPerDay')} type="number" value={config.maxClasesPorDia} onChange={(e) => handleChange('maxClasesPorDia', parseInt(e.target.value))} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label={t('taxes')} type="number" value={config.impuestos} onChange={(e) => handleChange('impuestos', parseFloat(e.target.value))} />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControlLabel control={<Switch checked={config.permitirReservas} onChange={(e) => handleChange('permitirReservas', e.target.checked)} />} label={t('allowReservations')} />
                            <FormControlLabel control={<Switch checked={config.permitirPagoOnline} onChange={(e) => handleChange('permitirPagoOnline', e.target.checked)} />} label={t('allowOnlinePayment')} />
                        </Stack>
                    </Grid>

                    {/* SECTION: Notifications */}
                    <SectionTitle title={t('sections.notifications')} />
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <FormControlLabel control={<Switch checked={config.notificarEmail} onChange={(e) => handleChange('notificarEmail', e.target.checked)} />} label={t('notifyEmail')} />
                            <TextField fullWidth label={t('notificationEmail')} size="small" value={config.emailNotificaciones} onChange={(e) => handleChange('emailNotificaciones', e.target.value)} sx={{ mt: 1 }} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <FormControlLabel control={<Switch checked={config.notificarWhatsapp} onChange={(e) => handleChange('notificarWhatsapp', e.target.checked)} />} label={t('notifyWhatsapp')} />
                            <TextField fullWidth label={t('whatsappNumber')} size="small" value={config.whatsappNumero} onChange={(e) => handleChange('whatsappNumero', e.target.value)} sx={{ mt: 1 }} disabled={!config.notificarWhatsapp} />
                        </Paper>
                    </Grid>

                    {/* SECTION: Customization */}
                    <SectionTitle title={t('sections.appearance')} />
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

                {/* Footer Buttons */}
                <Box sx={{ 
                    mt: 4, 
                    pt: 2, 
                    borderTop: '1px solid #eee',
                    display: 'flex', 
                    flexDirection: { xs: 'column-reverse', sm: 'row' }, 
                    justifyContent: 'space-between', 
                    gap: 2 
                }}>
                    {(process.env.NODE_ENV === 'development' && usuario?.rol === ROLES.ADMIN) && (
                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={handleResetear} 
                            disabled={reseteando}
                            fullWidth={isMobile}
                        >
                            {reseteando ? t('resetting') : t('resetButton')}
                        </Button>
                    )}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleGuardar} 
                        disabled={saving}
                        fullWidth={isMobile}
                        sx={{ minWidth: 200 }}
                    >
                        {saving ? t('saving') : t('saveButton')}
                    </Button>
                </Box>
            </Paper>
        </MyContainer>
    );
}